import React, { useEffect, useRef, useState } from 'react';
import { Mail, Linkedin, Github, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { io } from 'socket.io-client';
import {
  requestNotificationPermission,
  triggerAlertNotification
} from '../utils/notification';

const CUSTOMER_THREAD_STORAGE_KEY = 'aya_portfolio_customer_thread';
const RAW_BACKEND_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_SOCKET_URL ||
  'https://portfolio-production-f0c02f01.up.railway.app';
const BACKEND_URL = String(RAW_BACKEND_URL).replace(/\/+$/, '');
const SOCKET_URL = BACKEND_URL;

export default function Contact({ onMessageSent }) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState({ loading: false, text: '', success: false });
  const [threadEmail, setThreadEmail] = useState('');
  const [threadToken, setThreadToken] = useState('');
  const [customerThreads, setCustomerThreads] = useState([]);
  const [followUpText, setFollowUpText] = useState({});
  const knownReplyIdsRef = useRef(new Set());
  const isFirstThreadLoadRef = useRef(true);
  const { t, i18n } = useTranslation();
  const isAr = i18n.language?.startsWith('ar');

  const syncKnownReplies = (threadsList, shouldNotifyNewAdminReplies = false) => {
    const nextIds = new Set();

    (threadsList || []).forEach((thread) => {
      (thread.replies || []).forEach((rep) => {
        const repKey = String(rep.id || `${rep.sender}-${rep.createdAt || ''}-${rep.message || ''}`);
        nextIds.add(repKey);

        if (
          shouldNotifyNewAdminReplies &&
          rep.sender === 'admin' &&
          !knownReplyIdsRef.current.has(repKey)
        ) {
          triggerAlertNotification({
            title: isAr ? 'رد جديد على رسالتك' : 'New Reply on Your Message',
            body:
              String(rep.message || '').trim() ||
              (isAr ? 'وصلك رد جديد على محادثتك.' : 'You received a new reply in your chat.'),
            tag: `reply-${repKey}`,
            onClickUrl: '/#contact'
          });
        }
      });
    });

    knownReplyIdsRef.current = nextIds;
  };

  const loadCustomerThread = async (emailToLoad, tokenToLoad, options = {}) => {
    const { notifyOnNewAdminReply = false } = options;
    const cleanEmail = String(emailToLoad || '').trim().toLowerCase();
    if (!cleanEmail) return;
    try {
      const params = new URLSearchParams({ email: cleanEmail });
      if (tokenToLoad) params.set('token', tokenToLoad);
      const res = await fetch(`${BACKEND_URL}/api/messages/thread?${params.toString()}`);
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.data)) {
        setCustomerThreads(data.data);

        if (isFirstThreadLoadRef.current) {
          syncKnownReplies(data.data, false);
          isFirstThreadLoadRef.current = false;
        } else {
          syncKnownReplies(data.data, notifyOnNewAdminReply);
        }
      }
    } catch {
      // Keep existing thread view if offline
    }
  };

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(CUSTOMER_THREAD_STORAGE_KEY) || 'null');
      if (saved?.email) {
        isFirstThreadLoadRef.current = true;
        setThreadEmail(saved.email);
        setThreadToken(saved.token || '');
        loadCustomerThread(saved.email, saved.token || '', { notifyOnNewAdminReply: false });
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  useEffect(() => {
    if (!threadEmail) return;

    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling']
    });

    socket.emit('join_thread', { email: threadEmail, token: threadToken });

    const handleThreadUpdate = (payload) => {
      const targetEmail = String(payload?.email || '').trim().toLowerCase();
      if (!targetEmail || targetEmail === threadEmail.trim().toLowerCase()) {
        loadCustomerThread(threadEmail, threadToken, { notifyOnNewAdminReply: true });
      }
    };

    socket.on('message_reply', handleThreadUpdate);
    socket.on('thread_updated', handleThreadUpdate);

    return () => {
      socket.off('message_reply', handleThreadUpdate);
      socket.off('thread_updated', handleThreadUpdate);
      socket.disconnect();
    };
  }, [threadEmail, threadToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, text: '', success: false });
    requestNotificationPermission();

    try {
      const res = await fetch(`${BACKEND_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();

      if (res.ok && data.success) {
        const submittedEmail = form.email.trim().toLowerCase();
        const returnedToken = data.threadToken || data.data?.threadToken || '';

        setStatus({ loading: false, text: data.message, success: true });
        setForm({ name: '', email: '', subject: '', message: '' });

        isFirstThreadLoadRef.current = true;
        setThreadEmail(submittedEmail);
        setThreadToken(returnedToken);
        localStorage.setItem(
          CUSTOMER_THREAD_STORAGE_KEY,
          JSON.stringify({ email: submittedEmail, token: returnedToken })
        );

        await loadCustomerThread(submittedEmail, returnedToken, { notifyOnNewAdminReply: false });
        onMessageSent?.(data.data);
      } else {
        throw new Error(data.error || 'Submission failed');
      }
    } catch {
      setStatus({
        loading: false,
        text: t('contact.fallbackSuccess', { name: form.name }),
        success: true
      });
      setForm({ name: '', email: '', subject: '', message: '' });
      onMessageSent?.();
    }
  };

  const handleCustomerFollowUp = async (e, msgId) => {
    e.preventDefault();
    const text = String(followUpText[msgId] || '').trim();
    if (!text) return;

    requestNotificationPermission();

    try {
      const res = await fetch(`${BACKEND_URL}/api/messages/${encodeURIComponent(msgId)}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          sender: 'customer',
          senderName: threadEmail || 'Customer'
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setFollowUpText((prev) => ({ ...prev, [msgId]: '' }));
        await loadCustomerThread(threadEmail, threadToken, { notifyOnNewAdminReply: false });
      }
    } catch {
      // Ignore network error
    }
  };

  return (
    <section className="section" id="contact">
      <div className="container">
        <div className="contact-wrapper">
          <div className="contact-left">
            <span className="eyebrow">{t('contact.eyebrow')}</span>
            <h2>{t('contact.title')}</h2>
            <p>{t('contact.subtitle')}</p>

            <div className="contact-studio-img">
              <img
                src="/images/13472.jpg"
                alt={t('contact.studioAlt')}
              />
            </div>

            <div className="contact-channels">
              <a href="mailto:ayaa20736@gmail.com" className="channel-card">
                <Mail size={19} className="icon-cyan" />
                <span>ayaa20736@gmail.com</span>
              </a>
              <a href="https://www.linkedin.com/in/aya-gabr-209527349" target="_blank" rel="noopener noreferrer" className="channel-card">
                <Linkedin size={19} className="icon-indigo" />
                <span>{t('contact.linkedin')}</span>
              </a>
              <a
                href="https://github.com/ayag9470-hub/Aurelle"
                target="_blank"
                rel="noopener noreferrer"
                className="channel-card"
              >
                <Github size={19} className="icon-emerald" />
                <span>{t('contact.github')}</span>
              </a>
            </div>
          </div>

          <div className="contact-right-stack">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="input-row">
                <div className="field">
                  <label>{t('contact.nameLabel')}</label>
                  <input
                    type="text"
                    required
                    placeholder={isAr ? 'اكتب اسمك هنا' : 'Enter your name'}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="field">
                  <label>{t('contact.emailLabel')}</label>
                  <input
                    type="email"
                    required
                    placeholder={isAr ? 'اكتب بريدك الإلكتروني' : 'Enter your email'}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="field">
                <label>{t('contact.subjectLabel')}</label>
                <input
                  type="text"
                  placeholder={t('contact.subjectPlaceholder')}
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                />
              </div>

              <div className="field">
                <label>{t('contact.messageLabel')}</label>
                <textarea
                  rows="4"
                  required
                  placeholder={t('contact.messagePlaceholder')}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
              </div>

              <button type="submit" className="btn btn-primary full" disabled={status.loading}>
                {status.loading ? (
                  t('contact.saving')
                ) : (
                  <>
                    {t('contact.sendBtn')} <Send size={16} />
                  </>
                )}
              </button>

              {status.text && (
                <div className="status-banner">
                  <CheckCircle2 size={17} />
                  <span>{status.text}</span>
                </div>
              )}
            </form>

            {threadEmail && (
              <div className="customer-thread-box">
                <div className="thread-header">
                  <div>
                    <h4>
                      <MessageSquare size={16} />{' '}
                      {isAr ? 'محادثتك الخاصة' : 'Your Private Conversation'}
                    </h4>
                    <small>{threadEmail}</small>
                  </div>
                </div>

                {customerThreads.length === 0 ? (
                  <p className="thread-empty">
                    {isAr
                      ? 'لا توجد رسائل مسجلة لهذا البريد حتى الآن.'
                      : 'No conversation messages found for this email yet.'}
                  </p>
                ) : (
                  customerThreads.map((item) => {
                    const itemId = item._id || item.id;
                    return (
                      <div key={itemId} className="thread-card">
                        <div className="thread-msg-customer">
                          <strong>{isAr ? 'تفاصيل مشروعك:' : 'Your Project Message:'}</strong>
                          <p>{item.message}</p>
                        </div>

                        <div className="thread-replies-list">
                          {(item.replies || []).length === 0 ? (
                            <span className="awaiting-reply">
                              {isAr ? 'في انتظار الرد...' : 'Awaiting reply...'}
                            </span>
                          ) : (
                            (item.replies || []).map((rep) => (
                              <div
                                key={rep.id}
                                className={
                                  rep.sender === 'admin' ? 'reply-bubble admin-reply' : 'reply-bubble customer-reply'
                                }
                              >
                                <strong>{rep.senderName || (rep.sender === 'admin' ? 'Support' : item.name)}</strong>
                                <p>{rep.message}</p>
                              </div>
                            ))
                          )}
                        </div>

                        <form className="thread-followup-form" onSubmit={(e) => handleCustomerFollowUp(e, itemId)}>
                          <input
                            type="text"
                            placeholder={isAr ? 'اكتب رداً أو استفساراً إضافياً...' : 'Write a follow-up message...'}
                            value={followUpText[itemId] || ''}
                            onChange={(e) => setFollowUpText((prev) => ({ ...prev, [itemId]: e.target.value }))}
                          />
                          <button type="submit" className="btn btn-glass">
                            {isAr ? 'إرسال' : 'Send'}
                          </button>
                        </form>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
import React, { useEffect, useRef, useState } from 'react';
import { X, Mail, Trash2, RefreshCw, Search, Send, Lock, Check, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { io } from 'socket.io-client';
import {
  requestNotificationPermission,
  triggerAlertNotification
} from '../utils/notification';

const ADMIN_KEY_STORAGE = 'aya_portfolio_admin_key';
const RAW_BACKEND_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_SOCKET_URL ||
  'https://portfolio-production-f0c02f01.up.railway.app';
const BACKEND_URL = String(RAW_BACKEND_URL).replace(/\/+$/, '');
const SOCKET_URL = BACKEND_URL;

export default function MessagesInboxModal({ isOpen, onClose, onCountChange }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [adminKey, setAdminKey] = useState(() => {
    try {
      return localStorage.getItem(ADMIN_KEY_STORAGE) || 'aya-admin-2026';
    } catch {
      return 'aya-admin-2026';
    }
  });
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [authError, setAuthError] = useState('');
  const [replyDrafts, setReplyDrafts] = useState({});
  const [sendingReplyId, setSendingReplyId] = useState('');
  const knownMessageIdsRef = useRef(new Set());
  const knownCustomerReplyIdsRef = useRef(new Set());
  const isFirstInboxLoadRef = useRef(true);
  const { t, i18n } = useTranslation();
  const isAr = i18n.language?.startsWith('ar');

  const saveAdminKey = (keyVal) => {
    const clean = String(keyVal || '').trim();
    setAdminKey(clean);
    setIsUnlocked(false);
    try {
      localStorage.setItem(ADMIN_KEY_STORAGE, clean);
    } catch {
      // Ignore storage error
    }
  };

  const syncInboxAlerts = (list, notifyIncoming = false) => {
    const nextMsgIds = new Set();
    const nextReplyIds = new Set();

    (list || []).forEach((msg, idx) => {
      const msgKey = String(msg._id || msg.id || `${msg.email || 'msg'}-${idx}`);
      nextMsgIds.add(msgKey);

      if (notifyIncoming && !knownMessageIdsRef.current.has(msgKey)) {
        triggerAlertNotification({
          title: isAr
            ? `رسالة جديدة من ${msg.name || 'عميل'}`
            : `New Message from ${msg.name || 'Client'}`,
          body:
            String(msg.message || '').trim() ||
            msg.subject ||
            (isAr ? 'وصلك رسالة جديدة في الإنسبوك.' : 'You received a new inbox message.'),
          tag: `inbox-msg-${msgKey}`,
          onClickUrl: '/#contact'
        });
      }

      (msg.replies || []).forEach((rep) => {
        if (rep.sender === 'customer') {
          const repKey = String(rep.id || `${msgKey}-${rep.createdAt || ''}-${rep.message || ''}`);
          nextReplyIds.add(repKey);

          if (notifyIncoming && !knownCustomerReplyIdsRef.current.has(repKey)) {
            triggerAlertNotification({
              title: isAr
                ? `متابعة جديدة من ${msg.name || msg.email || 'عميل'}`
                : `New Follow-up from ${msg.name || msg.email || 'Client'}`,
              body:
                String(rep.message || '').trim() ||
                (isAr ? 'أرسل العميل رداً جديداً.' : 'Client sent a new follow-up reply.'),
              tag: `inbox-reply-${repKey}`,
              onClickUrl: '/#contact'
            });
          }
        }
      });
    });

    knownMessageIdsRef.current = nextMsgIds;
    knownCustomerReplyIdsRef.current = nextReplyIds;
  };

  const fetchMessages = async (keyOverride, options = {}) => {
    const { notifyOnIncoming = false } = options;
    const activeKey = String(keyOverride ?? adminKey).trim();
    setLoading(true);
    setAuthError('');

    try {
      const res = await fetch(`${BACKEND_URL}/api/messages`, {
        headers: activeKey ? { 'x-admin-key': activeKey } : {}
      });

      if (res.status === 401) {
        setIsUnlocked(false);
        setMessages([]);
        onCountChange?.(0);
        setAuthError(
          isAr
            ? 'مفتاح الدخول غير صحيح. اكتب المفتاح الصحيح ثم اضغط تفعيل لعرض الرسائل.'
            : 'Invalid Admin Key. Enter a valid key and click Unlock to view messages.'
        );
        return;
      }

      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.data)) {
        setIsUnlocked(true);
        setAuthError('');
        setMessages(data.data);
        onCountChange?.(data.data.length);

        if (isFirstInboxLoadRef.current) {
          syncInboxAlerts(data.data, false);
          isFirstInboxLoadRef.current = false;
        } else {
          syncInboxAlerts(data.data, notifyOnIncoming);
        }
      } else {
        setIsUnlocked(false);
        setMessages([]);
        onCountChange?.(0);
        setAuthError(
          data?.error ||
            (isAr ? 'تعذر التحقق من الصلاحية.' : 'Failed to verify admin access.')
        );
      }
    } catch {
      setIsUnlocked(false);
      setMessages([]);
      onCountChange?.(0);
      setAuthError(
        isAr
          ? 'تعذر الاتصال بالسيرفر. تأكد أن السيرفر يعمل.'
          : 'Could not connect to server. Make sure the server is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      isFirstInboxLoadRef.current = true;
      fetchMessages(undefined, { notifyOnIncoming: false });
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !isUnlocked) return;

    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling']
    });

    socket.emit('join_admin');

    const handleRealtimeInboxEvent = () => {
      fetchMessages(adminKey, { notifyOnIncoming: true });
    };

    socket.on('new_message', handleRealtimeInboxEvent);
    socket.on('message_reply', handleRealtimeInboxEvent);
    socket.on('thread_updated', handleRealtimeInboxEvent);

    return () => {
      socket.off('new_message', handleRealtimeInboxEvent);
      socket.off('message_reply', handleRealtimeInboxEvent);
      socket.off('thread_updated', handleRealtimeInboxEvent);
      socket.disconnect();
    };
  }, [isOpen, isUnlocked, adminKey]);

  if (!isOpen) return null;

  const handleUnlockClick = () => {
    isFirstInboxLoadRef.current = true;
    requestNotificationPermission();
    fetchMessages(adminKey, { notifyOnIncoming: false });
  };

  const handleDeleteMessage = async (id) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/messages/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: adminKey ? { 'x-admin-key': adminKey } : {}
      });
      if (res.ok) {
        fetchMessages(undefined, { notifyOnIncoming: false });
        return;
      }
    } catch {
      // Ignore error
    }
    setMessages((prev) => {
      const updated = prev.filter((m) => String(m._id || m.id) !== String(id));
      onCountChange?.(updated.length);
      return updated;
    });
  };

  const handleSendReply = async (e, msg) => {
    e.preventDefault();
    const mid = msg._id || msg.id;
    const text = String(replyDrafts[mid] || '').trim();
    if (!text) return;

    requestNotificationPermission();
    setSendingReplyId(String(mid));
    try {
      const res = await fetch(`${BACKEND_URL}/api/messages/${encodeURIComponent(mid)}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(adminKey ? { 'x-admin-key': adminKey } : {})
        },
        body: JSON.stringify({
          message: text,
          sender: 'admin',
          senderName: isAr ? 'المهندسة آية جبر' : 'Eng. Aya Gabr'
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setReplyDrafts((prev) => ({ ...prev, [mid]: '' }));
        if (data.data) {
          setMessages((prev) => {
            const next = prev.map((item) =>
              String(item._id || item.id) === String(mid) ? data.data : item
            );
            syncInboxAlerts(next, false);
            return next;
          });
        } else {
          await fetchMessages(undefined, { notifyOnIncoming: false });
        }
      }
    } catch {
      // Ignore error
    } finally {
      setSendingReplyId('');
    }
  };

  const filtered = isUnlocked
    ? messages.filter((m) => {
        const q = query.toLowerCase();
        return (
          m.name?.toLowerCase().includes(q) ||
          m.email?.toLowerCase().includes(q) ||
          m.subject?.toLowerCase().includes(q) ||
          m.message?.toLowerCase().includes(q)
        );
      })
    : [];

  const dateLocale = i18n.language?.startsWith('ar') ? 'ar-EG' : undefined;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel inbox-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-top">
          <div className="inbox-title-wrap">
            <h3>{t('inbox.titleWithCount', { count: isUnlocked ? messages.length : 0 })}</h3>
            <p>{t('inbox.subtitle')}</p>
          </div>

          <div className="inbox-top-actions">
            <button
              type="button"
              className="icon-action"
              onClick={() => fetchMessages(undefined, { notifyOnIncoming: false })}
              title={t('inbox.refresh')}
            >
              <RefreshCw size={16} className={loading ? 'spin' : ''} />
            </button>
            <button
              type="button"
              className="icon-action"
              onClick={onClose}
              title={t('inbox.close')}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="admin-key-bar">
          <Lock size={15} />
          <input
            type="password"
            placeholder={isAr ? 'مفتاح الدخول الخاص بك (Admin Key)' : 'Enter Admin Key'}
            value={adminKey}
            onChange={(e) => saveAdminKey(e.target.value)}
          />
          <button
            type="button"
            className="btn btn-glass"
            onClick={handleUnlockClick}
            disabled={loading}
          >
            <Check size={14} /> {isAr ? 'تفعيل' : 'Unlock'}
          </button>
        </div>

        {isUnlocked && (
          <div className="status-banner">
            <ShieldCheck size={15} />
            <span>
              {isAr
                ? 'تم تفعيل الدخول بنجاح — الرسائل مفعّلة ومحمية.'
                : 'Access unlocked — private messages are active.'}
            </span>
          </div>
        )}

        {authError && (
          <div className="status-banner">
            <span>{authError}</span>
          </div>
        )}

        {isUnlocked && (
          <div className="search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder={t('inbox.searchPlaceholder')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        )}

        <div className="inbox-list">
          {!isUnlocked ? (
            <div className="empty-inbox">
              <Lock size={28} />
              <p>
                {isAr
                  ? 'الإنبوكس مقفول حالياً. أدخل المفتاح الصحيح واضغط "تفعيل" لعرض الرسائل.'
                  : 'Inbox is locked. Enter a valid Admin Key and click "Unlock" to view messages.'}
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-inbox">
              <Mail size={28} />
              <p>{t('inbox.empty')}</p>
            </div>
          ) : (
            filtered.map((msg, index) => {
              const mid = msg._id || msg.id || index;
              const replies = Array.isArray(msg.replies) ? msg.replies : [];

              return (
                <div key={mid} className="message-card">
                  <div className="message-head">
                    <div>
                      <strong>{msg.name}</strong>
                      <span className="msg-email"> • {msg.email}</span>
                      <div className="msg-subject">
                        {msg.subject || t('inbox.defaultSubject')}
                      </div>
                    </div>

                    <div className="msg-right">
                      <span className="msg-date">
                        {msg.createdAt
                          ? new Date(msg.createdAt).toLocaleDateString(dateLocale)
                          : t('inbox.recent')}
                      </span>
                      <button
                        type="button"
                        className="danger-btn"
                        onClick={() => handleDeleteMessage(mid)}
                        title={t('inbox.deleteTitle')}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <p className="msg-body">{msg.message}</p>

                  {replies.length > 0 && (
                    <div className="inbox-replies-thread">
                      {replies.map((rep) => (
                        <div
                          key={rep.id}
                          className={
                            rep.sender === 'admin'
                              ? 'reply-bubble admin-reply'
                              : 'reply-bubble customer-reply'
                          }
                        >
                          <strong>
                            {rep.senderName ||
                              (rep.sender === 'admin'
                                ? isAr
                                  ? 'المهندسة آية جبر'
                                  : 'Eng. Aya Gabr'
                                : msg.name)}
                          </strong>
                          <p>{rep.message}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <form
                    className="inbox-reply-form"
                    onSubmit={(e) => handleSendReply(e, msg)}
                  >
                    <input
                      type="text"
                      placeholder={
                        isAr
                          ? 'اكتب ردك هنا ليصل للعميل في محادثته الخاصة...'
                          : 'Write your private reply to this customer...'
                      }
                      value={replyDrafts[mid] || ''}
                      onChange={(e) =>
                        setReplyDrafts((prev) => ({ ...prev, [mid]: e.target.value }))
                      }
                    />
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={sendingReplyId === String(mid)}
                    >
                      <Send size={14} /> {isAr ? 'إرسال الرد' : 'Reply'}
                    </button>
                  </form>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
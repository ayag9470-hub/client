import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import ProjectManagerModal from './components/ProjectManagerModal';
import MessagesInboxModal from './components/MessagesInboxModal';
import EmbeddedSiteModal from './components/EmbeddedSiteModal';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { fallbackProjects } from './data/portfolioData';
import { initOneSignal } from './utils/notification';

const ADMIN_KEY_STORAGE = 'aya_portfolio_admin_key';
const RAW_BACKEND_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_SOCKET_URL ||
  'https://portfolio-production-f0c02f01.up.railway.app';
const BACKEND_URL = String(RAW_BACKEND_URL).replace(/\/+$/, '');

function getStoredAdminKey() {
  try {
    return localStorage.getItem(ADMIN_KEY_STORAGE) || '';
  } catch {
    return '';
  }
}

export default function App() {
  const [projects, setProjects] = useState(fallbackProjects);
  const [managerOpen, setManagerOpen] = useState(false);
  const [inboxOpen, setInboxOpen] = useState(false);
  const [embeddedSite, setEmbeddedSite] = useState(null);
  const [messagesCount, setMessagesCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(() => Boolean(getStoredAdminKey()));
  const [backendStatus, setBackendStatus] = useState({
    apiOnline: false,
    databaseConnected: false,
    storageMode: 'Local Ready'
  });

  const loadProjects = () => {
    fetch(`${BACKEND_URL}/api/projects`)
      .then((res) => res.json())
      .then((payload) => {
        if (payload?.success && Array.isArray(payload.data) && payload.data.length > 0) {
          setProjects(payload.data);
        }
      })
      .catch(() => {});
  };

  const loadMessagesCount = () => {
    const adminKey = getStoredAdminKey();
    if (!adminKey) {
      setMessagesCount(0);
      return;
    }

    fetch(`${BACKEND_URL}/api/messages`, {
      headers: { 'x-admin-key': adminKey }
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((payload) => {
        if (payload?.success && Array.isArray(payload.data)) {
          setMessagesCount(payload.data.length);
        }
      })
      .catch(() => {});
  };

  const handleAdminLogin = async (onSuccess) => {
    let key = getStoredAdminKey();

    if (!key) {
      const entered = window.prompt('أدخلي مفتاح الأدمن (Admin Key):');
      if (!entered || !entered.trim()) return;
      key = entered.trim();
    }

    try {
      const res = await fetch(`${BACKEND_URL}/api/messages`, {
        headers: { 'x-admin-key': key }
      });

      if (res.ok) {
        localStorage.setItem(ADMIN_KEY_STORAGE, key);
        setIsAdmin(true);
        loadMessagesCount();
        if (onSuccess) onSuccess();
      } else {
        localStorage.removeItem(ADMIN_KEY_STORAGE);
        setIsAdmin(false);
        alert('مفتاح الأدمن غير صحيح.');
      }
    } catch {
      alert('تعذر الاتصال بالسيرفر للتحقق من المفتاح.');
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem(ADMIN_KEY_STORAGE);
    setIsAdmin(false);
    setManagerOpen(false);
    setInboxOpen(false);
    setMessagesCount(0);
  };

  useEffect(() => {
    initOneSignal();

    fetch(`${BACKEND_URL}/api/status`)
      .then((res) => res.json())
      .then((st) => {
        if (st?.success) {
          setBackendStatus({
            apiOnline: Boolean(st.apiOnline),
            databaseConnected: Boolean(st.databaseConnected),
            storageMode: st.storageMode || 'API Connected'
          });
        }
      })
      .catch(() => {});

    loadProjects();
    loadMessagesCount();

    const onKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        handleAdminLogin();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div className="app-shell">
      <div className="grid-bg" />
      <div className="ambient-orb orb-cyan" />
      <div className="ambient-orb orb-indigo" />

      <Navbar
        isAdmin={isAdmin}
        backendStatus={backendStatus}
        messagesCount={messagesCount}
        onAdminTrigger={() => handleAdminLogin()}
        onAdminLogout={handleAdminLogout}
        onOpenManager={() => handleAdminLogin(() => setManagerOpen(true))}
        onOpenInbox={() =>
          handleAdminLogin(() => {
            loadMessagesCount();
            setInboxOpen(true);
          })
        }
      />

      <main>
        <Hero
          onOpenInbox={() =>
            handleAdminLogin(() => {
              loadMessagesCount();
              setInboxOpen(true);
            })
          }
          onOpenLiveStore={() =>
            setEmbeddedSite({
              url: 'https://aurelle-fine-jewelry.vercel.app',
              title: 'Aurelle Fine Jewelry — Live Store'
            })
          }
        />
        <About />
        <Skills />
        <Projects
          isAdmin={isAdmin}
          projects={projects}
          onOpenManager={() => handleAdminLogin(() => setManagerOpen(true))}
          onPreviewSite={(siteObj) => setEmbeddedSite(siteObj)}
        />
        <Contact onMessageSent={loadMessagesCount} />
      </main>

      <Footer />

      {isAdmin && (
        <>
          <ProjectManagerModal
            isOpen={managerOpen}
            onClose={() => setManagerOpen(false)}
            projects={projects}
            setProjects={setProjects}
            onRefresh={loadProjects}
          />

          <MessagesInboxModal
            isOpen={inboxOpen}
            onClose={() => {
              setInboxOpen(false);
              loadMessagesCount();
            }}
            onCountChange={setMessagesCount}
          />
        </>
      )}

      <EmbeddedSiteModal
        siteData={embeddedSite}
        onClose={() => setEmbeddedSite(null)}
      />
    </div>
  );
}
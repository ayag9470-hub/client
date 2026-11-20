import React, { useState } from 'react';
import { Menu, X, Terminal, Database, FolderPlus, Inbox, Globe, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ADMIN_KEY_STORAGE = 'aya_portfolio_admin_key';

function hasAdminKey() {
  try {
    return Boolean(localStorage.getItem(ADMIN_KEY_STORAGE));
  } catch {
    return false;
  }
}

export default function Navbar({
  isAdmin: isAdminProp,
  backendStatus,
  messagesCount,
  onAdminTrigger,
  onAdminLogout,
  onOpenManager,
  onOpenInbox
}) {
  const [open, setOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const isAr = i18n.language?.startsWith('ar');
  const isAdmin = typeof isAdminProp === 'boolean' ? isAdminProp : hasAdminKey();

  const toggleLanguage = () => {
    i18n.changeLanguage(isAr ? 'en' : 'ar');
  };

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <a
          href="#home"
          className="brand-icon"
          title={isAr ? 'الرئيسية' : 'Home'}
          onDoubleClick={(e) => {
            e.preventDefault();
            onAdminTrigger?.();
          }}
        >
          <Terminal size={18} />
        </a>

        <nav className={`nav-menu ${open ? 'open' : ''}`}>
          <a href="#about" onClick={() => setOpen(false)}>{t('nav.about')}</a>
          <a href="#skills" onClick={() => setOpen(false)}>{t('nav.skills')}</a>
          <a href="#projects" onClick={() => setOpen(false)}>{t('nav.projects')}</a>
          <a href="#contact" onClick={() => setOpen(false)}>{t('nav.contact')}</a>

          {isAdmin && (
            <>
              <button
                type="button"
                className="btn btn-glass btn-sm"
                onClick={() => {
                  setOpen(false);
                  onOpenManager();
                }}
              >
                <FolderPlus size={14} /> {t('nav.manageProjects')}
              </button>

              <button
                type="button"
                className="btn btn-glass btn-sm inbox-btn"
                onClick={() => {
                  setOpen(false);
                  onOpenInbox();
                }}
              >
                <Inbox size={14} /> {t('nav.inbox')}
                {messagesCount > 0 && <span className="inbox-badge">{messagesCount}</span>}
              </button>

              <button
                type="button"
                className="btn btn-glass btn-sm logout-btn"
                title={isAr ? 'تسجيل خروج الأدمن' : 'Admin Logout'}
                onClick={() => {
                  setOpen(false);
                  onAdminLogout?.();
                }}
              >
                <LogOut size={14} />
              </button>
            </>
          )}

          <span
            className={`api-pill ${backendStatus?.databaseConnected ? 'db-live' : backendStatus?.apiOnline ? 'online' : ''}`}
            title={t('nav.backendTitle')}
          >
            <Database size={13} />
            {backendStatus?.databaseConnected
              ? t('nav.dbConnected')
              : backendStatus?.apiOnline
              ? t('nav.apiJson')
              : t('nav.fullStack')}
          </span>

          <button
            type="button"
            className="btn btn-glass btn-sm"
            onClick={() => {
              toggleLanguage();
              setOpen(false);
            }}
          >
            <Globe size={14} /> {isAr ? 'English' : 'العربية'}
          </button>

          <a href="#contact" className="btn btn-primary btn-sm" onClick={() => setOpen(false)}>
            {t('nav.hireMe')}
          </a>
        </nav>

        <button
          type="button"
          className="mobile-btn"
          onClick={() => setOpen(!open)}
          aria-label={t('nav.toggleMenu')}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
}
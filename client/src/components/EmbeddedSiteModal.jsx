import React, { useState } from 'react';
import { X, ExternalLink, RotateCw, Monitor, Smartphone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function EmbeddedSiteModal({ siteData, onClose }) {
  const [viewport, setViewport] = useState('desktop');
  const [reloadKey, setReloadKey] = useState(0);
  const { t, i18n } = useTranslation();
  const isAr = i18n.language?.startsWith('ar');

  if (!siteData?.url) return null;

  const displayTitle = siteData.title
    ? isAr
      ? t(`projects.items.${siteData.title}.title`, { defaultValue: siteData.title })
      : siteData.title
    : t('embeddedModal.defaultTitle');

  return (
    <div className="modal-backdrop embed-backdrop" onClick={onClose}>
      <div className="embed-modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="browser-bar">
          <div className="embed-title-group">
            <strong>{displayTitle}</strong>
            <span className="embed-url">{siteData.url}</span>
          </div>

          <div className="browser-actions">
            <button
              type="button"
              className={`mode-btn ${viewport === 'desktop' ? 'active' : ''}`}
              onClick={() => setViewport('desktop')}
            >
              <Monitor size={15} /> {t('showcase.desktop')}
            </button>
            <button
              type="button"
              className={`mode-btn ${viewport === 'mobile' ? 'active' : ''}`}
              onClick={() => setViewport('mobile')}
            >
              <Smartphone size={15} /> {t('showcase.mobile')}
            </button>
            <button
              type="button"
              className="icon-action"
              onClick={() => setReloadKey((k) => k + 1)}
              title={t('embeddedModal.reloadTitle')}
            >
              <RotateCw size={15} />
            </button>
            <a
              href={siteData.url}
              target="_blank"
              rel="noopener noreferrer"
              className="icon-action"
              title={t('projects.openNewTab')}
            >
              <ExternalLink size={15} />
            </a>
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

        <div className={`iframe-stage modal-iframe-stage ${viewport === 'mobile' ? 'is-mobile' : ''}`}>
          <iframe
            key={reloadKey}
            src={siteData.url}
            title={displayTitle || t('embeddedModal.iframeTitle')}
            loading="eager"
          />
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { Monitor, Smartphone, RotateCw, ExternalLink, Lock, Maximize2, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function LiveShowcase({ onOpenModalPreview }) {
  const [viewport, setViewport] = useState('desktop');
  const [iframeKey, setIframeKey] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const { t, i18n } = useTranslation();
  const isAr = i18n.language?.startsWith('ar');
  const storeUrl = 'https://aurelle-fine-jewelry.vercel.app';
  const storeName = isAr ? 'أورييل للمجوهرات الفاخرة' : 'Aurelle Fine Jewelry';

  return (
    <section className="section" id="showcase">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">{t('showcase.eyebrow')}</span>
          <h2>{t('showcase.title')}</h2>
          <p>
            {t('showcase.subtitle')}
          </p>
        </div>

        <div className="browser-card">
          <div className="browser-bar">
            <div className="traffic-lights">
              <span className="dot red" />
              <span className="dot yellow" />
              <span className="dot green" />
            </div>

            <div className="address-pill">
              <Lock size={13} />
              <span>{storeUrl}</span>
              <span className={`load-tag ${loaded ? 'ready' : 'loading'}`}>
                {loaded ? t('showcase.instantReady') : t('showcase.preloading')}
              </span>
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
                className="mode-btn"
                onClick={() => onOpenModalPreview?.(storeUrl, storeName)}
                title={t('showcase.fastStageTitle')}
              >
                <Maximize2 size={15} /> {t('showcase.fastStage')}
              </button>
              <button
                type="button"
                className="icon-action"
                onClick={() => {
                  setLoaded(false);
                  setIframeKey((k) => k + 1);
                }}
                title={t('showcase.reloadTitle')}
              >
                <RotateCw size={15} />
              </button>
              <a
                href={storeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="icon-action"
                title={t('showcase.openFullTitle')}
              >
                <ExternalLink size={15} />
              </a>
            </div>
          </div>

          <div className={`iframe-stage ${viewport === 'mobile' ? 'is-mobile' : ''}`}>
            <iframe
              key={iframeKey}
              src={storeUrl}
              title={t('showcase.iframeTitle')}
              loading="eager"
              onLoad={() => setLoaded(true)}
            />
          </div>

          <div className="showcase-footer-bar">
            <span>
              <Zap size={15} className="icon-cyan" /> {t('showcase.footerNote')}
            </span>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => onOpenModalPreview?.(storeUrl, storeName)}
            >
              {t('showcase.launchStage')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
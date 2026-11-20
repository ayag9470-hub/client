import React from 'react';
import { Code2, Database, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function About() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language?.startsWith('ar');

  return (
    <section className="section" id="about">
      <div className="container about-grid">
        <div className="about-visual-col">
          <div className="about-banner-img">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80"
              alt={t('about.bannerAlt')}
            />
          </div>

          <div className="terminal-card">
            <div className="terminal-header">
              <span className="dot red" />
              <span className="dot yellow" />
              <span className="dot green" />
              <span className="terminal-title">aya-gabr.config.js</span>
            </div>
            <pre className="terminal-body">
              <code>{`export const developerProfile = {
  name: "${isAr ? 'آية جبر' : 'Aya Gabr'}",
  title: "${isAr ? 'مطورة ويب متكاملة (Full-Stack)' : 'Full-Stack Web Developer'}",
  frontend: ["React.js", "JavaScript (ES6+)", "HTML5", "CSS3"],
  backend: ["Node.js", "Express", "PHP", "Laravel"],
  databases: ["MongoDB", "Mongoose", "MySQL"],
  featuredLaunch: "https://aurelle-fine-jewelry.vercel.app",
  availableForHire: true
};`}</code>
            </pre>
          </div>
        </div>

        <div className="about-copy">
          <span className="eyebrow">{t('about.eyebrow')}</span>
          <h2>{t('about.title')}</h2>
          <p>
            {t('about.p1')}
          </p>
          <p>
            {t('about.p2Prefix')}{' '}
            <strong>{t('about.storeName')}</strong>{' '}
            {t('about.p2Suffix')}
          </p>

          <div className="feature-list">
            <div className="feature-item">
              <Code2 size={20} className="icon-cyan" />
              <div>
                <h4>{t('about.feat1Title')}</h4>
                <p>{t('about.feat1Desc')}</p>
              </div>
            </div>
            <div className="feature-item">
              <Database size={20} className="icon-indigo" />
              <div>
                <h4>{t('about.feat2Title')}</h4>
                <p>{t('about.feat2Desc')}</p>
              </div>
            </div>
            <div className="feature-item">
              <ShieldCheck size={20} className="icon-emerald" />
              <div>
                <h4>{t('about.feat3Title')}</h4>
                <p>{t('about.feat3Desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
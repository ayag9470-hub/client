import React from 'react';
import { Sparkles, Layers, Server, Database, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Hero() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language?.startsWith('ar');

  return (
    <section className="hero" id="home">
      <div className="container hero-grid">
        <div className="hero-text">
          <div className="hero-badge">
            <Sparkles size={15} />
            <span>{t('hero.badge')}</span>
          </div>

          <h1>
            {t('hero.greeting')}{' '}
            <span className="gradient-text">
              {isAr ? 'المهندسة آية جبر' : 'Eng. Aya Gabr'}
            </span>
            <br />
            {t('hero.headline')}
          </h1>

          <p className="hero-lead">
            {t('hero.lead')}
          </p>

          {/* عنصر جمالي بديل للأزرار يؤكد على الاحترافية والجاهزية */}
          <div className="aesthetic-badge-group">
            <div className="status-pill active-mode">
              <CheckCircle2 size={16} />
              <span>{isAr ? 'متاحة لمشاريع جديدة' : 'Available for New Projects'}</span>
            </div>
            <div className="status-pill tech-mode">
              <span>{isAr ? 'معايير برمجية قياسية' : 'Clean Code & Architecture'}</span>
            </div>
          </div>

          <div className="hero-metrics">
            <div className="metric">
              <Layers size={18} className="icon-cyan" />
              <div>
                <strong>{t('hero.frontendLabel')}</strong>
                <span>{t('hero.frontendStack')}</span>
              </div>
            </div>
            <div className="metric">
              <Server size={18} className="icon-indigo" />
              <div>
                <strong>{t('hero.backendLabel')}</strong>
                <span>{t('hero.backendStack')}</span>
              </div>
            </div>
            <div className="metric">
              <Database size={18} className="icon-emerald" />
              <div>
                <strong>{t('hero.databasesLabel')}</strong>
                <span>{t('hero.databasesStack')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-card-stack">
          {/* الصورة الرئيسية الجديدة + الجملة الترويجية العامة */}
          <div className="glass-frame main-visual">
            <img
              src="/hero-engineer.jpg"
              alt={isAr ? 'المهندسة آية جبر - تطوير ويب متكامل' : 'Eng. Aya Gabr - Full-Stack Developer'}
            />
            <div className="visual-overlay">
              <span className="tag-live">
                {isAr ? 'هندسة برمجيات متكاملة' : 'Full-Stack Engineering'}
              </span>
              <h4>
                {isAr ? 'نحوّل أفكارك إلى حلول رقمية ذكية' : 'Turning Ideas Into Scalable Digital Solutions'}
              </h4>
              <p>
                {isAr
                  ? 'تصميم واجهات عصرية وبناء أنظمة خلفية موثوقة وعالية الأداء.'
                  : 'Modern user interfaces paired with reliable, high-performance backend architectures.'}
              </p>
            </div>
          </div>

          {/* الصف السفلي: صورة الدوائر/الشبكات الجديدة + الصورة الثانية كما هي */}
          <div className="secondary-photo-row">
            <img
              src="/network-art.jpg"
              alt={isAr ? 'شبكات البيانات والأنظمة المتكاملة' : 'Data Networks & System Architecture'}
            />
            <img
              src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80"
              alt={t('hero.deskAlt')}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
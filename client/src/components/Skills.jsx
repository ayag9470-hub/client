import React from 'react';
import { useTranslation } from 'react-i18next';
import { skillCategories } from '../data/portfolioData';

export default function Skills() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language?.startsWith('ar');

  return (
    <section className="section section-dark" id="skills">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">{t('skills.eyebrow')}</span>
          <h2>{t('skills.title')}</h2>
          <p>{t('skills.subtitle')}</p>
        </div>

        <div className="skills-grid">
          {skillCategories.map((cat) => {
            const displayTitle = isAr
              ? t(`skills.categories.${cat.title}.title`, { defaultValue: cat.title })
              : cat.title;
            const displaySubtitle = isAr
              ? t(`skills.categories.${cat.title}.subtitle`, { defaultValue: cat.subtitle })
              : cat.subtitle;

            return (
              <div key={cat.title} className={`skill-box accent-${cat.accent}`}>
                <div className="skill-thumb">
                  <img src={cat.image} alt={displayTitle} />
                </div>
                <h3>{displayTitle}</h3>
                <p>{displaySubtitle}</p>
                <div className="chip-group">
                  {cat.skills.map((skill) => (
                    <span key={skill} className="chip">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
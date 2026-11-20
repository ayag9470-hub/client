import React, { useState } from 'react';
import { ExternalLink, Github, Monitor, Smartphone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AURELLE_GITHUB_URL = 'https://github.com/ayag9470-hub/Aurelle';

const resolveGithubUrl = (url) => {
  const cleanUrl = String(url || '').trim();
  if (
    !cleanUrl ||
    cleanUrl === 'https://github.com' ||
    cleanUrl === 'https://github.com/'
  ) {
    return AURELLE_GITHUB_URL;
  }
  return cleanUrl;
};

export default function Projects({ projects }) {
  const [filter, setFilter] = useState('All');
  const [viewModes, setViewModes] = useState({});
  const categories = ['All', 'E-Commerce', 'Full-Stack', 'Backend'];
  const { t, i18n } = useTranslation();
  const isAr = i18n.language?.startsWith('ar');

  const displayedProjects = (projects || []).slice(0, 1);

  const filtered =
    filter === 'All'
      ? displayedProjects
      : displayedProjects.filter(
          (p) => p.category?.toLowerCase() === filter.toLowerCase()
        );

  const getCategoryLabel = (cat) => {
    if (!isAr) return cat;
    const map = {
      All: t('projects.filterAll'),
      'E-Commerce': t('projects.filterEcommerce'),
      'Full-Stack': t('projects.filterFullStack'),
      Backend: t('projects.filterBackend'),
    };
    return map[cat] || cat;
  };

  const toggleViewMode = (projectKey, mode) => {
    setViewModes((prev) => ({
      ...prev,
      [projectKey]: prev[projectKey] === mode ? 'desktop' : mode,
    }));
  };

  return (
    <section className="section section-dark" id="projects">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">{t('projects.eyebrow')}</span>
          <h2>{t('projects.title')}</h2>
          <p>{t('projects.subtitle')}</p>

          <div className="filter-tabs">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`filter-btn ${filter === cat ? 'active' : ''}`}
                onClick={() => setFilter(cat)}
              >
                {getCategoryLabel(cat)}
              </button>
            ))}
          </div>
        </div>

        <div className="projects-grid">
          {filtered.map((project, index) => {
            const projectKey = project._id || project.id || index;
            const mode = viewModes[projectKey] || 'desktop';
            const isMobile = mode === 'mobile';
            const codeHref = resolveGithubUrl(project.githubUrl);

            const displayTitle = isAr
              ? t(`projects.items.${project.title}.title`, {
                  defaultValue: project.title,
                })
              : project.title;

            const displayDesc = isAr
              ? t(`projects.items.${project.title}.description`, {
                  defaultValue: project.description,
                })
              : project.description;

            return (
              <article key={projectKey} className="project-card">
                <div
                  className="mini-browser-card"
                  style={{
                    background: '#0a0f1d',
                    borderRadius: '18px 18px 0 0',
                    overflow: 'hidden',
                    borderBottom: '1px solid rgba(148, 163, 184, 0.15)',
                  }}
                >
                  <div
                    className="mini-browser-bar"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.65rem 1rem',
                      background: '#111928',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: 'rgba(30, 41, 59, 0.8)',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        color: '#94a3b8',
                        maxWidth: '210px',
                      }}
                    >
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {project.liveUrl}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <button
                        type="button"
                        onClick={() => toggleViewMode(projectKey, 'mobile')}
                        className={`mode-btn ${isMobile ? 'active' : ''}`}
                        title="Mobile View"
                        style={{
                          background: isMobile ? '#38bdf8' : 'rgba(30, 41, 59, 0.8)',
                          color: isMobile ? '#070b14' : '#94a3b8',
                          border: 'none',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}
                      >
                        <Smartphone size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleViewMode(projectKey, 'desktop')}
                        className={`mode-btn ${!isMobile ? 'active' : ''}`}
                        title="Desktop View"
                        style={{
                          background: !isMobile ? '#38bdf8' : 'rgba(30, 41, 59, 0.8)',
                          color: !isMobile ? '#070b14' : '#94a3b8',
                          border: 'none',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}
                      >
                        <Monitor size={13} />
                      </button>
                    </div>
                  </div>

                  <div
                    className="mini-iframe-stage"
                    style={{
                      height: '330px',
                      background: '#fff',
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <iframe
                      src={project.liveUrl}
                      title={displayTitle}
                      loading="lazy"
                      style={{
                        width: isMobile ? '320px' : '100%',
                        height: '100%',
                        border: 'none',
                        transition: 'width 0.35s ease',
                      }}
                    />
                  </div>
                </div>

                <div className="project-content" style={{ position: 'relative' }}>
                  <span
                    className="cat-badge"
                    style={{ position: 'static', marginBottom: '0.5rem', display: 'inline-block' }}
                  >
                    {getCategoryLabel(project.category)}
                  </span>
                  <h3>{displayTitle}</h3>
                  <p>{displayDesc}</p>

                  <div className="chip-group">
                    {(project.tech || []).map((techItem) => (
                      <span key={techItem} className="chip">
                        {techItem}
                      </span>
                    ))}
                  </div>

                  <div className="project-links">
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-sm"
                    >
                      <ExternalLink size={15} /> {t('projects.liveDemo')}
                    </a>

                    <a
                      href={codeHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-glass btn-sm"
                    >
                      <Github size={15} /> {t('projects.code')}
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
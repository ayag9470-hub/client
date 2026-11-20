import React, { useState } from 'react';
import { X, PlusCircle, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { presetCoverImages } from '../data/portfolioData';

const DEFAULT_GITHUB_URL = 'https://github.com/ayag9470-hub/Aurelle';
const RAW_BACKEND_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_SOCKET_URL ||
  'https://portfolio-production-f0c02f01.up.railway.app';
const BACKEND_URL = String(RAW_BACKEND_URL).replace(/\/+$/, '');

export default function ProjectManagerModal({ isOpen, onClose, projects, setProjects, onRefresh }) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language?.startsWith('ar');

  const [form, setForm] = useState({
    title: '',
    category: 'Full-Stack',
    description: '',
    image: presetCoverImages[0].url,
    tech: 'React.js, Node.js, MongoDB',
    liveUrl: '',
    githubUrl: ''
  });
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState('');

  if (!isOpen) return null;

  const getCategoryLabel = (cat) => {
    if (!isAr) return cat;
    const map = {
      'Full-Stack': t('projects.filterFullStack'),
      'E-Commerce': t('projects.filterEcommerce'),
      Backend: t('projects.filterBackend')
    };
    return map[cat] || cat;
  };

  const getProjectTitle = (title) => {
    if (!isAr) return title;
    return t(`projects.items.${title}.title`, { defaultValue: title });
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback('');

    const payload = {
      ...form,
      githubUrl: form.githubUrl?.trim() || DEFAULT_GITHUB_URL,
      tech: form.tech
        .split(',')
        .map((techItem) => techItem.trim())
        .filter(Boolean)
    };

    try {
      const res = await fetch(`${BACKEND_URL}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setFeedback(t('projectManager.addedSuccess'));
        setForm({
          title: '',
          category: 'Full-Stack',
          description: '',
          image: presetCoverImages[0].url,
          tech: 'React.js, Node.js, MongoDB',
          liveUrl: '',
          githubUrl: ''
        });
        onRefresh();
      } else {
        throw new Error(data.error || 'Could not save');
      }
    } catch {
      const localItem = {
        _id: String(Date.now()),
        ...payload,
        image: payload.image || presetCoverImages[0].url,
        liveUrl: payload.liveUrl || '#',
        githubUrl: payload.githubUrl || DEFAULT_GITHUB_URL
      };
      setProjects((prev) => [...prev, localItem]);
      setFeedback(t('projectManager.addedLocal'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/projects/${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        onRefresh();
        return;
      }
    } catch {}
    setProjects((prev) => prev.filter((p) => String(p._id || p.id) !== String(id)));
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-top">
          <h3>{t('projectManager.title')}</h3>
          <button type="button" className="icon-action" onClick={onClose} title={t('inbox.close')}>
            <X size={18} />
          </button>
        </div>

        <form className="modal-form" onSubmit={handleAddProject}>
          <div className="input-row">
            <div className="field">
              <label>{t('projectManager.projectTitleLabel')}</label>
              <input
                type="text"
                required
                placeholder={t('projectManager.projectTitlePlaceholder')}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div className="field">
              <label>{t('projectManager.categoryLabel')}</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="Full-Stack">{t('projects.filterFullStack')}</option>
                <option value="E-Commerce">{t('projects.filterEcommerce')}</option>
                <option value="Backend">{t('projects.filterBackend')}</option>
              </select>
            </div>
          </div>

          <div className="field">
            <label>{t('projectManager.descriptionLabel')}</label>
            <textarea
              rows="3"
              required
              placeholder={t('projectManager.descriptionPlaceholder')}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="field">
            <label>{t('projectManager.presetsLabel')}</label>
            <div className="preset-row">
              {presetCoverImages.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  className={`preset-chip ${form.image === preset.url ? 'active' : ''}`}
                  onClick={() => setForm({ ...form, image: preset.url })}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="input-row">
            <div className="field">
              <label>{t('projectManager.liveUrlLabel')}</label>
              <input
                type="url"
                placeholder="https://your-project.vercel.app"
                value={form.liveUrl}
                onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
              />
            </div>
            <div className="field">
              <label>{t('projectManager.githubUrlLabel')}</label>
              <input
                type="url"
                placeholder={DEFAULT_GITHUB_URL}
                value={form.githubUrl}
                onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
              />
            </div>
          </div>

          <div className="input-row">
            <div className="field">
              <label>{t('projectManager.techLabel')}</label>
              <input
                type="text"
                value={form.tech}
                onChange={(e) => setForm({ ...form, tech: e.target.value })}
              />
            </div>
            <div className="field">
              <label>{t('projectManager.customImageLabel')}</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary full" disabled={saving}>
            <PlusCircle size={16} /> {saving ? t('projectManager.adding') : t('projectManager.addBtn')}
          </button>
          {feedback && <p className="modal-feedback">{feedback}</p>}
        </form>

        <div className="existing-list">
          <h4>{t('projectManager.currentProjects', { count: projects.length })}</h4>
          {projects.map((p, i) => {
            const pid = p._id || p.id || i;
            return (
              <div key={pid} className="existing-row">
                <div>
                  <strong>{getProjectTitle(p.title)}</strong>
                  <span> • {getCategoryLabel(p.category)}</span>
                </div>
                <button
                  type="button"
                  className="danger-btn"
                  onClick={() => handleDelete(pid)}
                  title={t('projectManager.deleteTitle')}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
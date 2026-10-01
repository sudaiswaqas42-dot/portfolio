import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';

export default function AdminDashboard() {
  const { data, refreshData } = usePortfolio();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('general');
  const [toast, setToast] = useState('');
  const [saving, setSaving] = useState(false);

  // Form states
  const [settings, setSettings] = useState({
    first_name: '',
    last_name: '',
    title: '',
    role: '',
    headline: '',
    email: '',
    linkedin_url: '',
    twitter_url: '',
    behance_url: '',
    footer_video: '',
    footer_video_poster: '',
    footer_heading: '',
    footer_subheading: '',
    footer_tech_label: '',
    footer_technologies: []
  });

  const [services, setServices] = useState([]);
  const [philosophy, setPhilosophy] = useState([]);
  const [projects, setProjects] = useState([]);
  const [about, setAbout] = useState({
    headline: '',
    who_i_am: '',
    approach: '',
    philosophy: '',
    awards: '',
    news1_title: '',
    news1_desc: '',
    news1_link: '',
    news2_title: '',
    news2_desc: '',
    news2_link: '',
    news3_title: '',
    news3_desc: '',
    news3_link: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/login');
      return;
    }

    if (data) {
      if (data.settings) setSettings(data.settings);
      if (data.services) setServices(data.services);
      if (data.philosophy) setPhilosophy(data.philosophy);
      if (data.projects) setProjects(data.projects);
      if (data.about) setAbout(data.about);
    }
  }, [data, navigate]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/login');
  };

  const saveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        await refreshData();
        showToast('Settings saved to MySQL successfully!');
      } else {
        showToast('Failed to save settings');
      }
    } catch (err) {
      showToast('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const saveServices = async (e) => {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch('/api/admin/services', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ services })
      });
      if (res.ok) {
        await refreshData();
        showToast('Services updated in MySQL!');
      } else {
        showToast('Failed to update services');
      }
    } catch (err) {
      showToast('Error updating services');
    } finally {
      setSaving(false);
    }
  };

  const savePhilosophy = async (e) => {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch('/api/admin/philosophy', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ points: philosophy })
      });
      if (res.ok) {
        await refreshData();
        showToast('Philosophy checklist saved to MySQL!');
      } else {
        showToast('Failed to update philosophy');
      }
    } catch (err) {
      showToast('Error updating philosophy');
    } finally {
      setSaving(false);
    }
  };

  const saveProjects = async (e) => {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch('/api/admin/projects', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ projects })
      });
      if (res.ok) {
        await refreshData();
        showToast('Projects saved to MySQL!');
      } else {
        showToast('Failed to save projects');
      }
    } catch (err) {
      showToast('Error saving projects');
    } finally {
      setSaving(false);
    }
  };

  const saveAbout = async (e) => {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch('/api/admin/about', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(about)
      });
      if (res.ok) {
        await refreshData();
        showToast('About page content saved to MySQL!');
      } else {
        showToast('Failed to save about content');
      }
    } catch (err) {
      showToast('Error saving about content');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#121212',
      color: '#eee',
      fontFamily: 'Goga, Arial, sans-serif'
    }}>
      {/* Toast Alert */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#2ecc71',
          color: '#fff',
          padding: '1rem 1.5rem',
          borderRadius: '8px',
          zIndex: 9999,
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          fontWeight: '600'
        }}>
          {toast}
        </div>
      )}

      {/* Top Admin Navbar */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.2rem 3rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(20, 20, 20, 0.8)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h1 style={{ fontSize: '1.4rem', margin: 0, color: '#ffbc95' }}>⚙️ Portfolio Admin CMS</h1>
          <span style={{ fontSize: '0.85rem', background: 'rgba(255, 188, 149, 0.15)', color: '#ffbc95', padding: '3px 8px', borderRadius: '4px' }}>
            MySQL 8.0 Live
          </span>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link to="/" target="_blank" style={{ color: '#aaa', textDecoration: 'none', fontSize: '0.9rem' }}>
            👁️ View Live Website
          </Link>
          <button
            onClick={handleLogout}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#eee',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            Log Out
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 70px)' }}>
        {/* Sidebar Tabs */}
        <aside style={{
          width: '240px',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '2rem 1rem'
        }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              { id: 'general', label: '👤 General Settings' },
              { id: 'projects', label: '💼 Work Projects (12)' },
              { id: 'about', label: '📖 About Content' },
              { id: 'services', label: '🛠️ Services Cards' },
              { id: 'philosophy', label: '✨ Philosophy Points' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  textAlign: 'left',
                  padding: '0.9rem 1.2rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: activeTab === tab.id ? 'rgba(255, 188, 149, 0.15)' : 'transparent',
                  color: activeTab === tab.id ? '#ffbc95' : '#aaa',
                  fontWeight: activeTab === tab.id ? '600' : '400',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Form Body */}
        <main style={{ flex: 1, padding: '3rem 4rem', overflowY: 'auto' }}>
          {/* 1. GENERAL SETTINGS */}
          {activeTab === 'general' && (
            <form onSubmit={saveSettings} style={{ maxWidth: '750px' }}>
              <h2 style={{ marginBottom: '0.5rem', color: '#ffbc95' }}>General Settings</h2>
              <p style={{ color: '#888', marginBottom: '2rem' }}>Update your primary personal and professional brand details.</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>First Name</label>
                  <input
                    type="text"
                    value={settings.first_name || ''}
                    onChange={(e) => setSettings({ ...settings, first_name: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Last Name</label>
                  <input
                    type="text"
                    value={settings.last_name || ''}
                    onChange={(e) => setSettings({ ...settings, last_name: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Hero Title</label>
                <input
                  type="text"
                  value={settings.title || ''}
                  onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Professional Role</label>
                <input
                  type="text"
                  value={settings.role || ''}
                  onChange={(e) => setSettings({ ...settings, role: e.target.value })}
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Scroll Section Headline</label>
                <textarea
                  rows={2}
                  value={settings.headline || ''}
                  onChange={(e) => setSettings({ ...settings, headline: e.target.value })}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Contact Email</label>
                <input
                  type="email"
                  value={settings.email || ''}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>LinkedIn URL</label>
                  <input
                    type="text"
                    value={settings.linkedin_url || ''}
                    onChange={(e) => setSettings({ ...settings, linkedin_url: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>X / Twitter URL</label>
                  <input
                    type="text"
                    value={settings.twitter_url || ''}
                    onChange={(e) => setSettings({ ...settings, twitter_url: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Behance URL</label>
                  <input
                    type="text"
                    value={settings.behance_url || ''}
                    onChange={(e) => setSettings({ ...settings, behance_url: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              <div style={{ marginTop: '2.5rem', marginBottom: '2rem', borderTop: '1px solid #333', paddingTop: '1.5rem' }}>
                <h3 style={{ color: '#ffbc95', marginBottom: '0.5rem' }}>Footer & Video Background</h3>
                <p style={{ color: '#888', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                  Manage footer video, big heading, subheading, and technologies column.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Footer Big Heading (e.g. MR USMAN GHANI)</label>
                    <input
                      type="text"
                      placeholder="MR USMAN GHANI"
                      value={settings.footer_heading || ''}
                      onChange={(e) => setSettings({ ...settings, footer_heading: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Footer Subheading</label>
                    <input
                      type="text"
                      placeholder="Morable Design Studio [Coming Soon]"
                      value={settings.footer_subheading || ''}
                      onChange={(e) => setSettings({ ...settings, footer_subheading: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Technologies Section Title</label>
                    <input
                      type="text"
                      placeholder="Website made using:"
                      value={settings.footer_tech_label || ''}
                      onChange={(e) => setSettings({ ...settings, footer_tech_label: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Technologies List (one per line)</label>
                    <textarea
                      rows={4}
                      placeholder={"Figma\nReact / Vite\nNode.js / Express\nMySQL Database\nGSAP\nLenis Scroll"}
                      value={Array.isArray(settings.footer_technologies) ? settings.footer_technologies.join('\n') : (settings.footer_technologies || '')}
                      onChange={(e) => setSettings({ ...settings, footer_technologies: e.target.value.split('\n') })}
                      style={{ ...inputStyle, resize: 'vertical' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Footer Video URL / Path</label>
                    <input
                      type="text"
                      placeholder="/videos-work/desk_jm3.mp4"
                      value={settings.footer_video || ''}
                      onChange={(e) => setSettings({ ...settings, footer_video: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Video Poster Preview Image URL</label>
                    <input
                      type="text"
                      placeholder="/videos-work/juan-video-loading.jpg"
                      value={settings.footer_video_poster || ''}
                      onChange={(e) => setSettings({ ...settings, footer_video_poster: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                </div>
              </div>

              <button type="submit" disabled={saving} style={buttonStyle}>
                {saving ? 'Saving...' : '💾 Save Settings to MySQL'}
              </button>
            </form>
          )}

          {/* 2. WORK PROJECTS */}
          {activeTab === 'projects' && (
            <form onSubmit={saveProjects} style={{ maxWidth: '900px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                  <h2 style={{ margin: '0 0 0.5rem 0', color: '#ffbc95' }}>Work Projects (12 Projects)</h2>
                  <p style={{ color: '#888', margin: 0 }}>Edit challenges, roles, services, and live links for each project.</p>
                </div>
                <button type="submit" disabled={saving} style={buttonStyle}>
                  {saving ? 'Saving...' : '💾 Save Projects to MySQL'}
                </button>
              </div>

              {projects.map((p, idx) => (
                <div key={p.id || idx} style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '2rem',
                  marginBottom: '2rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ margin: 0, color: '#ffbc95' }}>#{idx + 1}: {p.title}</h3>
                    <span style={{ fontSize: '0.85rem', color: '#aaa', background: 'rgba(255,255,255,0.06)', padding: '4px 10px', borderRadius: '4px' }}>
                      Slug: #{p.slug}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.4rem', color: '#ccc' }}>Project Title</label>
                      <input
                        type="text"
                        value={p.title || ''}
                        onChange={(e) => {
                          const updated = [...projects];
                          updated[idx].title = e.target.value;
                          setProjects(updated);
                        }}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.4rem', color: '#ccc' }}>Year</label>
                      <input
                        type="text"
                        value={p.year || ''}
                        onChange={(e) => {
                          const updated = [...projects];
                          updated[idx].year = e.target.value;
                          setProjects(updated);
                        }}
                        style={inputStyle}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', color: '#ccc' }}>Challenge</label>
                    <textarea
                      rows={2}
                      value={p.challenge || ''}
                      onChange={(e) => {
                        const updated = [...projects];
                        updated[idx].challenge = e.target.value;
                        setProjects(updated);
                      }}
                      style={{ ...inputStyle, resize: 'vertical' }}
                    />
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', color: '#ccc' }}>Services (Comma-separated)</label>
                    <input
                      type="text"
                      value={p.services_text || ''}
                      onChange={(e) => {
                        const updated = [...projects];
                        updated[idx].services_text = e.target.value;
                        setProjects(updated);
                      }}
                      style={inputStyle}
                    />
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', color: '#ccc' }}>Role</label>
                    <textarea
                      rows={2}
                      value={p.role_text || ''}
                      onChange={(e) => {
                        const updated = [...projects];
                        updated[idx].role_text = e.target.value;
                        setProjects(updated);
                      }}
                      style={{ ...inputStyle, resize: 'vertical' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.4rem', color: '#ccc' }}>Live Link (URL or empty)</label>
                    <input
                      type="text"
                      value={p.live_link || ''}
                      onChange={(e) => {
                        const updated = [...projects];
                        updated[idx].live_link = e.target.value;
                        setProjects(updated);
                      }}
                      style={inputStyle}
                    />
                  </div>
                </div>
              ))}

              <button type="submit" disabled={saving} style={buttonStyle}>
                {saving ? 'Saving...' : '💾 Save Projects to MySQL'}
              </button>
            </form>
          )}

          {/* 3. ABOUT CONTENT */}
          {activeTab === 'about' && (
            <form onSubmit={saveAbout} style={{ maxWidth: '850px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                  <h2 style={{ margin: '0 0 0.5rem 0', color: '#ffbc95' }}>About Page Content</h2>
                  <p style={{ color: '#888', margin: 0 }}>Edit biography, philosophies, awards, and news cards.</p>
                </div>
                <button type="submit" disabled={saving} style={buttonStyle}>
                  {saving ? 'Saving...' : '💾 Save About Content to MySQL'}
                </button>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>About Page Top Headline</label>
                <input
                  type="text"
                  value={about.headline || ''}
                  onChange={(e) => setAbout({ ...about, headline: e.target.value })}
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Who I Am</label>
                <textarea
                  rows={5}
                  value={about.who_i_am || ''}
                  onChange={(e) => setAbout({ ...about, who_i_am: e.target.value })}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Approach</label>
                <textarea
                  rows={4}
                  value={about.approach || ''}
                  onChange={(e) => setAbout({ ...about, approach: e.target.value })}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Philosophy</label>
                <textarea
                  rows={4}
                  value={about.philosophy || ''}
                  onChange={(e) => setAbout({ ...about, philosophy: e.target.value })}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>

              <div style={{ marginBottom: '2.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Awards and Recognitions</label>
                <textarea
                  rows={4}
                  value={about.awards || ''}
                  onChange={(e) => setAbout({ ...about, awards: e.target.value })}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>

              <h3 style={{ color: '#ffbc95', marginBottom: '1.5rem' }}>News & Updates Cards</h3>

              {/* News 1 */}
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
                <h4 style={{ margin: '0 0 1rem 0', color: '#ffbc95' }}>News #1: Studio</h4>
                <input
                  type="text"
                  placeholder="Title"
                  value={about.news1_title || ''}
                  onChange={(e) => setAbout({ ...about, news1_title: e.target.value })}
                  style={{ ...inputStyle, marginBottom: '0.8rem' }}
                />
                <textarea
                  rows={2}
                  placeholder="Description"
                  value={about.news1_desc || ''}
                  onChange={(e) => setAbout({ ...about, news1_desc: e.target.value })}
                  style={{ ...inputStyle, marginBottom: '0.8rem', resize: 'vertical' }}
                />
                <input
                  type="text"
                  placeholder="Link URL"
                  value={about.news1_link || ''}
                  onChange={(e) => setAbout({ ...about, news1_link: e.target.value })}
                  style={inputStyle}
                />
              </div>

              {/* News 2 */}
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
                <h4 style={{ margin: '0 0 1rem 0', color: '#ffbc95' }}>News #2: Online Course</h4>
                <input
                  type="text"
                  placeholder="Title"
                  value={about.news2_title || ''}
                  onChange={(e) => setAbout({ ...about, news2_title: e.target.value })}
                  style={{ ...inputStyle, marginBottom: '0.8rem' }}
                />
                <textarea
                  rows={2}
                  placeholder="Description"
                  value={about.news2_desc || ''}
                  onChange={(e) => setAbout({ ...about, news2_desc: e.target.value })}
                  style={{ ...inputStyle, marginBottom: '0.8rem', resize: 'vertical' }}
                />
                <input
                  type="text"
                  placeholder="Link URL"
                  value={about.news2_link || ''}
                  onChange={(e) => setAbout({ ...about, news2_link: e.target.value })}
                  style={inputStyle}
                />
              </div>

              {/* News 3 */}
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2.5rem' }}>
                <h4 style={{ margin: '0 0 1rem 0', color: '#ffbc95' }}>News #3: Interactive Reflection</h4>
                <input
                  type="text"
                  placeholder="Title"
                  value={about.news3_title || ''}
                  onChange={(e) => setAbout({ ...about, news3_title: e.target.value })}
                  style={{ ...inputStyle, marginBottom: '0.8rem' }}
                />
                <textarea
                  rows={2}
                  placeholder="Description"
                  value={about.news3_desc || ''}
                  onChange={(e) => setAbout({ ...about, news3_desc: e.target.value })}
                  style={{ ...inputStyle, marginBottom: '0.8rem', resize: 'vertical' }}
                />
                <input
                  type="text"
                  placeholder="Link URL"
                  value={about.news3_link || ''}
                  onChange={(e) => setAbout({ ...about, news3_link: e.target.value })}
                  style={inputStyle}
                />
              </div>

              <button type="submit" disabled={saving} style={buttonStyle}>
                {saving ? 'Saving...' : '💾 Save About Content to MySQL'}
              </button>
            </form>
          )}

          {/* 4. SERVICES */}
          {activeTab === 'services' && (
            <form onSubmit={saveServices} style={{ maxWidth: '800px' }}>
              <h2 style={{ marginBottom: '0.5rem', color: '#ffbc95' }}>Manage Services Cards</h2>
              <p style={{ color: '#888', marginBottom: '2rem' }}>Edit the titles and descriptions of each service category.</p>

              {services.map((s, idx) => (
                <div key={s.id || idx} style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '2rem',
                  marginBottom: '2rem'
                }}>
                  <h3 style={{ margin: '0 0 1rem 0', color: '#ffbc95' }}>Service #{idx + 1}</h3>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Title</label>
                    <input
                      type="text"
                      value={s.title || ''}
                      onChange={(e) => {
                        const updated = [...services];
                        updated[idx].title = e.target.value;
                        setServices(updated);
                      }}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Description</label>
                    <textarea
                      rows={3}
                      value={s.description || ''}
                      onChange={(e) => {
                        const updated = [...services];
                        updated[idx].description = e.target.value;
                        setServices(updated);
                      }}
                      style={{ ...inputStyle, resize: 'vertical' }}
                    />
                  </div>
                </div>
              ))}

              <button type="submit" disabled={saving} style={buttonStyle}>
                {saving ? 'Saving...' : '💾 Save Services to MySQL'}
              </button>
            </form>
          )}

          {/* 5. PHILOSOPHY POINTS */}
          {activeTab === 'philosophy' && (
            <form onSubmit={savePhilosophy} style={{ maxWidth: '750px' }}>
              <h2 style={{ marginBottom: '0.5rem', color: '#ffbc95' }}>Philosophy Checklist Points</h2>
              <p style={{ color: '#888', marginBottom: '2rem' }}>Add, edit, or remove points from the 'Good design takes time' section.</p>

              {philosophy.map((pt, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={pt}
                    onChange={(e) => {
                      const updated = [...philosophy];
                      updated[idx] = e.target.value;
                      setPhilosophy(updated);
                    }}
                    style={inputStyle}
                  />
                  <button
                    type="button"
                    onClick={() => setPhilosophy(philosophy.filter((_, i) => i !== idx))}
                    style={{
                      background: 'rgba(255, 77, 77, 0.2)',
                      border: '1px solid rgba(255, 77, 77, 0.4)',
                      color: '#ff8080',
                      borderRadius: '8px',
                      padding: '0.8rem 1rem',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => setPhilosophy([...philosophy, 'New philosophy point...'])}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#fff',
                  borderRadius: '8px',
                  padding: '0.8rem 1.5rem',
                  marginBottom: '2rem',
                  cursor: 'pointer'
                }}
              >
                + Add Point
              </button>

              <br />
              <button type="submit" disabled={saving} style={buttonStyle}>
                {saving ? 'Saving...' : '💾 Save Philosophy to MySQL'}
              </button>
            </form>
          )}
        </main>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '0.9rem 1.2rem',
  borderRadius: '10px',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  background: 'rgba(0, 0, 0, 0.3)',
  color: '#fff',
  fontSize: '1rem',
  outline: 'none',
  boxSizing: 'border-box'
};

const buttonStyle = {
  padding: '0.9rem 1.8rem',
  borderRadius: '10px',
  border: 'none',
  background: '#ffbc95',
  color: '#1a1a1a',
  fontSize: '0.95rem',
  fontWeight: '700',
  cursor: 'pointer',
  transition: 'all 0.2s ease'
};

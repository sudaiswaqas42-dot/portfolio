export function getApiBase() {
  const defaultBackend = (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))
    ? ''
    : 'https://portfolio-backend-production-9c68.up.railway.app';
  return (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) || defaultBackend;
}

export function resolveMediaUrl(url) {
  if (!url || typeof url !== 'string') return url;
  if (url.startsWith('/uploads/')) {
    const apiBase = getApiBase();
    return `${apiBase}${url}`;
  }
  return url;
}

export function normalizePortfolioMedia(data) {
  if (!data || typeof data !== 'object') return data;
  const apiBase = getApiBase();

  const resolve = (val) => {
    if (typeof val !== 'string') return val;
    if (val.startsWith('/uploads/')) {
      return `${apiBase}${val}`;
    }
    return val;
  };

  const cloned = JSON.parse(JSON.stringify(data));

  // 1. Settings
  if (cloned.settings && typeof cloned.settings === 'object') {
    for (const key of Object.keys(cloned.settings)) {
      if (typeof cloned.settings[key] === 'string') {
        cloned.settings[key] = resolve(cloned.settings[key]);
      }
    }
  }

  // 2. Projects
  if (Array.isArray(cloned.projects)) {
    cloned.projects.forEach(project => {
      if (Array.isArray(project.media)) {
        project.media.forEach(m => {
          if (m.src) m.src = resolve(m.src);
          if (m.poster) m.poster = resolve(m.poster);
        });
      }
    });
  }

  // 3. Services
  if (Array.isArray(cloned.services)) {
    cloned.services.forEach(service => {
      if (Array.isArray(service.images)) {
        service.images = service.images.map(resolve);
      }
      if (Array.isArray(service.videos)) {
        service.videos = service.videos.map(resolve);
      }
    });
  }

  // 4. Content catalog overrides (e.g. cursor cards hero.card_1, etc.)
  if (cloned.content && typeof cloned.content === 'object') {
    for (const key of Object.keys(cloned.content)) {
      if (typeof cloned.content[key] === 'string') {
        cloned.content[key] = resolve(cloned.content[key]);
      }
    }
  }

  // 5. About
  if (cloned.about && typeof cloned.about === 'object') {
    for (const key of Object.keys(cloned.about)) {
      if (typeof cloned.about[key] === 'string') {
        cloned.about[key] = resolve(cloned.about[key]);
      }
    }
  }

  return cloned;
}

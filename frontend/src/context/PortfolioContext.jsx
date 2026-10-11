import React,{createContext,useContext,useState,useEffect,useLayoutEffect,useCallback} from 'react';
import defaults from '../data/defaults.json';
import {applyTheme,normalizeTheme} from '../utils/theme';
import {normalizePortfolioMedia, resolveMediaUrl} from '../utils/media';
import contentCatalog from '../../../shared/contentCatalog.json';
const PortfolioContext=createContext(null);
const cacheKey='portfolio-content-v1';
function readCachedData(){
  try{
    const cached=JSON.parse(localStorage.getItem(cacheKey));
    if(cached?.settings && Array.isArray(cached.projects) && cached.theme){
      return normalizePortfolioMedia({...cached,theme:normalizeTheme(cached.theme)});
    }
  }catch{}
  return null;
}
const cachedData=readCachedData();
// Apply cached colors before React mounts any animated content.
applyTheme(cachedData?.theme || normalizeTheme());
export function PortfolioProvider({children}){
  const [data,setData]=useState(cachedData || normalizePortfolioMedia({...defaults,theme:normalizeTheme()})),[loading,setLoading]=useState(true),[error,setError]=useState('');
  const refreshData=useCallback(async()=>{
    try{
      const defaultBackend = (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) ? '' : 'https://portfolio-backend-production-9c68.up.railway.app';
      const apiBase = import.meta.env.VITE_API_URL || defaultBackend;
      const res=await fetch(`${apiBase}/api/portfolio?_t=${Date.now()}`,{
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' },
        signal:AbortSignal.timeout(10000)
      });
      if(!res.ok)throw new Error('The content server is unavailable. Please retry.');
      let next=await res.json();
      next.theme=normalizeTheme(next.theme);
      next=normalizePortfolioMedia(next);
      try{localStorage.setItem(cacheKey,JSON.stringify(next));}catch{}
      applyTheme(next.theme);
      setData(next);
      setError('');return next;
    }catch(e){setError(e.message);return null;}finally{setLoading(false);}
  },[]);
  useEffect(()=>{refreshData();},[refreshData]);
  useLayoutEffect(()=>{
    applyTheme(data.theme);
    const update=()=>{applyTheme(data.theme);if(data.theme.mode==='system')setData(current=>({...current}));};
    const media=window.matchMedia('(prefers-color-scheme: dark)');
    media.addEventListener('change',update);
    return()=>media.removeEventListener('change',update);
  },[data.theme]);
  useEffect(()=>{
    const channel=typeof BroadcastChannel!=='undefined'?new BroadcastChannel('portfolio-content'):null;
    if(channel)channel.onmessage=()=>refreshData();
    const refresh=()=>{if(document.visibilityState==='visible')refreshData();};
    window.addEventListener('focus',refresh);
    return()=>{channel?.close();window.removeEventListener('focus',refresh);};
  },[refreshData]);
  useEffect(()=>{
    const s=data.settings;
    const get=key=>data.content?.[key]??contentCatalog[key]?.value??'';
    document.title=get('brand.page_title')||`${s.first_name} ${s.last_name} | ${s.role}`;
    let description=document.querySelector('meta[name="description"]');
    if(!description){description=document.createElement('meta');description.name='description';document.head.appendChild(description);}
    description.content=get('brand.description');

    // Dynamic Favicon Update from CMS - Rounded Tile Card (Matching Image 2)
    const rawFavicon = get("brand.favicon") || "/favicon.svg";
    const resolvedFavicon = resolveMediaUrl(rawFavicon);
    const ver = data.revision ? `?v=` : "";
    const fullFaviconUrl = resolvedFavicon.includes("?") ? resolvedFavicon : ``;

    const setFaviconLinks = (href, type = "image/png") => {
      document.querySelectorAll("link[rel*=\"icon\"]").forEach(el => el.parentNode?.removeChild(el));
      const linkIcon = document.createElement("link");
      linkIcon.id = "app-favicon";
      linkIcon.rel = "icon";
      linkIcon.type = type;
      linkIcon.href = href;
      document.head.appendChild(linkIcon);

      const linkShortcut = document.createElement("link");
      linkShortcut.id = "app-shortcut-icon";
      linkShortcut.rel = "shortcut icon";
      linkShortcut.type = type;
      linkShortcut.href = href;
      document.head.appendChild(linkShortcut);

      const linkApple = document.createElement("link");
      linkApple.id = "app-apple-icon";
      linkApple.rel = "apple-touch-icon";
      linkApple.href = href;
      document.head.appendChild(linkApple);
    };

    if (resolvedFavicon.endsWith(".svg")) {
      setFaviconLinks(fullFaviconUrl, "image/svg+xml");
    } else {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        try {
          const size = 64;
          const canvas = document.createElement("canvas");
          canvas.width = size;
          canvas.height = size;
          const ctx2d = canvas.getContext("2d");
          if (!ctx2d) return setFaviconLinks(fullFaviconUrl);

          // Draw rounded white tile (Image 2 style)
          const radius = 15;
          ctx2d.beginPath();
          if (ctx2d.roundRect) {
            ctx2d.roundRect(0, 0, size, size, radius);
          } else {
            ctx2d.moveTo(radius, 0);
            ctx2d.lineTo(size - radius, 0);
            ctx2d.quadraticCurveTo(size, 0, size, radius);
            ctx2d.lineTo(size, size - radius);
            ctx2d.quadraticCurveTo(size, size, size - radius, size);
            ctx2d.lineTo(radius, size);
            ctx2d.quadraticCurveTo(0, size, 0, size - radius);
            ctx2d.lineTo(0, radius);
            ctx2d.quadraticCurveTo(0, 0, radius, 0);
            ctx2d.closePath();
          }
          ctx2d.fillStyle = "#FFFFFF";
          ctx2d.fill();
          ctx2d.clip();

          // Center brand mark with ~18% padding so it never touches edges
          const pad = 11;
          const maxW = size - pad * 2;
          const maxH = size - pad * 2;
          const aspect = (img.width && img.height) ? (img.width / img.height) : 1;
          let drawW = maxW;
          let drawH = maxW / aspect;
          if (drawH > maxH) {
            drawH = maxH;
            drawW = maxH * aspect;
          }
          const drawX = (size - drawW) / 2;
          const drawY = (size - drawH) / 2;

          ctx2d.drawImage(img, drawX, drawY, drawW, drawH);
          setFaviconLinks(canvas.toDataURL("image/png"), "image/png");
        } catch {
          setFaviconLinks(fullFaviconUrl);
        }
      };
      img.onerror = () => setFaviconLinks(fullFaviconUrl);
      img.src = fullFaviconUrl;
    }
  },[data.settings,data.content,data.revision]);
  return <PortfolioContext.Provider value={{data,loading,error,refreshData}}>{loading ? <div className="site-loading" role="status" aria-label="Loading portfolio"/> : children}</PortfolioContext.Provider>;
}
export const usePortfolio=()=>useContext(PortfolioContext);

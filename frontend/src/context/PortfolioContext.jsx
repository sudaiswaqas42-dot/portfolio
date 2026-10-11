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

    // Dynamic Favicon Update from CMS
    const rawFavicon = get('brand.favicon') || '/images/favicon.png';
    const resolvedFavicon = resolveMediaUrl(rawFavicon);
    const ver = data.revision ? `?v=${data.revision}` : '';
    const fullFaviconUrl = resolvedFavicon.includes('?') ? resolvedFavicon : `${resolvedFavicon}${ver}`;

    // Remove all old icon tags so browser is forced to update
    document.querySelectorAll('link[rel*="icon"]').forEach(el => el.parentNode?.removeChild(el));

    const linkIcon = document.createElement('link');
    linkIcon.rel = 'icon';
    linkIcon.type = resolvedFavicon.endsWith('.svg') ? 'image/svg+xml' : 'image/x-icon';
    linkIcon.href = fullFaviconUrl;
    document.head.appendChild(linkIcon);

    const linkShortcut = document.createElement('link');
    linkShortcut.rel = 'shortcut icon';
    linkShortcut.href = fullFaviconUrl;
    document.head.appendChild(linkShortcut);

    const linkApple = document.createElement('link');
    linkApple.rel = 'apple-touch-icon';
    linkApple.href = fullFaviconUrl;
    document.head.appendChild(linkApple);
  },[data.settings,data.content,data.revision]);
  return <PortfolioContext.Provider value={{data,loading,error,refreshData}}>{loading ? <div className="site-loading" role="status" aria-label="Loading portfolio"/> : children}</PortfolioContext.Provider>;
}
export const usePortfolio=()=>useContext(PortfolioContext);

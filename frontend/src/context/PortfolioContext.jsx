import React,{createContext,useContext,useState,useEffect,useLayoutEffect,useCallback} from 'react';
import defaults from '../data/defaults.json';
import {applyTheme,normalizeTheme} from '../utils/theme';
import {normalizePortfolioMedia} from '../utils/media';
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
    let icon=document.querySelector('link[rel="icon"]');
    if(!icon){icon=document.createElement('link');icon.rel='icon';document.head.appendChild(icon);}
    icon.href=get('brand.favicon');
  },[data.settings,data.content]);
  return <PortfolioContext.Provider value={{data,loading,error,refreshData}}>{loading ? <div className="site-loading" role="status" aria-label="Loading portfolio"/> : children}</PortfolioContext.Provider>;
}
export const usePortfolio=()=>useContext(PortfolioContext);

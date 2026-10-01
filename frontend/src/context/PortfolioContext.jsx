import React,{createContext,useContext,useState,useEffect,useLayoutEffect,useCallback} from 'react';
import defaults from '../data/defaults.json';
import {applyTheme,normalizeTheme} from '../utils/theme';
const PortfolioContext=createContext(null);
export function PortfolioProvider({children}){
  const [data,setData]=useState({...defaults,theme:normalizeTheme()}),[loading,setLoading]=useState(true),[error,setError]=useState('');
  const refreshData=useCallback(async()=>{
    try{
      const apiBase = import.meta.env.VITE_API_URL || '';
      const res=await fetch(`${apiBase}/api/portfolio`,{signal:AbortSignal.timeout(10000)});
      if(!res.ok)throw new Error('The content server is unavailable. Please retry.');
      const next=await res.json();next.theme=normalizeTheme(next.theme);applyTheme(next.theme);setData(next);setError('');return next;
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
  useEffect(()=>{const s=data.settings;document.title=`${s.first_name} ${s.last_name} | ${s.role}`;},[data.settings]);
  return <PortfolioContext.Provider value={{data,loading,error,refreshData}}>{children}</PortfolioContext.Provider>;
}
export const usePortfolio=()=>useContext(PortfolioContext);

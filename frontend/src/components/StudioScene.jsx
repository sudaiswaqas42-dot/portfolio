import React,{useEffect,useRef} from 'react';
let runtime;
function loadRuntime(){
  if(!runtime)runtime=new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='/js/unicornStudio.umd.js';script.onload=()=>resolve(window.UnicornStudio);script.onerror=()=>{runtime=null;reject(new Error('Scene unavailable'))};document.head.appendChild(script);});
  return runtime;
}
export default function StudioScene(){
 const ref=useRef(null);
 useEffect(()=>{
   let scene,disposed=false;
   loadRuntime().then(api=>{if(disposed)return;return api.addScene({element:ref.current,fps:30,scale:1,dpi:Math.min(window.devicePixelRatio,1.5),filePath:'https://cdn.prod.website-files.com/6966d53c7b70efaabd0a64ff/69ab566825a69a565cfb5d41_morable.json.txt'});}).then(result=>{scene=result;if(disposed)scene?.destroy();}).catch(()=>{});
   return ()=>{disposed=true;scene?.destroy();};
 },[]);
 return <div ref={ref} className="cont-morable" aria-label="Morable design studio visual"><span className="studio-fallback">Morable<span>Design with intention.</span></span></div>;
}

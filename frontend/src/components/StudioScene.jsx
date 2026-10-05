import React,{useEffect,useRef,useState} from 'react';
import {useContent} from '../utils/content';
import {configureStudioScene} from '../utils/studioScene.mjs';
let runtime;
function loadRuntime(){
  if(window.UnicornStudio)return Promise.resolve(window.UnicornStudio);
  if(!runtime)runtime=new Promise((resolve,reject)=>{
    const script=document.createElement('script');script.src='/js/unicornStudio.umd.js';
    script.onload=()=>resolve(window.UnicornStudio);
    script.onerror=()=>{runtime=null;script.remove();reject(new Error('Scene unavailable'));};
    document.head.appendChild(script);
  });
  return runtime;
}
const originalScene='https://cdn.prod.website-files.com/6966d53c7b70efaabd0a64ff/69ab566825a69a565cfb5d41_morable.json.txt';
export default function StudioScene(){
  const content=useContent(),ref=useRef(null);
  const [ready,setReady]=useState(false);
  const configuredUrl=content('studio.animation_scene_url');
  const sceneUrl=configuredUrl===originalScene?'/documents/studio-scene.json':configuredUrl;
  const logo=content('studio.logo_image'),text=content('studio.animated_text');
  const left=content('studio.top_left'),center=content('studio.top_center'),right=content('studio.top_right');
  useEffect(()=>{
    let scene,disposed=false,blobUrl;
    const controller=new AbortController();setReady(false);
    async function start(){
      const [api,response]=await Promise.all([loadRuntime(),fetch(sceneUrl,{signal:controller.signal})]);
      if(!response.ok)throw new Error('Scene unavailable');
      const template=await response.json();
      if(disposed)return;
      const customized=configureStudioScene(template,{'studio.logo_image':logo,'studio.animated_text':text,'studio.top_left':left,'studio.top_center':center,'studio.top_right':right});
      blobUrl=URL.createObjectURL(new Blob([JSON.stringify(customized)],{type:'application/json'}));
      scene=await api.addScene({element:ref.current,fps:30,scale:1,dpi:Math.min(window.devicePixelRatio,1.5),filePath:blobUrl});
      if(disposed)scene?.destroy();else setReady(true);
    }
    start().catch(()=>{});
    return()=>{disposed=true;controller.abort();scene?.destroy();if(blobUrl)URL.revokeObjectURL(blobUrl);};
  },[sceneUrl,logo,text,left,center,right]);
  return <div className="cont-morable" aria-label={content('studio.accessible_label_morable_design_studio_visual')}>
    {!ready&&<div className="cms-scene-fallback"><div className="cms-scene-captions"><span>{left}</span><span>{center}</span><span>{right}</span></div><strong>{text}</strong>{logo?<img src={logo} alt={content('studio.morable')}/>:<span>{content('studio.morable')}</span>}<small>{content('studio.design_with_intention')}</small></div>}
    <div ref={ref} className="cms-scene-canvas"/>
  </div>;
}

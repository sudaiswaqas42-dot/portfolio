import React,{useState} from 'react';
import {resolveMediaUrl} from '../utils/media';
function Field({label,value,onChange,multiline=false,type='text',...props}){
   return <label className="editor-field"><span>{label}</span>{multiline?<textarea rows={4} value={value??''} onChange={e=>onChange(e.target.value)} {...props}/>:<input type={type} value={value??''} onChange={e=>onChange(e.target.value)} {...props}/>}</label>;
}
async function request(url,options={}){
  const defaultBackend = (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) ? '' : 'https://portfolio-backend-production-9c68.up.railway.app';
  const apiBase = import.meta.env.VITE_API_URL || defaultBackend;
  const fullUrl = url.startsWith('/') ? `${apiBase}${url}` : url;
  const res=await fetch(fullUrl,{...options,headers:{Authorization:`Bearer ${localStorage.getItem('adminToken')}`,...options.headers}});
  const body=await res.json().catch(()=>({error:'Server response was not valid. Please retry.'}));
  if(!res.ok){const e=new Error(body.error||'Request failed');e.status=res.status;throw e;}
  return body;
}
function Upload({onUpload,label='Upload media',onBusy,acceptType}){
  const [busy,setBusy]=useState(false),[error,setError]=useState('');
  async function upload(e){
    const files=[...e.target.files];if(!files.length)return;
    if(acceptType&&files.some(file=>!file.type.startsWith(acceptType+'/'))){setError(`Choose an ${acceptType} file.`);e.target.value='';return;}
    setBusy(true);onBusy?.(true);setError('');
    try{const uploaded=[];for(const file of files){if(file.size>50*1024*1024)throw new Error('Maximum file size is 50 MB.');const result=await request('/api/admin/upload',{method:'POST',headers:{'Content-Type':file.type},body:file});uploaded.push({type:result.type,src:result.url,alt:file.name.replace(/\.[^.]+$/,''),className:result.type==='image'?'img-project':'video-cont-p2'});}onUpload(uploaded);}
    catch(e){setError(e.message);}finally{setBusy(false);onBusy?.(false);e.target.value='';}
  }
  return <div><label className="upload-button">{busy?'Uploading…':label}<input aria-label={label} type="file" accept={acceptType==='image'?'image/jpeg,image/png,image/webp,image/gif':acceptType==='video'?'video/mp4,video/webm':'image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm'} multiple={!acceptType} disabled={busy} onChange={upload}/></label>{error&&<p role="alert" className="editor-error">{error}</p>}</div>;
}
function Gallery({media=[],onChange,onBusy}){
  const update=(i,patch)=>onChange(media.map((m,j)=>i===j?{...m,...patch}:m));
  const move=(i,d)=>{const next=[...media];[next[i],next[i+d]]=[next[i+d],next[i]];onChange(next);};
  return <div className="gallery-editor"><div className="section-heading"><div><h3>Project gallery</h3><p>Upload, replace or reorder images and videos. Save changes to publish.</p></div><Upload onBusy={onBusy} onUpload={items=>onChange([...media,...items])}/></div>
    <div className="media-grid">{media.map((m,i)=><div className="media-card" key={i}>
      {m.type==='image'?<img src={resolveMediaUrl(m.src)} alt={m.alt||'Project preview'} loading="lazy"/>:<video src={resolveMediaUrl(m.src)} poster={resolveMediaUrl(m.poster)} controls preload="metadata"/>}
      <div className="media-fields"><Field label={`Media ${i+1} URL`} value={m.src} onChange={v=>update(i,{src:v,srcSet:''})}/><Field label="Description / alt text" value={m.alt} onChange={v=>update(i,{alt:v})}/>
      <label className="editor-field"><span>Media type</span><select value={m.type} onChange={e=>update(i,{type:e.target.value})}><option value="image">Image</option><option value="video">Video</option></select></label>
      {m.type==='video'&&<><Field label="Video poster URL" value={m.poster} onChange={v=>update(i,{poster:v})}/><Upload label="Upload poster" acceptType="image" onBusy={onBusy} onUpload={items=>update(i,{poster:items[0].src})}/></>}
      <label className="editor-field"><span>Layout</span><select value={m.className?.includes('hide')?'hidden':m.className?.includes('small')?'small':m.className?.includes('big')?'big':'normal'} onChange={e=>update(i,{className:`${m.type==='image'?'img-project':'video-cont-p2'} ${e.target.value==='normal'?'':e.target.value==='hidden'?'hide':e.target.value}`,id:''})}><option value="normal">Normal</option><option value="big">Full width</option><option value="small">Small</option><option value="hidden">Hidden</option></select></label>
      <div className="media-actions"><button type="button" disabled={!i} onClick={()=>move(i,-1)} aria-label={`Move media ${i+1} up`}>↑</button><button type="button" disabled={i===media.length-1} onClick={()=>move(i,1)} aria-label={`Move media ${i+1} down`}>↓</button><button type="button" onClick={()=>onChange(media.filter((_,j)=>i!==j))}>Remove</button></div>
      <Upload label={`Replace media ${i+1}`} onBusy={onBusy} onUpload={items=>update(i,{...items[0],id:m.id,className:m.className,srcSet:''})}/></div>
    </div>)}</div>{!media.length&&<p className="editor-empty">No media yet. Add your first image or video.</p>}
  </div>;
}

export {Field,Upload,Gallery,request};

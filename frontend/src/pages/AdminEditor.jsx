import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {usePortfolio} from '../context/PortfolioContext';
import {Field, Upload, Gallery, request} from './AdminFields';
import {resolveMediaUrl} from '../utils/media';
import ThemeEditor from '../components/ThemeEditor';
import catalog from '../../../shared/contentCatalog.json';
import './admin.css';

const clone = value => JSON.parse(JSON.stringify(value));
const sections = {
  social: ['Social links', 'Edit the email, LinkedIn, X / Twitter and Behance destinations used in the website header and footer.'],
  header: ['Header & navigation', 'Shared across all three pages. Edit your name, navigation buttons, destinations and social links.'],
  hero: ['Hero', 'Your first impression: name, headline, role and background photograph.'],
  intro: ['Click & scroll', 'Edit every word of the animated heading, interactive button and decorative artwork.'],
  services: ['Services', 'Section heading, service descriptions, images, videos and icons.'],
  benefits: ['Benefits', 'Both scrolling steps, background photographs, checklist and call to action.'],
  folder: ['Work folder', 'Portfolio teaser, folder label, artwork and destination.'],
  contact: ['Contact & call to action', 'Headings, button copy and confirmation messages. Shared by Home, About and Work.'],
  footer: ['Footer', 'Shared brand heading, contact links, technologies and background video.'],
  aboutHero: ['Hero & photography', 'About headline, portrait and animated introduction.'],
  biography: ['Biography', 'Section labels, biography, approach, philosophy and awards.'],
  news: ['News & updates', 'All three news cards, buttons, external links and photographs.'],
  studio: ['Animated studio card', 'Replace the center logo/image and edit the large moving text. The original wave, halftone dots and mouse effect stay the same. Small top labels are editable too.'],
  work: ['Heading & project labels', 'Work page headline, project field labels, live button and icons.'],
  projects: ['Projects & galleries', 'Create, reorder and edit projects. Manage every gallery image, video and poster.'],
  brand: ['Brand & icons', 'Logo and shared visual identity.'],
  cursor: ['Cursor & messages', 'Custom pointer icon, hover copy and click feedback.'],
  theme: ['Colors & appearance', 'Choose a palette and customize your site colors.'],
};
const pages = [
  {id:'home', name:'Home page', icon:'01', url:'/', sections:['header','hero','intro','services','benefits','folder','contact','footer']},
  {id:'about', name:'About page', icon:'02', url:'/about', sections:['header','aboutHero','biography','news','studio','contact','footer']},
  {id:'work', name:'Work page', icon:'03', url:'/work', sections:['header','work','projects','contact','footer']},
  {id:'site', name:'Site settings', icon:'✦', url:'/', sections:['social','brand','cursor','theme']},
];
const bindings = {
  social: {settings:['email','linkedin_url','twitter_url','behance_url']},
  header: {settings:['first_name','last_name','email','linkedin_url','twitter_url','behance_url']},
  hero: {settings:['first_name','last_name','title','role','hero_image']},
  benefits: {settings:['benefits_dark_image','benefits_silhouette_image','benefits_light_image']},
  contact: {settings:['email']},
  footer: {settings:['footer_heading','footer_subheading','footer_tech_label','footer_technologies','footer_video','footer_video_poster','email','linkedin_url','twitter_url','behance_url']},
  aboutHero: {about:['headline'],settings:['about_image']},
  biography: {about:['who_i_am','approach','philosophy','awards']},
  news: {about:[1,2,3].flatMap(n=>[`news${n}_title`,`news${n}_desc`,`news${n}_link`]).concat(['news2_img1','news2_img2','news2_img3','news3_img1','news3_img2'])},
};
const labels = {title:'Hero heading',role:'Professional role',hero_image:'Hero background image',about_image:'About portrait',benefits_dark_image:'Step 1: Background room photo',benefits_silhouette_image:'Step 1: Foreground person cutout (Transparent PNG — sits in front of text; or "none")',benefits_light_image:'Step 2: Light background photo',footer_technologies:'Technologies — one per line',footer_video_poster:'Video poster',who_i_am:'Who I am',awards:'Awards — one per line'};
const human = key => labels[key] || key.replace(/_/g,' ').replace(/news(\d)/g,'News card $1').replace(/img(\d)/g,'image $1').replace(/^./,c=>c.toUpperCase());
const boundType = key => /video$/.test(key)?'video':/image|img\d|poster/.test(key)?'image':/url|link/.test(key)?'link':'text';
const fieldsFor = section => Object.entries(catalog).filter(([,field])=>field.group===section||(section==='hero'&&field.group==='heroCards'));
const normalize = data => ({...clone(data),content:{...Object.fromEntries(Object.entries(catalog).map(([k,f])=>[k,f.value])),...data.content}});
const editable = ['settings','about','content','projects','services','philosophy','theme'];

function AssetField({label,value,type,onChange,onBusy}) {
  const media=['image','video'].includes(type);
  return <div className={media?'cms-asset':'cms-copy-field'}>
    {media && value && value!=='none' && (type==='image'?<img className="photo-preview" src={resolveMediaUrl(value)} alt={`${label} preview`} loading="lazy"/>:<video className="photo-preview" src={resolveMediaUrl(value)} controls preload="metadata"/>)}
    <Field label={label} value={value} multiline={!media&&type==='text'&&(String(value).includes('\n')||String(value).length>110||/description|biography|philosophy|approach|who i am|awards|technologies/i.test(label))} onChange={onChange}/>
    {media&&<Upload label={`Upload ${type}`} onBusy={onBusy} acceptType={type} onUpload={items=>onChange(items[0].src)}/>}
  </div>;
}

export default function AdminEditor() {
  const {data,loading,error,refreshData}=usePortfolio();
  const navigate=useNavigate();
  const [authorized,setAuthorized]=useState(false), [draft,setDraft]=useState(null), [baseline,setBaseline]=useState(null);
  const [page,setPage]=useState('home'), [section,setSection]=useState('hero'), [expanded,setExpanded]=useState('home');
  const [saving,setSaving]=useState(false), [uploads,setUploads]=useState(0), [notice,setNotice]=useState(null), [query,setQuery]=useState(''), [selected,setSelected]=useState(0);
  const busy=saving||uploads>0;
  useEffect(()=>{let live=true;request('/api/auth/me').then(()=>{if(live)setAuthorized(true)}).catch(()=>{localStorage.removeItem('adminToken');navigate('/login',{replace:true})});return()=>{live=false}},[navigate]);
  useEffect(()=>{if(!loading&&!error&&data.revision&&!draft){setDraft(normalize(data));setBaseline(normalize(data));}},[data,loading,error,draft]);
  const dirty=!!draft&&editable.some(k=>JSON.stringify(draft[k])!==JSON.stringify(baseline[k]));
  useEffect(()=>{const prevent=e=>{if(dirty){e.preventDefault();e.returnValue='';}};window.addEventListener('beforeunload',prevent);return()=>window.removeEventListener('beforeunload',prevent)},[dirty]);
  const onBusy=active=>setUploads(n=>Math.max(0,n+(active?1:-1)));
  const patch=(key,value)=>setDraft(d=>({...d,[key]:value}));
  const field=(area,key,value)=>setDraft(d=>({...d,[area]:{...d[area],[key]:value}}));
  const updateProject=(key,value)=>setDraft(d=>({...d,projects:d.projects.map((p,i)=>i===selected?{...p,[key]:value}:p)}));
  const matches=(label,value)=>!query||`${label} ${value}`.toLowerCase().includes(query.toLowerCase());
  function sectionChanged(key){
    if(!draft)return false;
    if(['projects','services','theme'].includes(key)&&JSON.stringify(draft[key])!==JSON.stringify(baseline[key]))return true;
    if(key==='benefits'&&JSON.stringify(draft.philosophy)!==JSON.stringify(baseline.philosophy))return true;
    return fieldsFor(key).some(([k])=>draft.content[k]!==baseline.content[k])||Object.entries(bindings[key]||{}).some(([area,keys])=>keys.some(k=>JSON.stringify(draft[area][k])!==JSON.stringify(baseline[area][k])));
  }
  async function save(e){
    e.preventDefault();if(busy)return;setSaving(true);setNotice(null);
    try{
      const saved=await request('/api/admin/document',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(draft)});
      setDraft(normalize(saved));setBaseline(normalize(saved));
      setNotice({ok:true,text:'Published successfully. All your changes are saved to the database.'});
      await refreshData();
      if(typeof BroadcastChannel!=='undefined'){const channel=new BroadcastChannel('portfolio-content');channel.postMessage('saved');channel.close();}
    }catch(e){setNotice({ok:false,text:e.message});if(e.status===401){localStorage.removeItem('adminToken');navigate('/login');}}
    finally{setSaving(false);}
  }
  async function reload(){
    if(dirty&&!window.confirm('Discard your unsaved changes and load the latest published content?'))return;
    const latest=await refreshData();if(latest){setDraft(normalize(latest));setBaseline(normalize(latest));setSelected(0);setNotice(null);}
  }
  function logout(){if(dirty&&!window.confirm('Leave without publishing your changes?'))return;localStorage.removeItem('adminToken');localStorage.removeItem('adminUser');navigate('/login');}
  if(!authorized||!draft)return <div className="admin-shell"><div className="editor-loading"><h1>Portfolio Studio</h1><p>{error||'Opening your content workspace…'}</p>{error&&<button onClick={refreshData}>Retry connection</button>}<Link to="/">Back to website</Link></div></div>;
  const currentPage=pages.find(p=>p.id===page), project=draft.projects[selected];
  const contentFields=fieldsFor(section).filter(([key,f])=>f.group!=='heroCards'&&matches(f.label,draft.content[key]));
  return <div className="admin-shell cms-studio">
    <aside className="editor-sidebar">
      <Link className="editor-brand" to="/" target="_blank"><i>◈</i> Portfolio<span>CONTENT STUDIO</span></Link>
      <div className="cms-site-badge"><span className="cms-live-dot"/> {draft.settings.first_name} {draft.settings.last_name}<small>Your website workspace</small></div>
      <p className="cms-nav-caption">WEBSITE PAGES</p>
      <nav aria-label="Page and section navigation">{pages.map(p=><div className="cms-nav-group" key={p.id}>
        <button type="button" className="cms-page-toggle" aria-expanded={expanded===p.id} onClick={()=>setExpanded(expanded===p.id?'':p.id)}><span><small>{p.icon}</small>{p.name}</span><span>{expanded===p.id?'−':'+'}</span></button>
        {expanded===p.id&&<div className="cms-subnav">{p.sections.map(key=><button type="button" key={key} aria-current={page===p.id&&section===key?'page':undefined} onClick={()=>{setPage(p.id);setSection(key);setQuery('');setNotice(null);}}>{sections[key][0]}{sectionChanged(key)&&<span className="dirty-dot"/>}</button>)}</div>}
      </div>)}</nav>
      <div className="sidebar-bottom"><Link to={currentPage.url} target="_blank">↗ Open website</Link><button type="button" disabled={busy} onClick={logout}>Sign out</button></div>
    </aside>
    <main className="editor-main"><form onSubmit={save}>
      <header className="editor-toolbar"><div><p>{currentPage.name} <span>/</span> {sections[section][0]}</p><h1>{sections[section][0]}</h1><span className={dirty?'cms-status pending':'cms-status'}>{dirty?'● Unpublished changes':'● All changes published'} · Revision {baseline.revision}</span></div><div className="toolbar-actions"><button type="button" disabled={!dirty||busy} onClick={()=>{if(window.confirm('Discard all unpublished changes?')){setDraft(clone(baseline));setSelected(0);setNotice(null);}}}>Discard</button><button className="primary" type="submit" disabled={!dirty||busy||!!error}>{saving?'Publishing…':uploads?'Uploading…':'Publish changes'} <span>↗</span></button></div></header>
      {notice&&<div className={`editor-notice ${notice.ok?'success':'failure'}`} role={notice.ok?'status':'alert'}>{notice.text}{!notice.ok&&<button type="button" onClick={reload}>Reload saved content</button>}</div>}
      {error&&<div className="editor-notice failure" role="alert">{error}<button type="button" onClick={refreshData}>Retry connection</button></div>}
      <div className="cms-section-intro"><div><p>{sections[section][1]}</p><small>Changes stay in your draft until you publish. You can move freely between sections.</small></div><label className="cms-search"><span>Find a field</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search this section…"/></label></div>
      <fieldset className="editor-body" disabled={busy}>
        {section==='hero'&&<section className="editor-card"><div className="cms-card-title"><h2>Cursor preview cards</h2><span>4 IMAGES</span></div><p>These cards change as the cursor moves from left to right over the hero. Upload any picture for each card; the original mouse animation stays the same. A wide image (900 × 375) fits best. Clear a URL to restore that card’s original picture.</p><div className="field-grid">{[1,2,3,4].filter(index=>matches(`Cursor card ${index}`,draft.content[`hero.card_${index}`])).map(index=><AssetField key={index} label={`Cursor card ${index} image`} type="image" value={draft.content[`hero.card_${index}`]} onBusy={onBusy} onChange={value=>field('content',`hero.card_${index}`,value)}/>)}</div></section>}
        {Object.entries(bindings[section]||{}).map(([area,keys])=><section className="editor-card" key={area}><div className="cms-card-title"><h2>{area==='about'?'Page content':'Content & media'}</h2><span>EDITABLE</span></div><div className="field-grid">{keys.filter(key=>matches(human(key),draft[area][key])).map(key=><AssetField key={key} label={human(key)} type={boundType(key)} value={Array.isArray(draft[area][key])?draft[area][key].join('\n'):draft[area][key]??''} onBusy={onBusy} onChange={value=>field(area,key,key==='footer_technologies'?value.split('\n'):value)}/>)}</div></section>)}
        {!!contentFields.length&&<section className="editor-card"><div className="cms-card-title"><h2>Text, buttons & artwork</h2><span>{contentFields.length} FIELDS</span></div><div className="field-grid">{contentFields.map(([key,f])=><AssetField key={key} label={f.label} type={f.type} value={draft.content[key]} onBusy={onBusy} onChange={value=>field('content',key,value)}/>)}</div></section>}
        {section==='benefits'&&<section className="editor-card"><h2>Client benefits</h2>{draft.philosophy.map((value,i)=><div className="benefit-row" key={i}><Field label={`Benefit ${i+1}`} value={value} multiline onChange={v=>patch('philosophy',draft.philosophy.map((x,j)=>j===i?v:x))}/><button type="button" aria-label={`Remove benefit ${i+1}`} onClick={()=>patch('philosophy',draft.philosophy.filter((_,j)=>i!==j))}>Remove</button></div>)}<button type="button" onClick={()=>patch('philosophy',[...draft.philosophy,''])}>+ Add benefit</button></section>}
        {section==='theme'&&<ThemeEditor value={draft.theme} onChange={v=>patch('theme',v)}/>}
        {section==='services'&&draft.services.map((service,i)=><section className="editor-card" key={service.id||i}><h2>{service.title||`Service ${i+1}`}</h2><Field label="Title" value={service.title} onChange={v=>patch('services',draft.services.map((s,j)=>i===j?{...s,title:v}:s))}/><Field label="Description" multiline value={service.description} onChange={v=>patch('services',draft.services.map((s,j)=>i===j?{...s,description:v}:s))}/>{['images','videos'].map(kind=><div key={kind}><h3>{human(kind)}</h3><div className="field-grid">{[0,1].map(index=><AssetField key={index} label={`${human(kind)} ${index+1}`} type={kind==='images'?'image':'video'} value={service[kind]?.[index]||''} onBusy={onBusy} onChange={v=>{const values=[...(service[kind]||[])];values[index]=v;patch('services',draft.services.map((s,j)=>i===j?{...s,[kind]:values}:s))}}/>)}</div></div>)}</section>)}
        {section==='projects'&&<><div className="project-picker"><label className="editor-field"><span>Select project · {draft.projects.length} projects</span><select value={selected} onChange={e=>setSelected(Number(e.target.value))}>{draft.projects.map((p,i)=><option key={p.id||i} value={i}>{i+1}. {p.title||'Untitled project'}</option>)}</select></label><button type="button" onClick={()=>{patch('projects',[...draft.projects,{slug:`project-${Date.now()}`,title:'New project',nav_title:'New project',year:String(new Date().getFullYear()),challenge:'',services_text:'',role_text:'',live_link:'',media:[],gallery_class:'cont-project-imgs'}]);setSelected(draft.projects.length)}}>+ Add project</button></div>
          {project?<section className="editor-card"><div className="section-heading"><h2>{project.title}</h2><div className="media-actions">{[-1,1].map(direction=><button key={direction} type="button" disabled={direction===-1?selected===0:selected===draft.projects.length-1} onClick={()=>{const items=[...draft.projects];[items[selected],items[selected+direction]]=[items[selected+direction],items[selected]];patch('projects',items);setSelected(selected+direction)}}>{direction===-1?'↑ Move up':'↓ Move down'}</button>)}<button type="button" className="danger" onClick={()=>{if(window.confirm('Remove this project from the draft?')){patch('projects',draft.projects.filter((_,i)=>i!==selected));setSelected(0)}}}>Remove project</button></div></div><div className="field-grid">{['title','nav_title','slug','year','challenge','services_text','role_text','live_link'].map(key=><Field key={key} label={key==='title'?'Project title':human(key)} multiline={['challenge','role_text'].includes(key)} value={project[key]} onChange={v=>updateProject(key,v)}/>)}</div><Gallery media={project.media} onBusy={onBusy} onChange={v=>updateProject('media',v)}/></section>:<p className="editor-empty">No projects yet. Add a project to start your portfolio.</p>}
        </>}
      </fieldset><div className="cms-endnote">Portfolio Studio <span>·</span> Changes to shared sections update every page.</div>
    </form></main>
  </div>;
}

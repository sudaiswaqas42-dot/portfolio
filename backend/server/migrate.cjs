const pool = require('./db.cjs');
const defaults = require('../data/defaults.json');
module.exports = async function migrate() {
  const additions = { 
    projects: {media_json:'LONGTEXT', gallery_class:'VARCHAR(100)'},
    site_settings:{
      theme_json:'LONGTEXT',
      hero_image:'TEXT',
      about_image:'TEXT',
      benefits_silhouette_image:'TEXT',
      benefits_dark_image:'TEXT',
      benefits_light_image:'TEXT',
      footer_video:'TEXT',
      footer_video_poster:'TEXT',
      footer_heading:'VARCHAR(500)',
      footer_subheading:'VARCHAR(500)',
      footer_tech_label:'VARCHAR(255)',
      footer_technologies_json:'TEXT'
    },
    about_content:{
      news2_img1:'TEXT',
      news2_img2:'TEXT',
      news2_img3:'TEXT',
      news3_img1:'TEXT',
      news3_img2:'TEXT'
    }
  };
  for (const [table, columns] of Object.entries(additions)) {
    const [existing] = await pool.query(`SHOW COLUMNS FROM ${table}`);
    for (const [column,type] of Object.entries(columns)) {
      if (!existing.some(c=>c.Field===column)) await pool.query(`ALTER TABLE ${table} ADD COLUMN ${column} ${type}`);
    }
  }
  for (const p of defaults.projects) await pool.query('UPDATE projects SET media_json=?, gallery_class=? WHERE slug=? AND media_json IS NULL',[JSON.stringify(p.media),p.gallery_class,p.slug]);
  await pool.query('INSERT IGNORE INTO services (service_key,title,description,images_json,videos_json,sort_order) VALUES (?,?,?,?,?,?)',['development','Webflow & Framer','Building elegant and responsive projects featuring creative micro-interactions and seamless CMS hand-off.',JSON.stringify(['/images/webflow-tag-juan-mora.svg','/images/framer-tag-juan-mora.svg']),'[]',3]);
  await pool.query('UPDATE about_content SET news2_img1 = COALESCE(NULLIF(news2_img1, ""), ?), news2_img2 = COALESCE(NULLIF(news2_img2, ""), ?), news2_img3 = COALESCE(NULLIF(news2_img3, ""), ?), news3_img1 = COALESCE(NULLIF(news3_img1, ""), ?), news3_img2 = COALESCE(NULLIF(news3_img2, ""), ?) WHERE id = 1', [
    '/images/domestika-juan-mora-1.png',
    '/images/domestika2.jpg',
    '/images/domestika-juan-mora-3.png',
    '/images/dont-scroll-down-juanmora1.png',
    '/images/dont-scroll-down-juanmora2.png'
  ]);
  await pool.query(`UPDATE site_settings SET 
    footer_video = COALESCE(NULLIF(footer_video, ""), ?),
    footer_video_poster = COALESCE(NULLIF(footer_video_poster, ""), ?),
    footer_heading = COALESCE(NULLIF(footer_heading, ""), ?),
    footer_subheading = COALESCE(NULLIF(footer_subheading, ""), ?),
    footer_tech_label = COALESCE(NULLIF(footer_tech_label, ""), ?),
    footer_technologies_json = COALESCE(NULLIF(footer_technologies_json, ""), ?)
    WHERE id = 1`, [
    '/videos-work/desk_jm3.mp4',
    '/videos-work/juan-video-loading.jpg',
    'MR USMAN GHANI',
    'Morable Design Studio [Coming Soon]',
    'Website made using:',
    JSON.stringify(['Figma', 'React / Vite', 'Node.js / Express', 'MySQL Database', 'GSAP', 'Lenis Scroll'])
  ]);
  await pool.query('CREATE TABLE IF NOT EXISTS cms_meta (id INT PRIMARY KEY, revision INT NOT NULL DEFAULT 1)');
  await pool.query('INSERT IGNORE INTO cms_meta (id,revision) VALUES (1,1)');
  await pool.query('CREATE TABLE IF NOT EXISTS cms_history (id INT AUTO_INCREMENT PRIMARY KEY, section VARCHAR(30) NOT NULL, content LONGTEXT NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)');
};

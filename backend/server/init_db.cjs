const bcrypt = require('bcryptjs');
const pool = require('./db.cjs');

async function initDB() {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log('Connected to MySQL successfully!');

    // 1. Admin users table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Site settings table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        id INT PRIMARY KEY DEFAULT 1,
        first_name VARCHAR(100) DEFAULT 'Sudais',
        last_name VARCHAR(100) DEFAULT 'Waqas',
        title VARCHAR(255) DEFAULT 'Brand & Web Design Specialist',
        role VARCHAR(255) DEFAULT 'Freelance Design Director',
        headline TEXT,
        email VARCHAR(150) DEFAULT 'sudais@morable.co',
        linkedin_url VARCHAR(255) DEFAULT 'https://www.linkedin.com/in/juanmmora/',
        twitter_url VARCHAR(255) DEFAULT 'https://x.com/ByMorable',
        behance_url VARCHAR(255) DEFAULT 'https://www.behance.net/juanmora2',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    // 3. Services table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS services (
        id INT AUTO_INCREMENT PRIMARY KEY,
        service_key VARCHAR(50) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        images_json TEXT,
        videos_json TEXT,
        sort_order INT DEFAULT 0
      );
    `);

    // 4. Philosophy points table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS philosophy_points (
        id INT AUTO_INCREMENT PRIMARY KEY,
        point_text TEXT NOT NULL,
        sort_order INT DEFAULT 0
      );
    `);

    // 5. Projects table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        slug VARCHAR(100) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        nav_title VARCHAR(100) NOT NULL,
        year VARCHAR(20) DEFAULT '2026',
        challenge TEXT,
        services_text VARCHAR(255),
        role_text TEXT,
        live_link VARCHAR(255),
        sort_order INT DEFAULT 0
      );
    `);

    // 6. About content table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS about_content (
        id INT PRIMARY KEY DEFAULT 1,
        headline VARCHAR(255) DEFAULT 'Designer based in Miami, working globally',
        who_i_am TEXT,
        approach TEXT,
        philosophy TEXT,
        awards TEXT,
        news1_title VARCHAR(255),
        news1_desc TEXT,
        news1_link VARCHAR(255),
        news2_title VARCHAR(255),
        news2_desc TEXT,
        news2_link VARCHAR(255),
        news3_title VARCHAR(255),
        news3_desc TEXT,
        news3_link VARCHAR(255)
      );
    `);

    console.log('Tables verified / created.');

    // Seed default admin user: usman-ghani@gmail.com / usman-ghani123
    const [adminRows] = await conn.query('SELECT id FROM admin_users WHERE username = "usman-ghani@gmail.com"');
    if (adminRows.length === 0) {
      const hash = await bcrypt.hash('usman-ghani123', 10);
      await conn.query('INSERT INTO admin_users (username, password_hash) VALUES ("usman-ghani@gmail.com", ?)', [hash]);
      console.log('Default admin created: username="usman-ghani@gmail.com", password="usman-ghani123"');
    }

    // Seed default settings
    const [settingsRows] = await conn.query('SELECT id FROM site_settings WHERE id = 1');
    if (settingsRows.length === 0) {
      await conn.query(`
        INSERT INTO site_settings (id, first_name, last_name, title, role, headline, email)
        VALUES (1, 'Sudais', 'Waqas', 'Brand & Web Design Specialist', 'Freelance Design Director', '16 years making users click and scroll my designs', 'sudais@morable.co');
      `);
      console.log('Default site_settings seeded.');
    }

    // Seed default services
    const [serviceRows] = await conn.query('SELECT id FROM services');
    if (serviceRows.length === 0) {
      const services = [
        {
          key: 'websites',
          title: 'Websites & Landing pages',
          description: 'Creating high-end and beautiful websites built to perform and convert.',
          images: JSON.stringify(['/images/home-work1.jpg', '/images/home-work2.jpg']),
          videos: JSON.stringify(['/videos-work/home/home-ampli.mp4', '/videos-work/home/home-shopping.mp4']),
          order: 1
        },
        {
          key: 'branding',
          title: 'Visual Branding',
          description: 'Helping brands find a distinctive visual language that truly stands out.',
          images: JSON.stringify(['/images/home-work7.jpg', '/images/home-work8.jpg']),
          videos: JSON.stringify(['/videos-work/home/home-ampli-brand.mp4', '/videos-work/home/home-brudget1.mp4']),
          order: 2
        },
        {
          key: 'product-design',
          title: 'Product Design Enhancement',
          description: 'Bringing fresh ideas to turn complex products into intuitive experiences with an elevated visual layer.',
          images: JSON.stringify(['/images/home-work5.jpg', '/images/home-work6.jpg']),
          videos: JSON.stringify(['/videos-work/home/home-alena.mp4', '/videos-work/home/home-apechain.mp4']),
          order: 3
        }
      ];

      for (const s of services) {
        await conn.query(`
          INSERT INTO services (service_key, title, description, images_json, videos_json, sort_order)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [s.key, s.title, s.description, s.images, s.videos, s.order]);
      }
      console.log('Default services seeded.');
    }

    // Seed philosophy points
    const [philRows] = await conn.query('SELECT id FROM philosophy_points');
    if (philRows.length === 0) {
      const points = [
        'I bring a premium and unique visual direction that makes your brand stand out.',
        'I care about the craft, from concept to final product.',
        'I define scalable design systems that keep your brand consistent.',
        'I align your goals with my experience to make the right design decisions for your brand.'
      ];
      for (let i = 0; i < points.length; i++) {
        await conn.query('INSERT INTO philosophy_points (point_text, sort_order) VALUES (?, ?)', [points[i], i + 1]);
      }
      console.log('Default philosophy points seeded.');
    }

    // Seed all 12 Projects
    const [projRows] = await conn.query('SELECT id FROM projects');
    if (projRows.length === 0) {
      const defaultProjects = [
        {
          slug: 'ampli',
          title: 'Ampli Brand & Website',
          nav_title: 'Ampli',
          year: '2026',
          challenge: 'Launch a blockchain startup with a premium brand and web presence ready for a high-stakes industry debut.',
          services: 'Visual Branding, Website Design, Webflow development',
          role: 'Led full brand identity and site architecture, defining the visual language and art direction for a successful market entry.',
          link: 'https://ampli.net/',
          order: 1
        },
        {
          slug: 'top-trader',
          title: 'Top Trader Trading Simulation Game',
          nav_title: 'Top Trader',
          year: '2025',
          challenge: 'Create a high-engagement brand and platform for a daily crypto trading tournament that balances professional tools with a game-like vibe.',
          services: 'Art direction, Visual Branding, Game Design',
          role: 'Designed the end-to-end UX/UI and visual system, ensuring the interface was both intuitive for traders and addictive for players.',
          link: '',
          order: 2
        },
        {
          slug: 'maps',
          title: 'Google Maps Landing page Refresh',
          nav_title: 'Google Maps',
          year: '2022',
          challenge: 'Redesign the marketing landing page to drive global user engagement through immersive storytelling and animation.',
          services: 'Concept & Narrative, Interactive Design, Animation Systems',
          role: 'Led the strategic narrative and structure, collaborating with motion teams to deliver a high-conversion experience.',
          link: 'https://maps.google.com/localguides/',
          order: 3
        },
        {
          slug: 'apechain',
          title: 'ApeChain Swap Widget',
          nav_title: 'Ape Chain',
          year: '2025',
          challenge: 'Design a distinctive DeFi bridge widget that stands out through unique micro-interactions and a friction-free user experience.',
          services: 'UI/UX Design, Visual Design, Micro-interactions',
          role: 'Led UX/UI and branding, focusing on elevating the visual quality of cross-chain transactions to drive user trust and adoption.',
          link: 'https://apechain.com/portal#bridge',
          order: 4
        },
        {
          slug: 'alena',
          title: 'Alena Mental Health App',
          nav_title: 'Alena App',
          year: '2024',
          challenge: 'Develop a safe, calming visual identity and app experience for a mental health platform focused on anxiety management.',
          services: 'Visual Identity, Mobile App Design, Brand Strategy',
          role: 'Design Director. Defined the brand ecosystem and app UI, using motion and soft aesthetics to create a welcoming safe space.',
          link: '',
          order: 5
        },
        {
          slug: 'googleai',
          title: 'Google AI Interactive Timeline',
          nav_title: 'Google AI',
          year: '2023',
          challenge: 'Tell Google’s AI history through an immersive digital experience highlighting decades of industry-leading milestones.',
          services: 'Art Direction, Interactive Storytelling, Motion Systems',
          role: 'Design Lead. Orchestrated the concept, structure, and cross-functional design to create a world-class brand narrative.',
          link: 'https://ai.google/our-ai-journey/?section=intro',
          order: 6
        },
        {
          slug: 'lotm',
          title: 'Yuga Labs Legends of the Mara',
          nav_title: 'Yuga Labs',
          year: '2023',
          challenge: 'Build the digital portal and gaming experience for Yuga Labs’ 2D stand-alone game within the Otherside universe.',
          services: 'Game Interface, Visual System, Web3 Integration',
          role: 'Designed interface and gameplay screens, bringing vibrant art and lore into a seamless web game.',
          link: 'https://lotm.otherside.xyz/',
          order: 7
        },
        {
          slug: 'cryptopunks',
          title: 'CryptoPunks Brand Revival',
          nav_title: 'CryptoPunks',
          year: '2023',
          challenge: 'Celebrate the iconic NFT pioneers by elevating their cultural footprint and visual identity for modern platforms.',
          services: 'Brand Identity, Digital Direction, Web Design',
          role: 'Led design and narrative, creating high-impact visuals honoring Web3 heritage while exploring new frontiers.',
          link: '',
          order: 8
        },
        {
          slug: 'google-photos',
          title: 'Google Photos Memories Campaign',
          nav_title: 'Google Photos',
          year: '2022',
          challenge: 'Showcase powerful machine learning features that resurface personal memories with warmth and clarity.',
          services: 'Campaign Design, Interactive Storytelling, Motion Design',
          role: 'Led interactive design and narrative pacing for key product feature launches.',
          link: '',
          order: 9
        },
        {
          slug: 'rappi',
          title: 'Rappi Credit Card & Financial Ecosystem',
          nav_title: 'Rappi',
          year: '2021',
          challenge: 'Reimagine financial services for Latin America’s largest delivery and lifestyle super-app.',
          services: 'Fintech UI/UX, Product Architecture, Card Identity',
          role: 'Design Director. Led product design for card issuance, security features, and digital wallet integrations.',
          link: '',
          order: 10
        },
        {
          slug: 'google-shopping',
          title: 'Best Things for Everything by Google',
          nav_title: 'Google Shopping',
          year: '2021',
          challenge: 'Curate and present the top 1000 highest-rated products online with intuitive categorization and fluid filtering.',
          services: 'E-commerce Architecture, Interactive Guides, Art Direction',
          role: 'Led visual design and interactive product layout across multi-device formats.',
          link: '',
          order: 11
        },
        {
          slug: 'dino-runner-ar',
          title: 'Google Dino Runner AR Experience',
          nav_title: 'Google AR',
          year: '2020',
          challenge: 'Bring Google’s beloved offline chrome dinosaur game into augmented reality for mobile users worldwide.',
          services: 'Augmented Reality Design, 3D Prototyping, Game Mechanics',
          role: 'Art Director and UI Designer, crafting interactive AR obstacles and responsive touchscreen mechanics.',
          link: '',
          order: 12
        }
      ];

      for (const p of defaultProjects) {
        await conn.query(`
          INSERT INTO projects (slug, title, nav_title, year, challenge, services_text, role_text, live_link, sort_order)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [p.slug, p.title, p.nav_title, p.year, p.challenge, p.services, p.role, p.link, p.order]);
      }
      console.log('All 12 projects seeded.');
    }

    // Seed About Content
    const [aboutRows] = await conn.query('SELECT id FROM about_content WHERE id = 1');
    if (aboutRows.length === 0) {
      await conn.query(`
        INSERT INTO about_content (
          id, headline, who_i_am, approach, philosophy, awards,
          news1_title, news1_desc, news1_link,
          news2_title, news2_desc, news2_link,
          news3_title, news3_desc, news3_link
        ) VALUES (
          1,
          'Designer based in Miami, working globally',
          'I’m Sudais Waqas, a Design Director focused on Web, Branding, and Product for the last 16 years.\\n\\nSince the beginning, I’ve been passionate with learning and refining the craft — exploring different styles, techniques, and ways to apply them depending on what each brand actually needs.\\n\\nI’m from Bogota, Colombia and moved to the U.S. about 10 years ago. I spent my first years between LA and San Francisco, leading projects for Google, and later moved to Miami where I continued working leading design projects.\\n\\nNow I’m building Morable — a Design Studio focused on helping brands create work that feels more artistic, human, and intentional.',
          'I like to start with little context, I look at your brand through the user’s eyes first, then from the inside out, focusing on understanding the product, the audience, and the real problem behind the brief.\\n\\nFrom there, I help define the direction and bring ideas, not just to make things look better, but to make them work better.\\n\\nI like work closely with different departments to align on goals, my role is not just execution — it’s bringing clarity, perspective, and elevate the outcome.',
          'I don’t follow trends blindly, I use them when they make sense. My goal is always to create something distinctive, something people actually remember.\\n\\nEvery project, no matter the size, deserves the same level of care, something that feels thoughtful, well-crafted, and built to last.\\n\\nAnd yes, I believe humor is a design tool.',
          '2x Webby Awards\\n7x Awwwards\\n5x FWA\\n4x CSS Design Awards\\n6x Behance Featured',
          'Running my own Design Studio',
          'Morable is a Design Studio with an artistic approach to brand building, using technology to push boundaries. We have our network of the most talented freelancers to tackle ambitious projects.',
          'https://morable.co/',
          'Enjoy my online course',
          'I partnered with Domestika to teach designers and marketers how to create landing pages that stand out through storytelling.',
          'https://www.domestika.org/en/courses/4542-ux-ui-design-for-landing-pages-tell-an-original-story/juanmora_mdg',
          'Don\\'t Scroll Down',
          'An award-winning reverse-psychology experience created in 2020 to play with humor to share a deep reflection I learned during my darkest days.',
          'https://juanmora.co/dontscrolldown/'
        );
      `);
      console.log('Default about content seeded.');
    }

    console.log('Database initialization completed successfully!');
  } catch (err) {
    console.error('Database initialization error:', err);
    throw err;
  } finally {
    if (conn) conn.release();
    if (require.main === module) {
      process.exit(0);
    }
  }
}

if (require.main === module) {
  initDB();
}

module.exports = initDB;

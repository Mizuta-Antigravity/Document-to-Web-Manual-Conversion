import { marked } from 'marked';
import { formatMarkdownToHtml } from './formatter';

/**
 * Markdownを本格的な3カラムレイアウトの高機能Webマニュアル（HTML）としてエクスポートする
 * @param {string} markdown 
 * @param {string} title 
 */
export const downloadAsHtml = (markdown, title = 'Webマニュアル') => {
  // MarkdownをHTMLに変換し、独自タグを処理
  let htmlContent = formatMarkdownToHtml(markdown, marked.parse);

  // 今日の日付
  const today = new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });

  // 企業向けで使いやすさを追求したCSS
  const css = `
    :root {
      --primary: #2563eb;
      --primary-hover: #1d4ed8;
      --bg-body: #f8fafc;
      --bg-surface: #ffffff;
      --text-main: #1e293b;
      --text-muted: #64748b;
      --border: #e2e8f0;
      --sidebar-w-left: 280px;
      --sidebar-w-right: 240px;
      --header-h: 64px;
    }
    * { box-sizing: border-box; }
    body {
      font-family: 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif;
      line-height: 1.7;
      color: var(--text-main);
      background-color: var(--bg-body);
      margin: 0;
      padding: 0;
      overflow-y: scroll;
    }
    
    /* Global Header */
    header {
      position: fixed;
      top: 0; left: 0; right: 0;
      height: var(--header-h);
      background: var(--bg-surface);
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      z-index: 1000;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .menu-toggle {
      display: none;
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: var(--text-muted);
      padding: 4px;
    }
    .header-logo {
      font-size: 1.25rem;
      font-weight: bold;
      color: var(--primary);
    }
    .search-container {
      position: relative;
      width: 400px;
    }
    .search-input {
      width: 100%;
      padding: 10px 16px 10px 40px;
      border: 1px solid var(--border);
      border-radius: 999px;
      background: var(--bg-body);
      font-size: 0.9rem;
      transition: all 0.2s;
    }
    .search-input:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
      background: #fff;
    }
    .search-icon {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-muted);
    }

    /* Layout */
    .layout {
      display: flex;
      max-width: 1600px;
      margin: var(--header-h) auto 0;
      min-height: calc(100vh - var(--header-h));
    }

    /* Overlay for mobile sidebar */
    .sidebar-overlay {
      display: none;
      position: fixed;
      top: var(--header-h); left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.4);
      z-index: 800;
      opacity: 0;
      transition: opacity 0.3s;
    }

    /* Sidebars */
    aside {
      position: fixed;
      top: var(--header-h);
      bottom: 0;
      background: var(--bg-surface);
      overflow-y: auto;
      padding: 24px;
      z-index: 900;
    }
    .sidebar-left {
      width: var(--sidebar-w-left);
      left: 0;
      border-right: 1px solid var(--border);
      transition: transform 0.3s ease;
    }
    .sidebar-right {
      width: var(--sidebar-w-right);
      right: 0;
      border-left: 1px solid var(--border);
    }
    .nav-title {
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 16px;
    }
    .nav-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .nav-item { margin-bottom: 8px; }
    .nav-link {
      display: block;
      padding: 6px 12px;
      color: var(--text-main);
      text-decoration: none;
      font-size: 0.95rem;
      border-radius: 6px;
      transition: background 0.1s;
    }
    .nav-link:hover { background: var(--bg-body); }
    .nav-link.active {
      background: #eff6ff;
      color: var(--primary);
      font-weight: 600;
    }
    .nav-right-link {
      font-size: 0.85rem;
      color: var(--text-muted);
    }

    /* Main Content */
    main {
      flex: 1;
      margin-left: var(--sidebar-w-left);
      margin-right: var(--sidebar-w-right);
      padding: 0;
      background: var(--bg-surface);
      min-height: 100vh;
    }
    
    /* Cover Page */
    .cover-page {
      background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
      color: white;
      padding: 80px 60px;
      text-align: center;
      margin-bottom: 40px;
      border-bottom: 1px solid var(--border);
    }
    .cover-page h1 {
      font-size: 3rem;
      font-weight: 800;
      margin: 0 0 20px 0;
      line-height: 1.3;
      text-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .cover-meta {
      font-size: 1.1rem;
      opacity: 0.9;
    }
    
    .main-inner {
      padding: 0 60px 100px;
      max-width: 900px;
      margin: 0 auto;
    }

    .meta-bar {
      margin-bottom: 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.85rem;
      color: var(--text-muted);
    }
    .breadcrumbs {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    /* Markdown Typography */
    .markdown-body { width: 100%; }
    .markdown-body h1 {
      font-size: 2.2rem;
      color: var(--text-main);
      margin-bottom: 1.5rem;
      line-height: 1.3;
    }
    .markdown-body h2 {
      font-size: 1.75rem;
      border-bottom: 2px solid var(--border);
      padding-bottom: 0.5rem;
      margin-top: 4rem;
      margin-bottom: 1.25rem;
      color: var(--primary);
    }
    .markdown-body h3 {
      font-size: 1.35rem;
      margin-top: 2rem;
      margin-bottom: 1rem;
      color: #334155;
    }
    .markdown-body p { margin-bottom: 1.25rem; }
    
    /* Lists */
    .markdown-body ul {
      list-style: none; /* 絵文字を使うので標準のポレットを消す */
      padding-left: 0.5rem;
      margin-bottom: 1.5rem;
    }
    .markdown-body ol {
      margin-bottom: 1.5rem;
      padding-left: 1.5rem;
    }
    .markdown-body li { 
      margin-bottom: 0.75rem; 
      position: relative;
    }
    .markdown-body ul > li {
      padding-left: 0;
    }
    
    /* Details / Accordion */
    details {
      background: var(--bg-body);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 12px 16px;
      margin-bottom: 1.5rem;
    }
    summary {
      font-weight: 600;
      cursor: pointer;
      color: var(--primary);
      outline: none;
    }
    details > div {
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px dashed var(--border);
    }

    /* Alerts */
    .alert {
      border-left: 4px solid;
      padding: 16px;
      border-radius: 0 8px 8px 0;
      margin-bottom: 1.5rem;
    }
    .alert-title { font-weight: bold; margin-bottom: 8px; display: flex; align-items: center; }
    .alert-important { background: #fef2f2; border-color: #ef4444; color: #991b1b; }
    .alert-tip { background: #eff6ff; border-color: #3b82f6; color: #1e40af; }
    .alert-warning { background: #fefce8; border-color: #eab308; color: #854d0e; }

    /* Tables */
    table { width: 100%; border-collapse: collapse; margin-bottom: 1.5rem; }
    th, td { border: 1px solid var(--border); padding: 12px; text-align: left; }
    th { background: var(--bg-body); font-weight: 600; }

    /* Images */
    .manual-image {
      width: 100%;
      max-height: 400px;
      object-fit: cover;
      border-radius: 12px;
      margin: 1.5rem 0 2.5rem;
      border: 1px solid var(--border);
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
    }

    /* Icons */
    .manual-icon {
      width: 1.2em;
      height: 1.2em;
      vertical-align: -0.2em;
      margin-right: 0.4em;
      stroke-width: 1.5px;
      color: var(--primary);
    }

    /* Search Highlight */
    mark {
      background-color: #fef08a;
      color: #000;
      padding: 0 2px;
      border-radius: 2px;
    }

    /* Responsive */
    @media (max-width: 1200px) {
      .sidebar-right { display: none; }
      main { margin-right: 0; }
    }
    @media (max-width: 900px) {
      .menu-toggle { display: block; }
      .search-container { width: 180px; }
      
      .sidebar-left { 
        transform: translateX(-100%); 
        width: 300px;
        box-shadow: 2px 0 8px rgba(0,0,0,0.1);
      }
      .sidebar-left.open {
        transform: translateX(0);
      }
      .sidebar-overlay.open {
        display: block;
        opacity: 1;
      }
      
      main { margin-left: 0; }
      .cover-page { padding: 50px 20px; }
      .cover-page h1 { font-size: 2rem; }
      .main-inner { padding: 0 24px 80px; }
    }

    /* Print Styles for PDF */
    @media print {
      header, aside, .sidebar-overlay, .search-container, .menu-toggle, .btn-print {
        display: none !important;
      }
      .layout {
        margin-top: 0 !important;
        display: block !important;
      }
      main {
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
        min-height: auto !important;
      }
      .main-inner {
        padding: 0 !important;
        max-width: 100% !important;
      }
      .cover-page {
        padding: 100px 40px !important;
        background: #f8fafc !important;
        color: #1e3a8a !important;
        border: 2px solid #e2e8f0 !important;
        page-break-after: always;
      }
      .cover-page h1 { text-shadow: none !important; }
      .markdown-body h2 {
        page-break-before: always;
        margin-top: 2rem !important;
      }
      .markdown-body h1, .markdown-body h2, .markdown-body h3 {
        color: #000 !important;
      }
      body {
        background: #fff !important;
        color: #000 !important;
        font-size: 12pt;
      }
      .manual-image {
        max-height: 500px !important;
        page-break-inside: avoid;
      }
      details {
        border: 1px solid #ccc !important;
      }
      summary {
        list-style: none !important;
      }
    }
    
    .btn-print {
      background: var(--bg-body);
      border: 1px solid var(--border);
      color: var(--text-muted);
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;
    }
    .btn-print:hover {
      background: var(--primary);
      color: white;
      border-color: var(--primary);
    }
  `;

  // JS for Interactions
  const script = `
    document.addEventListener('DOMContentLoaded', () => {
      const content = document.querySelector('.markdown-body');
      const navLeft = document.getElementById('nav-left');
      const navRight = document.getElementById('nav-right');
      const breadcrumb = document.getElementById('current-h2-breadcrumb');
      
      const h2s = Array.from(content.querySelectorAll('h2'));
      const h3s = Array.from(content.querySelectorAll('h3'));
      
      // Build Left Navigation (H2)
      h2s.forEach(h2 => {
        if(!h2.id) h2.id = 'h2-' + Math.random().toString(36).substr(2, 9);
        const li = document.createElement('li');
        li.className = 'nav-item';
        li.innerHTML = '<a href="#'+h2.id+'" class="nav-link">' + h2.textContent + '</a>';
        navLeft.appendChild(li);
      });

      // Build Right Navigation (H3)
      h3s.forEach(h3 => {
        if(!h3.id) h3.id = 'h3-' + Math.random().toString(36).substr(2, 9);
        const li = document.createElement('li');
        li.className = 'nav-item';
        li.innerHTML = '<a href="#'+h3.id+'" class="nav-link nav-right-link">' + h3.textContent + '</a>';
        navRight.appendChild(li);
      });

      // Mobile Menu Toggle
      const menuToggle = document.getElementById('menu-toggle');
      const sidebarLeft = document.querySelector('.sidebar-left');
      const overlay = document.querySelector('.sidebar-overlay');

      const toggleMenu = () => {
        sidebarLeft.classList.toggle('open');
        overlay.classList.toggle('open');
      };

      menuToggle.addEventListener('click', toggleMenu);
      overlay.addEventListener('click', toggleMenu);

      // Close menu when clicking a link on mobile
      document.querySelectorAll('#nav-left .nav-link').forEach(link => {
        link.addEventListener('click', () => {
          if (window.innerWidth <= 900) {
            toggleMenu();
          }
        });
      });

      // Scroll Spy with scrolling flag to prevent highlight jumps
      let isScrolling = false;
      let scrollTimeout;

      // When clicking nav links, pause intersection observer highlights temporarily
      document.querySelectorAll('.nav-link').forEach(a => {
        a.addEventListener('click', function(e) {
          isScrolling = true;
          
          // Clear active classes
          const container = this.closest('.nav-list');
          container.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
          this.classList.add('active');
          
          clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(() => {
            isScrolling = false;
          }, 800); // Resume after 800ms
        });
      });

      // Intersection Observer with a very thin top detection area
      const observerOptions = { 
        rootMargin: '-10% 0px -85% 0px', 
        threshold: 0 
      };

      const observer = new IntersectionObserver(entries => {
        if (isScrolling) return; // Skip if user just clicked a link

        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            const tagName = entry.target.tagName.toLowerCase();
            
            document.querySelectorAll('a[href="#'+id+'"]').forEach(a => {
              if (tagName === 'h2') {
                document.querySelectorAll('#nav-left .nav-link').forEach(l => l.classList.remove('active'));
                a.classList.add('active');
                breadcrumb.textContent = entry.target.textContent;
              } else if (tagName === 'h3') {
                document.querySelectorAll('#nav-right .nav-link').forEach(l => l.classList.remove('active'));
                a.classList.add('active');
              }
            });
          }
        });
      }, observerOptions);

      [...h2s, ...h3s].forEach(heading => observer.observe(heading));

      // Fallback for initial load
      if(h2s.length > 0) breadcrumb.textContent = h2s[0].textContent;

      // Search Functionality
      const searchInput = document.getElementById('search-input');
      const originalHtml = content.innerHTML;

      searchInput.addEventListener('input', (e) => {
        const term = e.target.value.trim();
        if (!term) {
          content.innerHTML = originalHtml;
          return;
        }
        
        content.innerHTML = originalHtml;
        const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT, null, false);
        const nodes = [];
        let node;
        while (node = walker.nextNode()) nodes.push(node);
        
        // Safe regex escaping
        const escapedTerm = term.replace(/[.*+?^$(){}|\\[\\]\\\\]/g, '\\\\$&');
        const regex = new RegExp('(' + escapedTerm + ')', 'gi');
        
        nodes.forEach(n => {
          if (n.nodeValue.trim() && n.parentNode.tagName !== 'MARK') {
            const matches = n.nodeValue.match(regex);
            if (matches) {
              const span = document.createElement('span');
              span.innerHTML = n.nodeValue.replace(regex, '<mark>$1</mark>');
              n.parentNode.replaceChild(span, n);
            }
          }
        });
      });
    });
  `;

  const fullHtml = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    ${css}
  </style>
</head>
<body>
  <header>
    <div class="header-left">
      <button id="menu-toggle" class="menu-toggle">☰</button>
      <div class="header-logo">${title}</div>
    </div>
    <div class="search-container">
      <span class="search-icon">🔍</span>
      <input type="text" id="search-input" class="search-input" placeholder="マニュアル内検索...">
    </div>
    <button id="btn-print" class="btn-print">
      <i data-lucide="printer" style="width: 16px; height: 16px;"></i>
      PDF
    </button>
  </header>

  <div class="sidebar-overlay"></div>

  <div class="layout">
    <aside class="sidebar-left">
      <div class="nav-title">メニュー</div>
      <ul class="nav-list" id="nav-left"></ul>
    </aside>

    <main>
      <div class="cover-page">
        <h1>${title}</h1>
        <div class="cover-meta">作成日: ${today}</div>
      </div>
      
      <div class="main-inner">
        <div class="meta-bar">
          <div class="breadcrumbs">TOP &gt; <span id="current-h2-breadcrumb" style="font-weight: 600; color: var(--primary)">概要</span></div>
          <div class="last-updated">最終更新: ${today}</div>
        </div>
        <div class="markdown-body">
          ${htmlContent}
        </div>
      </div>
    </main>

    <aside class="sidebar-right">
      <div class="nav-title">このページの目次</div>
      <ul class="nav-list" id="nav-right"></ul>
    </aside>
  </div>

  <script src="https://unpkg.com/lucide@latest"></script>
  <script>
    ${script}
    
    // PDF Print functionality
    document.getElementById('btn-print').addEventListener('click', () => {
      window.print();
    });

    // Initialize icons
    lucide.createIcons();
  </script>
</body>
</html>`;

  // Blobを作成してダウンロード
  const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

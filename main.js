/**
 * Portfolio — Efe Düzçay
 * main.js
 */

/* =========================================================
   1. DARK MODE
   ========================================================= */
(function initTheme() {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
})();

const darkToggle = document.getElementById('darkToggle');
if (darkToggle) {
    darkToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    });
}

/* =========================================================
   2. NAVBAR
   ========================================================= */
const navbar = document.querySelector('.navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        hamburger.classList.toggle('open', isOpen);
        hamburger.setAttribute('aria-expanded', isOpen);
    });

    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            hamburger.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });
}

// Active section highlight
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links .nav-link[href^="#"]');

const sectionObserver = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navAnchors.forEach(a => {
                    a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`);
                });
            }
        });
    },
    { rootMargin: '-50% 0px -49% 0px' }
);
sections.forEach(s => sectionObserver.observe(s));

/* =========================================================
   3. FOOTER YEAR
   ========================================================= */
const yearEl = document.getElementById('footer-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* =========================================================
   4. CV CHECK
   ========================================================= */
async function checkCV() {
    const cvBtn = document.getElementById('cv-download-btn');
    const cvNote = document.getElementById('cv-note');
    const navCvLink = document.getElementById('nav-cv-link');

    try {
        const res = await fetch('cv.pdf', { method: 'HEAD' });
        if (!res.ok) throw new Error('not found');
    } catch {
        if (cvBtn) {
            cvBtn.setAttribute('disabled', 'true');
            cvBtn.removeAttribute('href');
            cvBtn.style.opacity = '0.5';
            cvBtn.style.cursor = 'not-allowed';
            cvBtn.style.pointerEvents = 'none';
        }
        if (navCvLink) {
            navCvLink.style.opacity = '0.45';
            navCvLink.style.pointerEvents = 'none';
            navCvLink.removeAttribute('href');
        }
        if (cvNote) cvNote.classList.remove('hidden');
    }
}
checkCV();

/* =========================================================
   5. GITHUB PROJECTS
   ========================================================= */

const LANG_COLORS = {
    JavaScript: '#f7df1e', TypeScript: '#3178c6', Python: '#3572a5',
    Java: '#b07219', C: '#555555', 'C++': '#f34b7d', 'C#': '#178600',
    Go: '#00add8', Rust: '#dea584', Ruby: '#701516', PHP: '#4f5d95',
    Swift: '#f05138', Kotlin: '#a97bff', HTML: '#e34c26', CSS: '#563d7c',
    Shell: '#89e051', Default: '#6b7280',
};

function getLangColor(lang) {
    return LANG_COLORS[lang] || LANG_COLORS.Default;
}

function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);
    if (years > 0) return `${years} yıl önce`;
    if (months > 0) return `${months} ay önce`;
    if (days > 1) return `${days} gün önce`;
    if (days === 1) return 'Dün';
    return 'Bugün';
}

function buildProjectCard(repo) {
    const lang = repo.language || null;
    const langColor = lang ? getLangColor(lang) : null;
    const stars = repo.stargazers_count || 0;
    const updated = repo.pushed_at ? timeAgo(repo.pushed_at) : '—';
    const desc = repo.description || 'Açıklama bulunmuyor.';

    return `
    <article class="project-card reveal" role="listitem" aria-label="${repo.name} projesi">
      <div class="project-card-header">
        <div class="project-icon" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
          </svg>
        </div>
        <h3 class="project-name">${escapeHtml(repo.name)}</h3>
      </div>

      <p class="project-desc">${escapeHtml(desc)}</p>

      <div class="project-meta">
        ${lang ? `<span class="project-meta-item">
          <span class="lang-dot" style="background:${langColor}" aria-hidden="true"></span>
          ${escapeHtml(lang)}
        </span>` : ''}
        <span class="project-meta-item" aria-label="${stars} yıldız">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .587l3.668 7.431L24 9.306l-6 5.842 1.416 8.26L12 18.896l-7.416 4.512L6 15.148 0 9.306l8.332-1.288z"/></svg>
          ${stars}
        </span>
        <span class="project-meta-item">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          ${updated}
        </span>
      </div>

      <div class="project-footer">
        <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer"
           class="project-link" aria-label="${repo.name} reposunu GitHub'da aç">
          Repo
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
            <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
          </svg>
        </a>
      </div>
    </article>
  `;
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// The 5 repos to display (order preserved)
const FEATURED_REPOS = [
    'git-brief',
    'process_management',
    'doctor-on-my-phone',
    'pocketdoctor-gateaway',
    'chrome_spotlight',
];

// Fallback if API fails
const FALLBACK_PROJECTS = [
    {
        name: 'git-brief',
        description: 'GitHub repolarını LLM ile analiz edip Markdown özet üreten Python CLI aracı.',
        language: 'Python', stargazers_count: 0,
        pushed_at: '2024-10-15T00:00:00Z',
        html_url: 'https://github.com/efeduzcay/git-brief', fork: false,
    },
    {
        name: 'process_management',
        description: 'İşletim sistemi süreç yönetimi simülasyonu.',
        language: 'C', stargazers_count: 0,
        pushed_at: '2024-09-01T00:00:00Z',
        html_url: 'https://github.com/efeduzcay/process_management', fork: false,
    },
    {
        name: 'doctor-on-my-phone',
        description: 'Ses girişi ve en yakın hastane bulucu özelliklerine sahip sağlık asistanı uygulaması.',
        language: 'JavaScript', stargazers_count: 0,
        pushed_at: '2024-09-20T00:00:00Z',
        html_url: 'https://github.com/efeduzcay/doctor-on-my-phone', fork: false,
    },
    {
        name: 'pocketdoctor-gateaway',
        description: 'PocketDoctor sistemi için dinamik yönlendirme ve Google Gemini API entegrasyonuna sahip Node.js API Gateway projesi.',
        language: 'JavaScript', stargazers_count: 0,
        pushed_at: '2026-03-04T00:00:00Z',
        html_url: 'https://github.com/efeduzcay/pocketdoctor-gateaway', fork: false,
    },
    {
        name: 'chrome_spotlight',
        description: 'Chrome için Spotlight tarzı hızlı komut ve arama aracı.',
        language: 'JavaScript', stargazers_count: 0,
        pushed_at: '2024-08-10T00:00:00Z',
        html_url: 'https://github.com/efeduzcay/chrome_spotlight', fork: false,
    },
];

function renderSkeletons(count = 4) {
    const grid = document.getElementById('project-grid');
    if (!grid) return;
    grid.innerHTML = Array.from({ length: count }, () => `
    <div class="skeleton" aria-hidden="true">
      <div class="skel-line skel-title"></div>
      <div class="skel-line skel-desc1"></div>
      <div class="skel-line skel-desc2"></div>
      <div class="skel-line skel-meta"></div>
    </div>
  `).join('');
}

function renderProjects(repos) {
    const grid = document.getElementById('project-grid');
    if (!grid) return;

    if (!repos.length) {
        grid.innerHTML = `<p class="section-subtitle" style="grid-column:1/-1">Proje bulunamadı.</p>`;
        grid.setAttribute('aria-busy', 'false');
        return;
    }

    grid.innerHTML = repos.map(buildProjectCard).join('');
    grid.setAttribute('aria-busy', 'false');

    requestAnimationFrame(() => {
        grid.querySelectorAll('.reveal').forEach((el, i) => {
            setTimeout(() => el.classList.add('visible'), i * 60);
        });
    });
}

async function loadProjects() {
    const grid = document.getElementById('project-grid');
    if (!grid) return;

    renderSkeletons(FEATURED_REPOS.length);

    try {
        const results = await Promise.allSettled(
            FEATURED_REPOS.map(name =>
                fetch(`https://api.github.com/repos/efeduzcay/${name}`, {
                    headers: { Accept: 'application/vnd.github.v3+json' },
                }).then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
            )
        );

        const repos = results
            .filter(r => r.status === 'fulfilled')
            .map(r => r.value);

        if (!repos.length) throw new Error('all failed');
        renderProjects(repos);
    } catch (err) {
        console.warn('[Portfolio] GitHub API failed, using fallback:', err.message);
        renderProjects(FALLBACK_PROJECTS);
    }
}

loadProjects();

/* =========================================================
   6. SCROLL REVEAL
   ========================================================= */
const revealObserver = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.12 }
);

document.querySelectorAll('.timeline-item, .skill-category, .meta-list, .about-text p').forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
});

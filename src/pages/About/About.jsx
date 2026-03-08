import { useState, useEffect, useRef } from "react";
import "./About.css";
import { loadSession, clearSession } from "../../sheetsApi";

/* ============================================================
   ICONS
   ============================================================ */
const SunIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);
const MoonIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
  </svg>
);
const MonitorIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <rect x="2" y="3" width="20" height="14" rx="2"/>
    <line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
  </svg>
);
const ChevronDown = () => (
  <svg className="chevron" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
    <polyline points="2,3 5,7 8,3"/>
  </svg>
);
const GithubIcon    = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>;
const LinkedinIcon  = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;
const InstagramIcon = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>;
const YoutubeIcon   = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>;

const SOCIALS = [
  { icon:<GithubIcon />,    href:"https://github.com",    label:"GitHub" },
  { icon:<LinkedinIcon />,  href:"https://linkedin.com",  label:"LinkedIn" },
  { icon:<InstagramIcon />, href:"https://instagram.com", label:"Instagram" },
  { icon:<YoutubeIcon />,   href:"https://youtube.com",   label:"YouTube" },
];

const MEGA_ITEMS = {
  cube: [
    { icon:"🧩", label:"Cube Solver",      locked:false, href:"/cube"  },
    { icon:"⏱️", label:"Speed Timer",       locked:false, href:"/cube"  },
    { icon:"📖", label:"Algorithm Library", locked:true,  href:"/cube"  },
  ],
  code: [
    { icon:"💻", label:"Code Playground",  locked:false, href:"/code"  },
    { icon:"🌐", label:"Web Dev Track",    locked:true,  href:"/code"  },
    { icon:"⚛️", label:"React Course",     locked:true,  href:"/code"  },
  ],
  chess: [
    { icon:"♟️", label:"Chess Board",      locked:false, href:"/chess" },
    { icon:"🧩", label:"Puzzle Trainer",   locked:false, href:"/chess" },
    { icon:"📚", label:"Opening Explorer", locked:true,  href:"/chess" },
  ],
};

/* ============================================================
   TEAM DATA
   ============================================================ */
const TEAM = [
  {
    name:    "Aadhidev",
    initial: "A",
    role:    "Co-Founder & Lead Dev",
    accent:  "accent-cube",
    color:   "#FF5733",
    bio:     "The architect behind Cuchco. Passionate about speedcubing and building tools that make learning intuitive and fun.",
    skills:  ["React","Algorithm Design","UI/UX","Speedcubing"],
    emoji:   "🧩",
  },
  {
    name:    "Steve",
    initial: "S",
    role:    "Co-Founder & Backend",
    accent:  "accent-code",
    color:   "#00C4D4",
    bio:     "Full-stack developer with a love for clean code. Keeps the backend running smooth and the data flowing fast.",
    skills:  ["Node.js","Google Sheets API","Systems","Chess"],
    emoji:   "💻",
  },
  {
    name:    "Abel",
    initial: "A",
    role:    "Co-Founder & Design",
    accent:  "accent-chess",
    color:   "#B882FF",
    bio:     "Design thinker and chess strategist. Brings the visual language and user experience that makes Cuchco feel alive.",
    skills:  ["Design","CSS","Branding","Chess Strategy"],
    emoji:   "♟️",
  },
];

/* ============================================================
   ABOUT PAGE
   ============================================================ */
export default function About() {
  const [user,       setUser]       = useState(() => loadSession());
  const [dropdown,   setDropdown]   = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
//   const [authOpen,   setAuthOpen]   = useState(false);
  const navRef = useRef(null);

  // ── Theme ──────────────────────────────────────────────
  const [themeMode, setThemeMode] = useState(() => {
    try { return localStorage.getItem("cuchco-theme") || "system"; } catch { return "system"; }
  });
  const [sysDark, setSysDark] = useState(
    () => typeof window !== "undefined" ? window.matchMedia("(prefers-color-scheme: dark)").matches : true
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const fn = e => setSysDark(e.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);
  useEffect(() => {
    try { localStorage.setItem("cuchco-theme", themeMode); } catch {}
  }, [themeMode]);
  const isDark = themeMode === "dark" || (themeMode === "system" && sysDark);
  useEffect(() => { document.documentElement.classList.toggle("light", !isDark); }, [isDark]);

  // ── Close dropdown outside click ──────────────────────
  useEffect(() => {
    const fn = e => { if (navRef.current && !navRef.current.contains(e.target)) setDropdown(null); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  useEffect(() => {
    const fn = e => { if (e.key === "Escape") { setDropdown(null); setMobileOpen(false); } };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  const handleLogout = () => { clearSession(); setUser(null); };

  return (
    <div className="about-page">

      {/* ══════════════════════════════════════════
          NAVBAR
      ══════════════════════════════════════════ */}
      <nav className="nav" ref={navRef}>
        <a href="/" className="nav-logo" style={{ textDecoration:"none" }}>CUCHCO</a>

        <div className="nav-center">
          <div className="nav-item">
            <button className="nav-link"
              onMouseEnter={() => setDropdown("learn")}
              onClick={() => setDropdown(dropdown === "learn" ? null : "learn")}>
              Learn <ChevronDown />
            </button>
          </div>
          <div className="nav-item">
            <a href="/#lessons" className="nav-link">Lessons</a>
          </div>
          <div className="nav-item">
            <a href="/community" className="nav-link">Community</a>
          </div>
          <div className="nav-item">
            <span className="nav-link" style={{ color:"var(--yellow)", cursor:"default" }}>About</span>
          </div>
        </div>

        <div className="nav-right">
          <div className="theme-toggle">
            <button className={`t-btn${themeMode==="light"  ? " on":""}`} onClick={() => setThemeMode("light")}><SunIcon/></button>
            <button className={`t-btn${themeMode==="system" ? " on":""}`} onClick={() => setThemeMode("system")}><MonitorIcon/></button>
            <button className={`t-btn${themeMode==="dark"   ? " on":""}`} onClick={() => setThemeMode("dark")}><MoonIcon/></button>
          </div>
          {user ? (
            <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
              <div className="user-chip" style={{ cursor:"pointer", display:"flex", alignItems:"center", gap:"8px", fontFamily:"Space Mono,monospace", fontSize:"0.68rem", color:"var(--text2)", padding:"6px 14px", border:"1px solid var(--border2)", borderRadius:"2px", background:"var(--surface2)" }}>
                <div className="avatar xs" style={{ width:24, height:24, background:"var(--yellow)", color:"#0A0A0A", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Bebas Neue,sans-serif", fontSize:"0.75rem", flexShrink:0 }}>
                  {user.avatarUrl
                    ? <img src={user.avatarUrl} alt="" style={{width:"100%",height:"100%",borderRadius:"50%",objectFit:"cover"}}/>
                    : user.username[0].toUpperCase()
                  }
                </div>
                {user.username}
              </div>
              <button className="btn-login" onClick={handleLogout}>Log Out</button>
            </div>
          ) : (
            <>
              <button className="btn-login"  onClick={() => { window.location.href="/"; }}>Log In</button>
              <button className="btn-signup" onClick={() => { window.location.href="/"; }}>Sign Up</button>
            </>
          )}
          <button className="hamburger" onClick={() => setMobileOpen(o => !o)} aria-label="Menu">
            <span/><span/><span/>
          </button>
        </div>
      </nav>

      {/* Mega dropdown */}
      <div className={`mega-dropdown${dropdown === "learn" ? " open" : ""}`} onMouseLeave={() => setDropdown(null)}>
        <div className="mega-inner">
          <div className="mega-left">
            <h2>MASTER<br/>YOUR MIND</h2>
            <p>Explore Cubing, Coding, and Chess.</p>
          </div>
          <div className="mega-cols">
            {["cube","code","chess"].map(cat => (
              <div className="mega-col" key={cat}>
                <div className={`mega-col-head ${cat}`}>
                  <span>{cat==="cube"?"🧩":cat==="code"?"💻":"♟️"}</span>
                  <h3>{cat.toUpperCase()}</h3>
                </div>
                <div className="mega-links">
                  {MEGA_ITEMS[cat].map(item => (
                    <a key={item.label}
                      href={item.locked && !user ? undefined : item.href}
                      className="mega-link"
                      onClick={() => setDropdown(null)}
                    >
                      <span className="mega-link-icon">{item.icon}</span>
                      <div className="mega-link-text"><strong>{item.label}</strong></div>
                      {item.locked && !user && <span className="mega-lock">🔒</span>}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`mobile-menu${mobileOpen ? " open" : ""}`}>
        <div className="mobile-menu-section">
          <h4>Navigate</h4>
          <a href="/"          className="mobile-menu-link">🏠 Home</a>
          <a href="/#lessons"  className="mobile-menu-link">📚 Lessons</a>
          <a href="/community" className="mobile-menu-link">💬 Community</a>
          <a href="/about"     className="mobile-menu-link">ℹ️ About</a>
        </div>
        <div className="mobile-auth-row">
          {user
            ? <button className="btn-signup" style={{flex:1}} onClick={handleLogout}>Log Out</button>
            : <button className="btn-signup" style={{flex:1}} onClick={() => window.location.href="/"}>Log In / Sign Up</button>
          }
        </div>
      </div>

      {/* ══════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════ */}
      <section className="about-hero" id="about">
        <div className="about-hero-bg"/>
        <div className="about-orb about-orb-1"/>
        <div className="about-orb about-orb-2"/>
        <div className="about-orb about-orb-3"/>

        <div className="about-hero-content">
          <div className="about-eyebrow">
            <span className="about-eyebrow-dot"/>
            Our Story
          </div>

          <h1 className="about-hero-title">
            WHO<br/><span className="yellow">WE ARE</span>
          </h1>

          <p className="about-hero-para">
            Three friends. Three obsessions. <strong>One platform.</strong><br/>
            We built Cuchco because we believe <strong>learning should feel like play</strong> —
            whether you're solving a cube, writing your first loop, or plotting a checkmate.
            No fluff. Just sharp minds and sharper tools.
          </p>
        </div>

        <div className="about-scroll">
          <p>Scroll</p>
          <div className="about-scroll-line"/>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          STATS STRIP
      ══════════════════════════════════════════ */}
      <div className="about-stats">
        <div className="about-stat">
          <div className="about-stat-num">2,400+</div>
          <div className="about-stat-label">Active Learners</div>
        </div>
        <div className="about-stat">
          <div className="about-stat-num">180+</div>
          <div className="about-stat-label">Lessons Created</div>
        </div>
        <div className="about-stat">
          <div className="about-stat-num">3</div>
          <div className="about-stat-label">Disciplines Mastered</div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          MISSION SECTION
      ══════════════════════════════════════════ */}
      <section className="about-mission">
        <div className="about-mission-left">
          <div className="section-label">Our Mission</div>
          <h2>BUILT TO MAKE YOU SHARPER.</h2>
        </div>
        <div className="about-mission-right">
          <p>
            Most learning platforms are built for the average learner. We built Cuchco for
            the <strong>curious ones</strong> — people who pick up a Rubik's Cube at 2am,
            debug code on weekends, and study chess openings just for fun.
          </p>
          <p>
            We combine <strong>interactive tools</strong>, structured lessons, and a real community
            into one place. No paywalls for the basics. No bloat. Just the stuff that actually
            makes you better.
          </p>
          <div className="about-badges">
            <div className="about-badge"><span>🧩</span> Cubing</div>
            <div className="about-badge"><span>💻</span> Coding</div>
            <div className="about-badge"><span>♟️</span> Chess</div>
            <div className="about-badge"><span>🆓</span> 100% Free to Start</div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TEAM SECTION
      ══════════════════════════════════════════ */}
      <section className="about-team">
        <div className="about-team-header">
          <div className="section-label">The Builders</div>
          <h2>MEET THE TEAM</h2>
          <p>Three co-founders, one shared obsession with making learning feel extraordinary.</p>
        </div>

        <div className="team-grid">
          {TEAM.map((member, i) => (
            <div key={member.name} className={`team-card ${member.accent}`}>

              {/* Avatar circle */}
              <div className="team-avatar-wrap">
                <div className="team-avatar-ring"/>
                <div className="team-avatar">
                  {member.initial}
                </div>
                <div className="team-num">{i + 1}</div>
              </div>

              {/* Info */}
              <div className="team-name">{member.name.toUpperCase()}</div>
              <div className="team-role">{member.emoji} {member.role}</div>
              <p className="team-bio">{member.bio}</p>

              {/* Skill tags */}
              <div className="team-skills">
                {member.skills.map(s => (
                  <span key={s} className="team-skill">{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          VALUES SECTION
      ══════════════════════════════════════════ */}
      <section className="about-values">
        <div className="about-values-header">
          <div className="section-label">What Drives Us</div>
          <h2>OUR VALUES</h2>
        </div>
        <div className="values-grid">
          {[
            { icon:"🎯", title:"DEPTH OVER FLUFF",   desc:"We only teach things that actually make you better. Every lesson, tool, and feature is designed to create real, lasting skill." },
            { icon:"🔓", title:"FREE BY DEFAULT",     desc:"The best tools and core lessons are free. We believe access to quality education shouldn't depend on your wallet." },
            { icon:"🧠", title:"LEARN BY DOING",      desc:"No passive content here. Every discipline has interactive tools — solve, code, play — because doing is the fastest way to learn." },
            { icon:"🤝", title:"COMMUNITY FIRST",     desc:"Learning alone is hard. We built a community where you can share progress, ask questions, and celebrate wins together." },
            { icon:"⚡", title:"SHIP FAST, IMPROVE",  desc:"We're builders, not perfectionists. We ship tools that work, listen to feedback, and improve constantly." },
            { icon:"❤️", title:"MADE WITH LOVE",      desc:"Every pixel, every algorithm, every lesson was crafted by three people who genuinely love what they do. That energy shows." },
          ].map(v => (
            <div className="value-card" key={v.title}>
              <span className="value-icon">{v.icon}</span>
              <div className="value-title">{v.title}</div>
              <p className="value-desc">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════════ */}
      <section className="about-cta">
        <h2>READY TO LEVEL UP?</h2>
        <p>Join thousands of learners already sharpening their minds on Cuchco. It's free.</p>
        <button className="btn-dark" onClick={() => window.location.href="/"}>
          Start Learning Free →
        </button>
      </section>

      {/* ══════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════ */}
      <footer>
        <div className="footer-brand">
          <div className="nav-logo">CUCHCO</div>
          <p>Your brain deserves a workout. Master Cubing, Coding, and Chess.</p>
          <div className="footer-social">
            {SOCIALS.map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="social-icon" title={s.label}>{s.icon}</a>
            ))}
          </div>
        </div>
        <div className="footer-links">
          <div className="footer-col">
            <h4>Navigate</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/#lessons">Lessons</a></li>
              <li><a href="/community">Community</a></li>
              <li><a href="/about">About</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Platform</h4>
            <ul>
              <li><a href="/cube">Cube Solver</a></li>
              <li><a href="/code">Code Playground</a></li>
              <li><a href="/chess">Chess Board</a></li>
              <li><a href="/cube">Speed Timer</a></li>
            </ul>
          </div>
        </div>
      </footer>
      <div className="footer-bottom">
        <p>© 2025 Cuchco. Built with ❤️ by Aadhidev, Steve & Abel</p>
        <p>React + CSS3 · Google Sheets Backend</p>
      </div>

    </div>
  );
}
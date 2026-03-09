import { useState, useEffect, useRef } from "react";
import "./Home.css";
import {
  apiRegister,
  apiLogin,
  saveSession,
  loadSession,
  clearSession,
} from "../../sheetsApi";

/* ============================================================
   SVG ICONS
   ============================================================ */
const GithubIcon    = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>;
const LinkedinIcon  = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;
const InstagramIcon = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>;
const YoutubeIcon   = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>;

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

/* ============================================================
   DATA
   ============================================================ */
const LESSONS = [
  { id:1, cat:"cube",  level:"Beginner",     title:"Understanding the Rubik's Cube Anatomy",  desc:"Learn the faces, layers, moves notation, and how a cube works before you solve it.",            time:"15 min", steps:["Identify the 6 faces: U, D, F, B, L, R","Learn basic notation: R, R', U, U', F, F'","Understand center, edge, and corner pieces","Practice quarter and half turns"] },
  { id:2, cat:"code",  level:"Beginner",     title:"HTML & CSS Foundations",                   desc:"The building blocks of every website — master HTML structure and CSS styling from scratch.",    time:"30 min", steps:["Write your first HTML document","Understand tags, attributes, and nesting","Style elements with CSS selectors","Build a simple webpage layout"] },
  { id:3, cat:"chess", level:"Beginner",     title:"How the Pieces Move",                      desc:"From pawns to kings — learn movement rules for all 6 chess pieces and basic check concepts.",  time:"20 min", steps:["Learn pawn movement and captures","Master knight L-shapes and bishop diagonals","Understand rook, queen, and king rules","Learn check, checkmate, and stalemate"] },
  { id:4, cat:"cube",  level:"Intermediate", title:"CFOP Method – Cross Layer",                desc:"Start the world's most popular speedcubing method by building a perfect cross on the bottom.", time:"25 min", steps:["Plan the cross before executing","Match edge pieces to center colors","Use intuitive cross solving techniques","Aim for cross under 8 seconds"] },
  { id:5, cat:"code",  level:"Intermediate", title:"JavaScript & DOM Manipulation",            desc:"Bring webpages to life — learn JS fundamentals and control your HTML dynamically.",            time:"45 min", steps:["Variables, functions, and conditionals","Select and modify DOM elements","Handle events: clicks, inputs, keyboard","Build an interactive counter app"] },
  { id:6, cat:"chess", level:"Intermediate", title:"Opening Principles & Strategy",            desc:"Control the center, develop pieces fast, and castle early — the 3 golden opening rules.",     time:"35 min", steps:["Control d4, d5, e4, e5 center squares","Develop knights before bishops","Castle to protect your king","Study common openings: Italian, London"] },
  { id:7, cat:"cube",  level:"Advanced",     title:"OLL Algorithms – Last Layer",              desc:"Orient all last layer pieces correctly with the 57 OLL algorithms. Pattern recognition is key.",time:"60 min", steps:["Understand OLL dot, line, L, and cross cases","Learn the 2-look OLL shortcut first","Memorize full OLL set gradually","Drill recognition speed under 1 second"] },
  { id:8, cat:"code",  level:"Advanced",     title:"React Hooks & State Management",           desc:"Level up your React — master useState, useEffect, useContext, and build real component logic.", time:"60 min", steps:["useState for local state management","useEffect for side effects and lifecycle","useContext for prop-drilling solutions","Build a full mini app with hooks"] },
  { id:9, cat:"chess", level:"Advanced",     title:"Endgame Mastery – King & Pawn",            desc:"Games are won or lost in the endgame. Master king activation, opposition, and pawn promotion.", time:"40 min", steps:["Activate your king in the endgame","Understand the concept of opposition","Calculate pawn races to promotion","Learn key Lucena and Philidor positions"] },
];

const MEGA_ITEMS = {
  cube: [
    { icon:"🧩", label:"Cube Solver",      desc:"Interactive 3D solver & visualizer",  locked:false, href:"/cube"  },
    { icon:"⏱️", label:"Speed Timer",       desc:"WCA-style solve timer with stats",    locked:false, href:"/cube"  },
    { icon:"📖", label:"Algorithm Library", desc:"OLL, PLL, F2L algorithm reference",   locked:true,  href:"/cube"  },
    { icon:"🏆", label:"Beginner Course",   desc:"Layer-by-layer full video course",    locked:true,  href:"/cube"  },
    { icon:"🚀", label:"CFOP Full Course",  desc:"Advanced speedcubing method",         locked:true,  href:"/cube"  },
  ],
  code: [
    { icon:"💻", label:"Code Playground",  desc:"Live HTML/CSS/JS editor in browser",  locked:false, href:"/code"  },
    { icon:"🌐", label:"Web Dev Track",    desc:"HTML → CSS → JS → React roadmap",     locked:true,  href:"/code"  },
    { icon:"🐍", label:"Python Basics",    desc:"Beginner-friendly Python course",     locked:true,  href:"/code"  },
    { icon:"⚛️", label:"React Course",     desc:"Component-based UI development",      locked:true,  href:"/code"  },
    { icon:"🛠️", label:"Project Builder",  desc:"Build real apps step by step",        locked:true,  href:"/code"  },
  ],
  chess: [
    { icon:"♟️", label:"Chess Board",      desc:"Play & analyze games interactively",  locked:false, href:"/chess" },
    { icon:"🧩", label:"Puzzle Trainer",   desc:"Daily tactics & pattern recognition", locked:false, href:"/chess" },
    { icon:"📚", label:"Opening Explorer", desc:"Browse and study chess openings",     locked:true,  href:"/chess" },
    { icon:"📊", label:"Game Analysis",    desc:"Review your games with engine hints", locked:true,  href:"/chess" },
    { icon:"🎓", label:"Endgame Studies",  desc:"Master king & pawn endgame theory",   locked:true,  href:"/chess" },
  ],
};

const SOCIALS = [
  { icon:<GithubIcon />,    href:"https://github.com",    label:"GitHub" },
  { icon:<LinkedinIcon />,  href:"https://linkedin.com",  label:"LinkedIn" },
  { icon:<InstagramIcon />, href:"https://instagram.com", label:"Instagram" },
  { icon:<YoutubeIcon />,   href:"https://youtube.com",   label:"YouTube" },
];

const catLabel = (c) => c==="cube"?"🧩 Cubing":c==="code"?"💻 Coding":"♟️ Chess";
const pad2     = (n) => String(n+1).padStart(2,"0");

/* ============================================================
   AUTH MODAL COMPONENT  ← now hits real Google Sheets
   ============================================================ */
function AuthModal({ defaultTab, onClose, onLogin }) {
  const [tab,      setTab]      = useState(defaultTab || "login");
  const [username, setUsername] = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const handle = async () => {
    // Basic validation
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields."); return;
    }
    if (tab === "signup" && !username.trim()) {
      setError("Please enter a username."); return;
    }

    setLoading(true);
    setError("");

    try {
      let res;
      if (tab === "login") {
        res = await apiLogin(email.trim(), password.trim());
      } else {
        res = await apiRegister(username.trim(), email.trim(), password.trim());
      }
      // Save session so both pages share login state
      saveSession(res.user);
      onLogin(res.user);
    } catch (err) {
      setError(err.message || "Something went wrong. Try again.");
    }

    setLoading(false);
  };

  const switchTab = (t) => { setTab(t); setError(""); };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-box" onClick={e => e.stopPropagation()}>
        <button className="auth-close" onClick={onClose}>✕</button>
        <div className="auth-logo">CUCHCO</div>
        <p className="auth-subtitle">Your brain's favorite training ground.</p>

        {/* Tabs */}
        <div className="auth-tabs">
          <button className={`auth-tab${tab==="login"  ? " active" : ""}`} onClick={() => switchTab("login")}>Log In</button>
          <button className={`auth-tab${tab==="signup" ? " active" : ""}`} onClick={() => switchTab("signup")}>Sign Up</button>
        </div>

        {/* Username — signup only */}
        {tab === "signup" && (
          <div className="auth-field">
            <label>Username</label>
            <input
              type="text"
              placeholder="e.g. speedcuber99"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoFocus
            />
          </div>
        )}

        {/* Email */}
        <div className="auth-field">
          <label>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoFocus={tab === "login"}
          />
        </div>

        {/* Password */}
        <div className="auth-field">
          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handle()}
          />
        </div>

        {/* Error message */}
        {error && (
          <p style={{ color:"#ff4444", fontSize:"0.8rem", margin:"6px 0 2px" }}>
            ⚠ {error}
          </p>
        )}

        {/* Submit */}
        <button className="auth-submit" onClick={handle} disabled={loading}>
          {loading
            ? "Please wait…"
            : tab === "login" ? "Log In →" : "Create Account →"
          }
        </button>

        {/* Switch tab hint */}
        <p className="auth-divider">
          {tab === "login" ? (
            <>No account?{" "}
              <span style={{color:"var(--yellow)",cursor:"pointer"}} onClick={() => switchTab("signup")}>
                Sign up free
              </span>
            </>
          ) : (
            <>Already have one?{" "}
              <span style={{color:"var(--yellow)",cursor:"pointer"}} onClick={() => switchTab("login")}>
                Log in
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   HOME PAGE COMPONENT
   ============================================================ */
export default function Home() {
  const [filter,      setFilter]      = useState("all");
  const [lessonModal, setLessonModal] = useState(null);
  const [dropdown,    setDropdown]    = useState(null);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [authOpen,    setAuthOpen]    = useState(false);
  const [authTab,     setAuthTab]     = useState("login");

  // ── Load user from localStorage so login persists across pages ──
  const [user, setUser] = useState(() => loadSession());

  // ── Theme ──────────────────────────────────────────────────────
  const [themeMode, setThemeMode] = useState(() => {
    try { return localStorage.getItem("cuchco-theme") || "system"; } catch { return "system"; }
  });
  const [sysDark, setSysDark] = useState(
    () => typeof window !== "undefined"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : true
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const fn = (e) => setSysDark(e.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  useEffect(() => {
    try { localStorage.setItem("cuchco-theme", themeMode); } catch {}
  }, [themeMode]);

  const isDark = themeMode === "dark" || (themeMode === "system" && sysDark);
  useEffect(() => {
    document.documentElement.classList.toggle("light", !isDark);
  }, [isDark]);

  // ── Close dropdown on outside click ───────────────────────────
  const navRef = useRef(null);
  useEffect(() => {
    const fn = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setDropdown(null);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  // ── Escape closes everything ───────────────────────────────────
  useEffect(() => {
    const fn = (e) => {
      if (e.key === "Escape") {
        setDropdown(null); setAuthOpen(false);
        setLessonModal(null); setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  const filtered = filter === "all" ? LESSONS : LESSONS.filter(l => l.cat === filter);

  // ── Auth handlers ──────────────────────────────────────────────
  const handleLogin  = (u) => { setUser(u); setAuthOpen(false); };
  const handleLogout = ()  => { clearSession(); setUser(null); };

  // ── Gate check ─────────────────────────────────────────────────
  const requireAuth = (cb) => {
    if (!user) { setAuthTab("login"); setAuthOpen(true); }
    else cb();
  };

  /* ── RENDER ─────────────────────────────────────────────────── */
  return (
    <>
      {/* ══════════ NAVBAR ══════════ */}
      <nav className="nav" ref={navRef}>
        <div className="nav-logo">CUCHCO</div>

        <div className="nav-center">
          <div className="nav-item" onMouseLeave={() => setDropdown(null)}>
            <a href="/learn" className="nav-link"
              onMouseEnter={() => setDropdown("learn")}
              onClick={() => setDropdown(null)}
            >Learn <ChevronDown /></a>
          </div>
          <div className="nav-item">
            <a href="/#lessons" className="nav-link">Lessons</a>
          </div>
          <div className="nav-item">
            <a href="/community" className="nav-link">Community</a>
          </div>
          <div className="nav-item">
            <a href="/about" className="nav-link">About</a>
          </div>
        </div>

        {/* Right side */}
        <div className="nav-right">
          {/* Theme toggle */}
          <div className="theme-toggle">
            <button className={`t-btn${themeMode==="light"  ? " on" : ""}`} onClick={() => setThemeMode("light")}  title="Light"><SunIcon/></button>
            <button className={`t-btn${themeMode==="system" ? " on" : ""}`} onClick={() => setThemeMode("system")} title="System"><MonitorIcon/></button>
            <button className={`t-btn${themeMode==="dark"   ? " on" : ""}`} onClick={() => setThemeMode("dark")}   title="Dark"><MoonIcon/></button>
          </div>

          {/* Show user chip or login/signup buttons */}
          {user ? (
            <div className="user-chip" onClick={handleLogout} title="Click to log out">
              <div className="user-avatar">
                {user.avatarUrl
                  ? <img src={user.avatarUrl} alt="" style={{width:"100%",height:"100%",borderRadius:"50%",objectFit:"cover"}}/>
                  : user.username[0].toUpperCase()
                }
              </div>
              {user.username}
            </div>
          ) : (
            <>
              <button className="btn-login"  onClick={() => { setAuthTab("login");  setAuthOpen(true); }}>Log In</button>
              <button className="btn-signup" onClick={() => { setAuthTab("signup"); setAuthOpen(true); }}>Sign Up</button>
            </>
          )}

          {/* Hamburger for mobile */}
          <button className="hamburger" onClick={() => setMobileOpen(o => !o)} aria-label="Menu">
            <span/><span/><span/>
          </button>
        </div>
      </nav>

      {/* ══════════ MEGA DROPDOWN ══════════ */}
      <div
        className={`mega-dropdown${dropdown === "learn" ? " open" : ""}`}
        onMouseLeave={() => setDropdown(null)}
        onMouseEnter={() => setDropdown("learn")}
      >
        <div className="mega-inner-slim">
          {["cube","code","chess"].map(cat => (
            <div className="mega-col" key={cat}>
              <div className={`mega-col-head ${cat}`}>
                <span>{cat==="cube"?"🧩":cat==="code"?"💻":"♟️"}</span>
                <h3>{cat.toUpperCase()}</h3>
              </div>
              <div className="mega-links">
                {MEGA_ITEMS[cat].slice(0,3).map(item => (
                  <a
                    key={item.label}
                    href={item.locked && !user ? undefined : item.href}
                    className="mega-link"
                    onClick={(e) => {
                      setDropdown(null);
                      if (item.locked && !user) { e.preventDefault(); setAuthTab("login"); setAuthOpen(true); }
                    }}
                  >
                    <span className="mega-link-icon">{item.icon}</span>
                    <div className="mega-link-text">
                      <strong>{item.label}</strong>
                      <span>{item.desc}</span>
                    </div>
                    {item.locked && !user && <span className="mega-lock">🔒</span>}
                  </a>
                ))}
                <a href="/learn" className="mega-see-all" onClick={() => setDropdown(null)}>See all →</a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════ MOBILE MENU ══════════ */}
      <div className={`mobile-menu${mobileOpen ? " open" : ""}`}>

        {/* Nav links */}
        <a href="/learn"      className="mobile-menu-link" onClick={() => setMobileOpen(false)}>Learn</a>
        <a href="/#lessons"   className="mobile-menu-link" onClick={() => setMobileOpen(false)}>Lessons</a>
        <a href="/community"  className="mobile-menu-link" onClick={() => setMobileOpen(false)}>Community</a>
        <a href="/about"      className="mobile-menu-link" onClick={() => setMobileOpen(false)}>About</a>

        {/* Theme toggle */}
        <div className="mobile-theme-row">
          <span className="mobile-theme-label">THEME</span>
          <div className="theme-toggle">
            <button className={`t-btn${themeMode==="light"  ? " on" : ""}`} onClick={() => setThemeMode("light")}><SunIcon/></button>
            <button className={`t-btn${themeMode==="system" ? " on" : ""}`} onClick={() => setThemeMode("system")}><MonitorIcon/></button>
            <button className={`t-btn${themeMode==="dark"   ? " on" : ""}`} onClick={() => setThemeMode("dark")}><MoonIcon/></button>
          </div>
        </div>

        {/* Auth */}
        <div className="mobile-auth-row">
          {user ? (
            <>
              <span className="mobile-username">👤 {user.username}</span>
              <button className="btn-login" onClick={handleLogout}>Log Out</button>
            </>
          ) : (
            <>
              <button className="btn-login"  onClick={() => { setMobileOpen(false); setAuthTab("login");  setAuthOpen(true); }}>Log In</button>
              <button className="btn-signup" onClick={() => { setMobileOpen(false); setAuthTab("signup"); setAuthOpen(true); }}>Sign Up</button>
            </>
          )}
        </div>
      </div>

      {/* ══════════ HERO ══════════ */}
      <div className="hero" id="home">
        <div className="hero-bg"/>
        <div className="hero-orb hero-orb-1"/>
        <div className="hero-orb hero-orb-2"/>
        <div className="hero-orb hero-orb-3"/>

        <div className="hero-content">
          <div className="hero-tag">
            <span className="hero-tag-dot"/>
            Level Up Your Mind
          </div>
          <h1 className="hero-title">
            TRAIN YOUR<span className="highlight">BRAIN DAILY</span>
          </h1>
          <p className="hero-sub">
            Cuchco is your all-in-one platform for mastering Cubing, Coding, and Chess —
            three disciplines that sharpen logic, creativity, and focus.
          </p>
          <div className="hero-cta-row">
            <button className="btn-primary" onClick={() => { setAuthTab("signup"); setAuthOpen(true); }}>
              Start Free Today →
            </button>
            <button className="btn-outline" onClick={() => setDropdown("learn")}>
              Explore Tools
            </button>
          </div>
          <div className="hero-disciplines">
            <div className="disc-pill"><span>🧩</span><p>Cubing</p></div>
            <div className="disc-pill"><span>💻</span><p>Coding</p></div>
            <div className="disc-pill"><span>♟️</span><p>Chess</p></div>
          </div>
        </div>

        <div className="scroll-hint">
          <p>Scroll</p>
          <div className="scroll-line"/>
        </div>
      </div>

      {/* ══════════ STATS BAR ══════════ */}
      <div className="stats-bar">
        {[["2,400+","Active Learners"],["180+","Lessons"],["3","Disciplines"],["100%","Free to Start"]].map(([n,l]) => (
          <div className="stat-item" key={l}>
            <div className="stat-num">{n}</div>
            <div className="stat-label">{l}</div>
          </div>
        ))}
      </div>

      {/* ══════════ LEARN SECTION ══════════ */}
      <div className="section-wrap" id="learn">
        <div className="section-label">What We Offer</div>
        <h2 className="section-title">THREE WORLDS.<br/>ONE PLATFORM.</h2>
        <div className="learn-grid">
          {[
            { key:"cube",  cls:"cube-card",  icon:"🧩", title:"CUBING", desc:"From your first solve to sub-20 seconds — algorithms, a 3D solver, speed timer, and structured courses." },
            { key:"code",  cls:"code-card",  icon:"💻", title:"CODING", desc:"HTML, CSS, JS, React, Python — live playground, structured tracks, real projects, and guided courses." },
            { key:"chess", cls:"chess-card", icon:"♟️", title:"CHESS",  desc:"Interactive board, daily puzzles, opening explorer, endgame studies, and full game analysis tools." },
          ].map(card => (
            <div className={`learn-card ${card.cls}`} key={card.key}>
              <div className="learn-card-icon">{card.icon}</div>
              <div className="learn-card-title">{card.title}</div>
              <p className="learn-card-desc">{card.desc}</p>
              <div className="learn-tools">
                {MEGA_ITEMS[card.key].map(t => (
                  <button key={t.label} className="learn-tool"
                    onClick={() => {
                      if (t.locked && !user) requireAuth(() => {});
                      else window.location.href = t.href;
                    }}>
                    <span className="learn-tool-icon">{t.icon}</span>
                    {t.label}
                    {t.locked && !user && <span className="lock">🔒</span>}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════ LESSONS SECTION ══════════ */}
      <div className="section-wrap" id="lessons">
        <div className="section-label">Content Library</div>
        <h2 className="section-title">START LEARNING<br/>RIGHT NOW.</h2>

        {/* Gate banner */}
        {!user && (
          <div className="gate-banner">
            <p><strong>🔒 Login required</strong> — Create a free account to access all lessons and track your progress.</p>
            <button onClick={() => { setAuthTab("signup"); setAuthOpen(true); }}>Sign Up Free →</button>
          </div>
        )}

        {/* Filter tabs */}
        <div className="filter-row">
          {[["all","All"],["cube","🧩 Cubing"],["code","💻 Coding"],["chess","♟️ Chess"]].map(([v,l]) => (
            <button
              key={v}
              className={`filter-btn${filter === v ? " active" : ""}`}
              onClick={() => user ? setFilter(v) : requireAuth(() => {})}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Lessons grid */}
        <div className="lessons-grid" style={{ opacity: user ? 1 : 0.45, pointerEvents: user ? "all" : "none" }}>
          {filtered.map(ls => (
            <div key={ls.id} className="lesson-card"
              onClick={() => user ? setLessonModal(ls) : requireAuth(() => {})}>
              <div className="lesson-meta">
                <span className={`lesson-cat cat-${ls.cat}`}>{catLabel(ls.cat)}</span>
                <span className="lesson-level">{ls.level}</span>
              </div>
              <div className="lesson-title">{ls.title}</div>
              <p className="lesson-desc">{ls.desc}</p>
              <div className="lesson-footer">
                <span className="lesson-time">⏱ {ls.time}</span>
                <div className="lesson-arrow">→</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════ COMMUNITY CTA ══════════ */}
      <div className="community-section" id="community">
        <div className="section-label">Join Us</div>
        <h2 className="section-title">LEARN TOGETHER.<br/>GROW FASTER.</h2>
        <p className="community-sub">
          {user
            ? `Welcome back, ${user.username}! Connect with thousands of learners.`
            : "Join thousands of cubers, coders, and chess players leveling up every day. It's free."
          }
        </p>
        <button
          className="btn-primary"
          style={{ fontSize:"0.8rem", padding:"17px 46px" }}
          onClick={() => user ? window.location.href="/community" : (()=>{ setAuthTab("signup"); setAuthOpen(true); })()}
        >
          {user ? "Open Community →" : "Create Free Account →"}
        </button>
      </div>

      {/* ══════════ FOOTER ══════════ */}
      <footer>
        <div className="footer-brand">
          <div className="nav-logo">CUCHCO</div>
          <p>Your brain deserves a workout. Master Cubing, Coding, and Chess — the three ultimate mind sports.</p>
          <div className="footer-social">
            {SOCIALS.map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="social-icon" title={s.label}>
                {s.icon}
              </a>
            ))}
          </div>
        </div>
        <div className="footer-links">
          <div className="footer-col">
            <h4>Learn</h4>
            <ul>
              <li><a href="/cube">Cube Solver</a></li>
              <li><a href="/cube">Speed Timer</a></li>
              <li><a href="/chess">Chess Board</a></li>
              <li><a href="/code">Code Playground</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Platform</h4>
            <ul>
              <li><a href="/#lessons">All Lessons</a></li>
              <li><a href="/#lessons">Progress Tracker</a></li>
              <li><a href="/community">Community</a></li>
              <li><a href="/about">About Cuchco</a></li>
            </ul>
          </div>
        </div>
      </footer>
      <div className="footer-bottom">
        <p>© 2025 Cuchco. Built with ❤️ and ☕</p>
        <p>React + CSS3 · Google Sheets Backend</p>
      </div>

      {/* ══════════ AUTH MODAL ══════════ */}
      {authOpen && (
        <AuthModal
          defaultTab={authTab}
          onClose={() => setAuthOpen(false)}
          onLogin={handleLogin}
        />
      )}

      {/* ══════════ LESSON MODAL ══════════ */}
      {lessonModal && (
        <div className="modal-overlay" onClick={() => setLessonModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setLessonModal(null)}>✕</button>
            <span className={`lesson-cat cat-${lessonModal.cat}`} style={{marginBottom:"14px",display:"inline-block"}}>
              {catLabel(lessonModal.cat)} · {lessonModal.level}
            </span>
            <div className="modal-title" style={{fontSize:"1.9rem"}}>{lessonModal.title}</div>
            <p className="modal-body" style={{marginBottom:"8px"}}>{lessonModal.desc}</p>
            <p style={{fontFamily:"Space Mono,monospace",fontSize:"0.66rem",color:"var(--text3)",marginBottom:"22px"}}>
              ⏱ Estimated: {lessonModal.time}
            </p>
            <div className="modal-steps">
              {lessonModal.steps.map((s,i) => (
                <div className="modal-step" key={i}>
                  <div className="modal-step-num">{pad2(i)}</div>
                  <div className="modal-step-text">{s}</div>
                </div>
              ))}
            </div>
            <button className="btn-primary" style={{width:"100%",marginTop:"26px",fontSize:"0.78rem"}}>
              Start Lesson →
            </button>
          </div>
        </div>
      )}
    </>
  );
}
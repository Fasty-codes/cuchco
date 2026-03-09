import { useState, useEffect, useRef } from "react";
import "./Learn.css";
import { loadSession, clearSession } from "../../sheetsApi";

const SunIcon    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>;
const MoonIcon   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>;
const MonitorIcon= () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>;
const ChevronDown= () => <svg className="chevron" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="2,3 5,7 8,3"/></svg>;
const ArrowRight = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/></svg>;

const DISCIPLINES = [
  {
    key:"cube", label:"CUBING", short:"CUB", num:"01",
    accent:"#FF5733", glow:"rgba(255,87,51,0.15)",
    tagline:"Speed. Logic. Algorithms.",
    blurb:"From beginner basics to sub-10 CFOP — sharpen your hands and your mind.",
    items:[
      { icon:"🧩", label:"Cube Solver",      badge:"FREE",    desc:"Input your cube state, get the optimal solution with animated step-by-step moves.", locked:false, href:"/cube"  },
      { icon:"⏱️", label:"Speed Timer",       badge:"FREE",    desc:"WCA-style competition timer. Tracks Ao5, Ao12 averages and your best sessions.",    locked:false, href:"/cube"  },
      { icon:"📖", label:"Algorithm Library", badge:"PREMIUM", desc:"Complete OLL & PLL reference — 78 algorithms with move notation and preview.",      locked:true,  href:"/cube"  },
      { icon:"🏆", label:"Beginner Course",   badge:"PREMIUM", desc:"Layer-by-layer full method. Go from scrambled to solved in a single afternoon.",    locked:true,  href:"/cube"  },
      { icon:"🚀", label:"CFOP Full Course",  badge:"PREMIUM", desc:"The world record speedcubing method. F2L pairs, OLL, PLL — every step mastered.",   locked:true,  href:"/cube"  },
    ]
  },
  {
    key:"code", label:"CODING", short:"COD", num:"02",
    accent:"#00C4D4", glow:"rgba(0,196,212,0.15)",
    tagline:"Build. Ship. Repeat.",
    blurb:"From your first HTML tag to shipping React apps — the complete builder's path.",
    items:[
      { icon:"💻", label:"Code Playground",  badge:"FREE",    desc:"Live HTML / CSS / JS sandbox in the browser. Write code and see results instantly.", locked:false, href:"/code"  },
      { icon:"🌐", label:"Web Dev Track",    badge:"PREMIUM", desc:"The complete path: HTML → CSS → JavaScript → React. Real projects throughout.",      locked:true,  href:"/code"  },
      { icon:"🐍", label:"Python Basics",    badge:"PREMIUM", desc:"Variables, functions, loops, projects. From zero to Pythonic developer in weeks.",    locked:true,  href:"/code"  },
      { icon:"⚛️", label:"React Course",     badge:"PREMIUM", desc:"Hooks, state, context, API calls. Build production-level UIs from scratch.",          locked:true,  href:"/code"  },
      { icon:"🛠️", label:"Project Builder",  badge:"PREMIUM", desc:"Guided real-world builds: portfolio sites, full-stack apps, REST APIs.",              locked:true,  href:"/code"  },
    ]
  },
  {
    key:"chess", label:"CHESS", short:"CHE", num:"03",
    accent:"#B882FF", glow:"rgba(184,130,255,0.15)",
    tagline:"Think. Calculate. Win.",
    blurb:"Tactics, openings and endgames — train your brain to think ten moves ahead.",
    items:[
      { icon:"♟️", label:"Chess Board",      badge:"FREE",    desc:"Full-rules board. Castling, en passant, promotions, checkmate detection — all there.", locked:false, href:"/chess" },
      { icon:"🧩", label:"Puzzle Trainer",   badge:"FREE",    desc:"Daily tactics — forks, pins, skewers, back-rank mates. Pattern recognition engine.",  locked:false, href:"/chess" },
      { icon:"📚", label:"Opening Explorer", badge:"PREMIUM", desc:"Italian, Sicilian, London — learn the theory, key ideas and deadly traps.",             locked:true,  href:"/chess" },
      { icon:"📊", label:"Game Analysis",    badge:"PREMIUM", desc:"Engine evaluation bar, blunder detection, annotated move-by-move game review.",         locked:true,  href:"/chess" },
      { icon:"🎓", label:"Endgame Studies",  badge:"PREMIUM", desc:"King activation, opposition, pawn races. The most decisive phase of the game.",         locked:true,  href:"/chess" },
    ]
  }
];

export default function Learn() {
  const [user,       setUser]       = useState(null);
  const [themeMode,  setThemeMode]  = useState(() => localStorage.getItem("cuchco-theme") || "dark");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active,     setActive]     = useState(0);
  const [animKey,    setAnimKey]    = useState(0);
  const navRef = useRef(null);

  useEffect(() => { const s = loadSession(); if (s) setUser(s); }, []);
  useEffect(() => {
    localStorage.setItem("cuchco-theme", themeMode);
    const t = themeMode==="system"
      ? (window.matchMedia("(prefers-color-scheme:light)").matches?"light":"dark")
      : themeMode;
    document.documentElement.setAttribute("data-theme", t);
  }, [themeMode]);

  const handleLogout = () => { clearSession(); setUser(null); };
  const switchTab = (i) => { setActive(i); setAnimKey(k => k+1); };
  const goTo = (item) => {
    if (item.locked && !user) window.location.href = "/";
    else window.location.href = item.href;
  };

  const disc = DISCIPLINES[active];

  return (
    <div className="lp" style={{"--acc": disc.accent, "--glow": disc.glow}}>

      {/* ══ NAV ══ */}
      <nav className="nav" ref={navRef}>
        <a href="/" className="nav-logo" style={{textDecoration:"none"}}>CUCHCO</a>
        <div className="nav-center">
          <div className="nav-item"><a href="/learn"      className="nav-link" style={{color:"var(--yellow)"}}>Learn <ChevronDown /></a></div>
          <div className="nav-item"><a href="/#lessons"   className="nav-link">Lessons</a></div>
          <div className="nav-item"><a href="/community"  className="nav-link">Community</a></div>
          <div className="nav-item"><a href="/about"      className="nav-link">About</a></div>
        </div>
        <div className="nav-right">
          <div className="theme-toggle">
            <button className={`t-btn${themeMode==="light"  ?" on":""}`} onClick={()=>setThemeMode("light")}><SunIcon/></button>
            <button className={`t-btn${themeMode==="system" ?" on":""}`} onClick={()=>setThemeMode("system")}><MonitorIcon/></button>
            <button className={`t-btn${themeMode==="dark"   ?" on":""}`} onClick={()=>setThemeMode("dark")}><MoonIcon/></button>
          </div>
          {user ? (
            <div className="user-chip" onClick={handleLogout} title="Log out">
              <div className="user-avatar">{user.username[0].toUpperCase()}</div>
              {user.username}
            </div>
          ) : (
            <>
              <button className="btn-login"  onClick={()=>window.location.href="/"}>Log In</button>
              <button className="btn-signup" onClick={()=>window.location.href="/"}>Sign Up</button>
            </>
          )}
          <button className="hamburger" onClick={()=>setMobileOpen(o=>!o)} aria-label="Menu"><span/><span/><span/></button>
        </div>
      </nav>

      {/* ══ MOBILE MENU ══ */}
      <div className={`mobile-menu${mobileOpen?" open":""}`}>
        <a href="/learn"      className="mobile-menu-link" onClick={()=>setMobileOpen(false)}>Learn</a>
        <a href="/#lessons"   className="mobile-menu-link" onClick={()=>setMobileOpen(false)}>Lessons</a>
        <a href="/community"  className="mobile-menu-link" onClick={()=>setMobileOpen(false)}>Community</a>
        <a href="/about"      className="mobile-menu-link" onClick={()=>setMobileOpen(false)}>About</a>
        <div className="mobile-theme-row">
          <span className="mobile-theme-label">THEME</span>
          <div className="theme-toggle">
            <button className={`t-btn${themeMode==="light"  ?" on":""}`} onClick={()=>setThemeMode("light")}><SunIcon/></button>
            <button className={`t-btn${themeMode==="system" ?" on":""}`} onClick={()=>setThemeMode("system")}><MonitorIcon/></button>
            <button className={`t-btn${themeMode==="dark"   ?" on":""}`} onClick={()=>setThemeMode("dark")}><MoonIcon/></button>
          </div>
        </div>
        <div className="mobile-auth-row">
          {user ? (
            <><span className="mobile-username">👤 {user.username}</span><button className="btn-login" onClick={handleLogout}>Log Out</button></>
          ) : (
            <><button className="btn-login" onClick={()=>window.location.href="/"}>Log In</button><button className="btn-signup" onClick={()=>window.location.href="/"}>Sign Up</button></>
          )}
        </div>
      </div>

      {/* ══ HERO ══ */}
      <header className="lp-hero">
        <div className="lp-noise"/>
        <div className="lp-grid-bg"/>
        {/* Animated glow blob that changes per discipline */}
        <div className="lp-glow-blob" style={{background:`radial-gradient(ellipse 60% 70% at 60% 60%, ${disc.glow}, transparent 70%)`}}/>
        <div className="lp-hero-inner">
          <div className="lp-hero-left">
            <div className="lp-eyebrow">
              <span className="lp-eyebrow-dot" style={{background:disc.accent}}/>
              CUCHCO LEARNING HUB
            </div>
            <h1 className="lp-hero-h1">
              TRAIN YOUR<br/>
              <span className="lp-hero-accent" style={{color:disc.accent, WebkitTextStrokeColor:disc.accent}}>
                {disc.label}
              </span>
            </h1>
            <p className="lp-hero-blurb">{disc.blurb}</p>
            <div className="lp-hero-actions">
              <button className="lp-cta-primary" style={{background:disc.accent}} onClick={()=>window.location.href=disc.items[0].href}>
                Start Free →
              </button>
              {!user && (
                <button className="lp-cta-ghost" onClick={()=>window.location.href="/"}>
                  Sign Up to Unlock All
                </button>
              )}
            </div>
            {/* Stats row */}
            <div className="lp-stats-row">
              <div className="lp-stat"><strong>{disc.items.filter(i=>!i.locked).length}</strong><span>Free</span></div>
              <div className="lp-stat-sep"/>
              <div className="lp-stat"><strong>{disc.items.filter(i=>i.locked).length}</strong><span>Premium</span></div>
              <div className="lp-stat-sep"/>
              <div className="lp-stat"><strong>{disc.items.length}</strong><span>Total</span></div>
            </div>
          </div>

          {/* Discipline switcher — vertical on right */}
          <div className="lp-disc-switcher">
            {DISCIPLINES.map((d,i) => (
              <button
                key={d.key}
                className={`lp-ds-btn${active===i?" lp-ds-active":""}`}
                style={active===i?{borderColor:d.accent,color:d.accent}:{}}
                onClick={()=>switchTab(i)}
              >
                <span className="lp-ds-num">{d.num}</span>
                <span className="lp-ds-label">{d.label}</span>
                <span className="lp-ds-tag">{d.tagline}</span>
                {active===i && <span className="lp-ds-indicator" style={{background:d.accent}}/>}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ══ MARQUEE TICKER ══ */}
      <div className="lp-ticker" style={{borderColor: disc.accent + "44", background: disc.glow}}>
        <div className="lp-ticker-track">
          {[...Array(3)].map((_,ri) => (
            <span key={ri} className="lp-ticker-inner">
              {DISCIPLINES.map(d => (
                <span key={d.key} className="lp-ticker-item">
                  <span style={{color:d.accent}}>{d.label}</span>
                  {d.items.map(it => <span key={it.label}>{it.label}</span>)}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ══ CONTENT: left sidebar tabs + right card grid ══ */}
      <section className="lp-body" key={animKey}>

        {/* Sidebar */}
        <aside className="lp-sidebar">
          <p className="lp-sidebar-label">DISCIPLINES</p>
          {DISCIPLINES.map((d,i) => (
            <button
              key={d.key}
              className={`lp-sb-tab${active===i?" lp-sb-active":""}`}
              style={active===i?{"--a":d.accent}:{}}
              onClick={()=>switchTab(i)}
            >
              <span className="lp-sb-num">{d.num}</span>
              <span className="lp-sb-name">{d.label}</span>
              <span className="lp-sb-count">{d.items.length}</span>
            </button>
          ))}
          <div className="lp-sidebar-divider"/>
          <p className="lp-sidebar-label" style={{marginTop:0}}>CURRENT</p>
          <div className="lp-sidebar-info" style={{borderColor: disc.accent + "55"}}>
            <p style={{color:disc.accent, fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.1rem", letterSpacing:"2px"}}>{disc.label}</p>
            <p style={{color:"var(--text2)", fontSize:"0.75rem", lineHeight:1.5}}>{disc.tagline}</p>
          </div>
        </aside>

        {/* Cards */}
        <div className="lp-cards-area">
          <div className="lp-section-headline">
            <span className="lp-headline-num" style={{color: disc.accent + "33"}}>{disc.num}</span>
            <div>
              <h2 className="lp-headline-title" style={{color: disc.accent}}>{disc.label}</h2>
              <p className="lp-headline-sub">{disc.tagline}</p>
            </div>
          </div>

          <div className="lp-cards">
            {disc.items.map((item, i) => (
              <div
                key={item.label}
                className={`lp-card${item.locked&&!user?" lp-locked":""}`}
                style={{"--i":i, "--a":disc.accent}}
                onClick={()=>goTo(item)}
              >
                {/* Left colored strip */}
                <div className="lp-card-strip" style={{background: item.locked&&!user ? "var(--text3)" : disc.accent}}/>

                <div className="lp-card-icon-col">
                  <div className="lp-card-icon-box" style={{background: disc.glow, border:`1px solid ${disc.accent}33`}}>
                    <span className="lp-card-emoji">{item.icon}</span>
                  </div>
                </div>

                <div className="lp-card-content">
                  <div className="lp-card-row1">
                    <h3 className="lp-card-name">{item.label}</h3>
                    <span className={`lp-badge${item.badge==="FREE"?" lp-badge-free":" lp-badge-premium"}`}
                      style={item.badge==="FREE"?{background:disc.accent+"22",color:disc.accent,borderColor:disc.accent+"44"}:{}}>
                      {item.locked && !user ? "🔒 "+item.badge : item.badge}
                    </span>
                  </div>
                  <p className="lp-card-desc">{item.desc}</p>
                </div>

                <div className="lp-card-arrow-col">
                  <div className="lp-card-arrow-btn" style={{color: item.locked&&!user?"var(--text3)":disc.accent}}>
                    <ArrowRight/>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FULL-BLEED DISCIPLINE STRIP ══ */}
      <section className="lp-strip-section">
        {DISCIPLINES.map((d,i) => (
          <div
            key={d.key}
            className={`lp-strip-card${active===i?" lp-strip-active":""}`}
            style={{"--a":d.accent,"--g":d.glow}}
            onClick={()=>switchTab(i)}
          >
            <div className="lp-strip-num">{d.num}</div>
            <div className="lp-strip-body">
              <h3 style={{color:d.accent}}>{d.label}</h3>
              <p>{d.tagline}</p>
              <div className="lp-strip-pills">
                <span className="lp-spill" style={{background:d.accent+"22",color:d.accent}}>{d.items.filter(i=>!i.locked).length} free</span>
                <span className="lp-spill" style={{background:"var(--surface2)",color:"var(--text2)"}}>{d.items.filter(i=>i.locked).length} premium</span>
              </div>
            </div>
            <div className="lp-strip-arrow" style={{color:d.accent}}>→</div>
          </div>
        ))}
      </section>

      {/* ══ CTA ══ */}
      {!user && (
        <section className="lp-cta-section">
          <div className="lp-cta-noise"/>
          <div className="lp-cta-glow" style={{background:`radial-gradient(ellipse 50% 80% at 50% 50%, ${disc.glow}, transparent)`}}/>
          <div className="lp-cta-inner">
            <div className="lp-cta-tag">
              <span style={{background:disc.accent}} className="lp-cta-dot"/>
              FREE TO JOIN
            </div>
            <h2 className="lp-cta-h2">UNLOCK<br/><span style={{color:disc.accent}}>EVERYTHING.</span></h2>
            <p className="lp-cta-p">One free account unlocks premium courses, algorithm libraries, progress tracking across all three disciplines.</p>
            <button className="lp-cta-btn" style={{background:disc.accent}} onClick={()=>window.location.href="/"}>
              Create Free Account →
            </button>
          </div>
        </section>
      )}

      {/* ══ FOOTER ══ */}
      <footer className="lp-footer">
        <div className="lp-footer-top">
          <a href="/" className="lp-footer-logo">CUCHCO</a>
          <div className="lp-footer-links">
            <a href="/">Home</a><a href="/learn">Learn</a>
            <a href="/community">Community</a><a href="/about">About</a>
            <a href="/cube">Cube Solver</a><a href="/chess">Chess</a><a href="/code">Code</a>
          </div>
        </div>
        <div className="lp-footer-bot">
          <span>© 2025 Cuchco — Master Your Mind</span>
          <div className="lp-footer-discs">
            {DISCIPLINES.map(d=><span key={d.key} style={{color:d.accent}}>{d.short}</span>)}
          </div>
        </div>
      </footer>
    </div>
  );
}
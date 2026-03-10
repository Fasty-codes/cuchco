import { useState, useEffect } from "react";
import "./HubPage.css";
import { loadSession, clearSession } from "../../sheetsApi";

const SunIcon    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>;
const MoonIcon   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>;
const MonitorIcon= () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>;

const ACC = "#FF5733";
const GLOW = "rgba(255,87,51,0.12)";

const TOOLS = [
  { icon:"🧩", label:"Cube Solver",      badge:"FREE", desc:"Input your cube state and get the optimal solution with animated step-by-step moves.", href:"/cube/solver" },
  { icon:"⏱️", label:"Speed Timer",       badge:"FREE", desc:"WCA-style competition timer. Tracks Ao5, Ao12 averages and your personal best sessions.", href:"/cube/timer" },
  { icon:"📖", label:"Algorithm Library", badge:"FREE", desc:"Complete OLL & PLL reference — 78 algorithms with move notation and animated previews.", href:"/cube/algorithms" },
];
const COURSES = [
  { icon:"🏆", label:"Beginner Course",  badge:"FREE", desc:"Layer-by-layer full method. Go from scrambled to solved in a single afternoon.", href:"/cube/beginner" },
  { icon:"🚀", label:"CFOP Full Course", badge:"FREE", desc:"The world record speedcubing system. F2L pairs, 57 OLL, 21 PLL — every step mastered.", href:"/cube/cfop" },
];

function NavBar({ user, themeMode, setThemeMode, mobileOpen, setMobileOpen, handleLogout }) {
  return (
    <>
      <nav className="nav">
        <a href="/" className="nav-logo">CUCHCO</a>
        <div className="nav-center">
          <div className="nav-item"><a href="/learn"    className="nav-link">Learn</a></div>
          <div className="nav-item"><a href="/cube"     className="nav-link" style={{color:ACC}}>Cube</a></div>
          <div className="nav-item"><a href="/chess"    className="nav-link">Chess</a></div>
          <div className="nav-item"><a href="/coding"   className="nav-link">Coding</a></div>
          <div className="nav-item"><a href="/community"className="nav-link">Community</a></div>
        </div>
        <div className="nav-right">
          <div className="theme-toggle">
            <button className={`t-btn${themeMode==="light" ?" on":""}`} onClick={()=>setThemeMode("light")}><SunIcon/></button>
            <button className={`t-btn${themeMode==="system"?" on":""}`} onClick={()=>setThemeMode("system")}><MonitorIcon/></button>
            <button className={`t-btn${themeMode==="dark"  ?" on":""}`} onClick={()=>setThemeMode("dark")}><MoonIcon/></button>
          </div>
          {user
            ? <div className="user-chip" onClick={handleLogout}><div className="user-avatar">{user.username[0].toUpperCase()}</div>{user.username}</div>
            : <><button className="btn-login" onClick={()=>window.location.href="/"}>Log In</button><button className="btn-signup" onClick={()=>window.location.href="/"}>Sign Up</button></>
          }
          <button className="hamburger" onClick={()=>setMobileOpen(o=>!o)}><span/><span/><span/></button>
        </div>
      </nav>
      <div className={`mobile-menu${mobileOpen?" open":""}`}>
        <a href="/learn"     className="mobile-menu-link" onClick={()=>setMobileOpen(false)}>Learn</a>
        <a href="/cube"      className="mobile-menu-link" onClick={()=>setMobileOpen(false)}>Cube</a>
        <a href="/chess"     className="mobile-menu-link" onClick={()=>setMobileOpen(false)}>Chess</a>
        <a href="/coding"    className="mobile-menu-link" onClick={()=>setMobileOpen(false)}>Coding</a>
        <a href="/community" className="mobile-menu-link" onClick={()=>setMobileOpen(false)}>Community</a>
        <div className="mobile-theme-row">
          <span className="mobile-theme-label">THEME</span>
          <div className="theme-toggle">
            <button className={`t-btn${themeMode==="light" ?" on":""}`} onClick={()=>setThemeMode("light")}><SunIcon/></button>
            <button className={`t-btn${themeMode==="system"?" on":""}`} onClick={()=>setThemeMode("system")}><MonitorIcon/></button>
            <button className={`t-btn${themeMode==="dark"  ?" on":""}`} onClick={()=>setThemeMode("dark")}><MoonIcon/></button>
          </div>
        </div>
        <div className="mobile-auth-row">
          {user
            ? <><span className="mobile-username">👤 {user.username}</span><button className="btn-login" onClick={handleLogout}>Log Out</button></>
            : <><button className="btn-login" onClick={()=>window.location.href="/"}>Log In</button><button className="btn-signup" onClick={()=>window.location.href="/"}>Sign Up</button></>
          }
        </div>
      </div>
    </>
  );
}

function HubCard({ item }) {
  return (
    <a href={item.href} className="hub-tool-card" style={{"--acc":ACC,"--acc-bg":"rgba(255,87,51,0.08)"}}>
      <div className="hub-tool-card-top">
        <div className="hub-tool-icon">{item.icon}</div>
        <div className="hub-tool-info">
          <div className="hub-tool-name">{item.label}</div>
          <span className="hub-tool-badge" style={{color:ACC,borderColor:ACC+"44",background:ACC+"11"}}>{item.badge}</span>
        </div>
      </div>
      <div className="hub-tool-desc">{item.desc}</div>
      <div className="hub-tool-footer">
        <span className="hub-tool-cta">Open</span>
        <span className="hub-tool-arrow">→</span>
      </div>
    </a>
  );
}

export default function Cube() {
  const [user,       setUser]       = useState(null);
  const [themeMode,  setThemeMode]  = useState(()=>localStorage.getItem("cuchco-theme")||"dark");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(()=>{ const s=loadSession(); if(s) setUser(s); },[]);
  useEffect(()=>{
    localStorage.setItem("cuchco-theme",themeMode);
    const t=themeMode==="system"?(window.matchMedia("(prefers-color-scheme:light)").matches?"light":"dark"):themeMode;
    document.documentElement.setAttribute("data-theme",t);
  },[themeMode]);
  const handleLogout=()=>{ clearSession(); setUser(null); };

  return (
    <div className="hub" style={{"--acc":ACC}}>
      <NavBar user={user} themeMode={themeMode} setThemeMode={setThemeMode} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} handleLogout={handleLogout}/>

      {/* HERO */}
      <div className="hub-hero">
        <div className="hub-noise"/>
        <div className="hub-grid"/>
        <div className="hub-glow" style={{background:`radial-gradient(ellipse 60% 50% at 70% 50%, ${GLOW}, transparent 70%)`}}/>
        <div className="hub-hero-inner">
          <div className="hub-eyebrow"><span className="hub-eyebrow-dot" style={{background:ACC}}/>DISCIPLINE 01</div>
          <h1>
            <span style={{color:ACC}}>CUBING</span>
            <span style={{color:"var(--text)"}}>TOOLS &</span>
            <span style={{color:"var(--text)"}}>COURSES</span>
          </h1>
          <p className="hub-hero-sub">Speed. Algorithms. Mastery. Everything you need to go from first solve to sub-10.</p>
          <div className="hub-stats">
            <div className="hub-stat"><strong style={{color:ACC}}>{TOOLS.length}</strong><span>Free Tools</span></div>
            <div className="hub-stat-sep"/>
            <div className="hub-stat"><strong style={{color:ACC}}>{COURSES.length}</strong><span>Courses</span></div>
            <div className="hub-stat-sep"/>
            <div className="hub-stat"><strong style={{color:ACC}}>∞</strong><span>Algorithms</span></div>
          </div>
        </div>
      </div>

      {/* TOOLS */}
      <div className="hub-section">
        <div className="hub-section-label">FREE TOOLS</div>
        <div className="hub-tools-grid">
          {TOOLS.map(t=><HubCard key={t.label} item={t}/>)}
        </div>
      </div>

      {/* COURSES */}
      <div className="hub-section">
        <div className="hub-section-label">COURSES</div>
        <div className="hub-tools-grid">
          {COURSES.map(c=><HubCard key={c.label} item={c}/>)}
        </div>
      </div>

      {/* PREMIUM — BLANK FOR NOW */}
      <div className="hub-premium">
        <div className="hub-premium-inner">
          <div className="hub-premium-label">COMING SOON</div>
          <h2 className="hub-premium-title">PREMIUM <span>CUBING</span></h2>
          <p className="hub-premium-sub">Advanced content, exclusive algorithms, and pro-level courses are on the way.</p>
          <div className="hub-premium-empty">
            <div className="hub-premium-empty-icon">🔒</div>
            <div className="hub-premium-empty-text">Premium Content</div>
            <div className="hub-premium-empty-sub">Nothing here yet — check back soon.</div>
          </div>
        </div>
      </div>

      <footer className="hub-footer">
        <a href="/" className="hub-footer-logo">CUCHCO</a>
        <span className="hub-footer-copy">© 2025 Cuchco</span>
      </footer>
    </div>
  );
}
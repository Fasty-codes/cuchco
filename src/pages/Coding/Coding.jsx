import { useState, useEffect } from "react";
import "./HubPage.css";
import { loadSession, clearSession } from "../../sheetsApi";

const SunIcon    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>;
const MoonIcon   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>;
const MonitorIcon= () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>;

const ACC = "#00C4D4";
const GLOW = "rgba(0,196,212,0.12)";

const TOOLS = [
  { icon:"💻", label:"Code Playground", badge:"FREE", desc:"Live HTML / CSS / JS sandbox in the browser. Write code and see results instantly with zero setup.", href:"/code" },
];
const COURSES = [
  { icon:"🌐", label:"Web Dev Track",   badge:"FREE", desc:"The complete path: HTML → CSS → JavaScript → React. Real projects every step of the way.", href:"/coding" },
  { icon:"🐍", label:"Python Basics",   badge:"FREE", desc:"Variables, functions, loops, and real projects. From zero to Pythonic developer in weeks.", href:"/coding" },
  { icon:"⚛️", label:"React Course",    badge:"FREE", desc:"Hooks, state, context, API integration. Build production-level UIs completely from scratch.", href:"/coding" },
  { icon:"🛠️", label:"Project Builder", badge:"FREE", desc:"Guided real-world builds: portfolio sites, full-stack apps, REST APIs — step by step.", href:"/coding" },
];

function NavBar({ user, themeMode, setThemeMode, mobileOpen, setMobileOpen, handleLogout }) {
  return (
    <>
      <nav className="nav">
        <a href="/" className="nav-logo">CUCHCO</a>
        <div className="nav-center">
          <div className="nav-item"><a href="/learn"     className="nav-link">Learn</a></div>
          <div className="nav-item"><a href="/cube"      className="nav-link">Cube</a></div>
          <div className="nav-item"><a href="/chess"     className="nav-link">Chess</a></div>
          <div className="nav-item"><a href="/coding"    className="nav-link" style={{color:ACC}}>Coding</a></div>
          <div className="nav-item"><a href="/community" className="nav-link">Community</a></div>
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
    <a href={item.href} className="hub-tool-card" style={{"--acc":ACC,"--acc-bg":"rgba(0,196,212,0.08)"}}>
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

export default function Coding() {
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
      <div className="hub-hero">
        <div className="hub-noise"/><div className="hub-grid"/>
        <div className="hub-glow" style={{background:`radial-gradient(ellipse 60% 50% at 70% 50%, ${GLOW}, transparent 70%)`}}/>
        <div className="hub-hero-inner">
          <div className="hub-eyebrow"><span className="hub-eyebrow-dot" style={{background:ACC}}/>DISCIPLINE 02</div>
          <h1>
            <span style={{color:ACC}}>CODING</span>
            <span style={{color:"var(--text)"}}>TOOLS &</span>
            <span style={{color:"var(--text)"}}>COURSES</span>
          </h1>
          <p className="hub-hero-sub">Build. Ship. Repeat. From your first HTML tag to deploying full-stack React apps.</p>
          <div className="hub-stats">
            <div className="hub-stat"><strong style={{color:ACC}}>{TOOLS.length}</strong><span>Free Tools</span></div>
            <div className="hub-stat-sep"/>
            <div className="hub-stat"><strong style={{color:ACC}}>{COURSES.length}</strong><span>Courses</span></div>
          </div>
        </div>
      </div>
      <div className="hub-section">
        <div className="hub-section-label">FREE TOOLS</div>
        <div className="hub-tools-grid">{TOOLS.map(t=><HubCard key={t.label} item={t}/>)}</div>
      </div>
      <div className="hub-section">
        <div className="hub-section-label">COURSES</div>
        <div className="hub-tools-grid">{COURSES.map(c=><HubCard key={c.label} item={c}/>)}</div>
      </div>
      <div className="hub-premium">
        <div className="hub-premium-inner">
          <div className="hub-premium-label">COMING SOON</div>
          <h2 className="hub-premium-title">PREMIUM <span>CODING</span></h2>
          <p className="hub-premium-sub">Advanced React patterns, backend development, and mentored project builds — coming soon.</p>
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
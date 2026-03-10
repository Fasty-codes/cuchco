import { useState, useEffect, useRef } from "react";
import { FiHome, FiRefreshCw, FiTrash2, FiX, FiSettings } from "react-icons/fi";
import { MdTimer } from "react-icons/md";
import "./SpeedTimer.css";

/* ── PUZZLE SCRAMBLE GENERATORS ─────────────────────────── */
const PUZZLES = {
  "3x3":    { label:"3×3", gen: gen3x3 },
  "2x2":    { label:"2×2", gen: gen2x2 },
  "4x4":    { label:"4×4", gen: gen4x4 },
  "5x5":    { label:"5×5", gen: gen5x5 },
  "pyram":  { label:"Pyraminx", gen: genPyram },
  "mega":   { label:"Megaminx", gen: genMega },
};

function noRepeat(faces, len, mods) {
  const s = []; let lastAxis = -1;
  while (s.length < len) {
    const f = Math.floor(Math.random() * faces.length);
    if (Math.floor(f/2) === lastAxis) continue;
    s.push(faces[f] + mods[Math.floor(Math.random() * mods.length)]);
    lastAxis = Math.floor(f/2);
  }
  return s.join(" ");
}

function gen3x3()  { return noRepeat(["U","D","R","L","F","B"], 20, ["","'","2"]); }
function gen2x2()  { return noRepeat(["U","D","R","L","F","B"], 10, ["","'","2"]); }
function gen4x4() {
  const outer = ["U","U'","U2","D","D'","D2","R","R'","R2","L","L'","L2","F","F'","F2","B","B'","B2"];
  const inner = ["Uw","Uw'","Uw2","Dw","Dw'","Dw2","Rw","Rw'","Rw2","Lw","Lw'","Lw2","Fw","Fw'","Fw2","Bw","Bw'","Bw2"];
  const all = [...outer,...inner];
  const s = []; let last = "";
  for (let i=0;i<44;i++) { let m; do { m=all[Math.floor(Math.random()*all.length)]; } while(m[0]===last); s.push(m); last=m[0]; }
  return s.join(" ");
}
function gen5x5() {
  const all = ["U","U'","U2","D","D'","D2","R","R'","R2","L","L'","L2","F","F'","F2","B","B'","B2","Uw","Uw'","Uw2","Dw","Dw'","Dw2","Rw","Rw'","Rw2","Lw","Lw'","Lw2","Fw","Fw'","Fw2","Bw","Bw'","Bw2"];
  const s = []; let last = "";
  for (let i=0;i<60;i++) { let m; do { m=all[Math.floor(Math.random()*all.length)]; } while(m[0]===last); s.push(m); last=m[0]; }
  return s.join(" ");
}
function genPyram() {
  const tips = ["u","u'","l","l'","r","r'","b","b'"];
  const edges = ["U","U'","L","L'","R","R'","B","B'"];
  const s = [];
  for (let i=0;i<9;i++) s.push(edges[Math.floor(Math.random()*edges.length)]);
  for (let i=0;i<4;i++) s.push(tips[Math.floor(Math.random()*tips.length)]);
  return s.join(" ");
}
function genMega() {
  const faces = ["U","BL","BR","R","DR","DL","L","F","d","dl","dr"];
  const dirs   = ["++","--"];
  const yDirs  = ["++","--"];
  const s = [];
  for (let i=0;i<70;i++) {
    const f = faces[Math.floor(Math.random()*faces.length)];
    const d = (f==="d"||f==="dl"||f==="dr") ? yDirs[Math.floor(Math.random()*2)] : dirs[Math.floor(Math.random()*2)];
    s.push(f+d);
    if (i%10===9) s.push("y" + yDirs[Math.floor(Math.random()*2)]);
  }
  return s.join(" ");
}

function fmt(ms) {
  if (ms == null) return "—";
  if (ms < 60000) return (ms/1000).toFixed(2);
  const m = Math.floor(ms/60000);
  return `${m}:${((ms%60000)/1000).toFixed(2).padStart(5,"0")}`;
}
function trimAvg(arr, n) {
  if (arr.length < n) return null;
  const sl = arr.slice(-n), s = [...sl].sort((a,b)=>a-b);
  return s.slice(1,-1).reduce((a,b)=>a+b,0)/(n-2);
}

/* Social SVGs */
const TwitterIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L2.25 2.25h6.836l4.265 5.633L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/></svg>;
const InstaIcon   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>;
const YouTubeIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M23 7s-.3-2-1.2-2.7c-1.1-1.2-2.4-1.2-3-1.3C16.2 2.9 12 2.9 12 2.9s-4.2 0-6.8.2c-.6 0-1.9.1-3 1.3C1.3 5 1 7 1 7S.7 9.3.7 11.5v2.1c0 2.2.3 4.4.3 4.4s.3 2 1.2 2.7c1.1 1.2 2.6 1.1 3.3 1.2C7.4 22 12 22 12 22s4.2 0 6.8-.2c.6 0 1.9-.1 3-1.3.9-.7 1.2-2.7 1.2-2.7s.3-2.2.3-4.4v-2.1C23.3 9.3 23 7 23 7zM9.7 15.5V8.4l6.6 3.6-6.6 3.5z"/></svg>;
const GithubIcon  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>;

function SiteFooter() {
  return (
    <footer className="site-footer">
      <a href="/" className="sf-logo">CUCHCO</a>
      <div className="sf-socials">
        <a href="https://twitter.com"   target="_blank" rel="noreferrer" className="sf-social" aria-label="Twitter"><TwitterIcon/></a>
        <a href="https://instagram.com" target="_blank" rel="noreferrer" className="sf-social" aria-label="Instagram"><InstaIcon/></a>
        <a href="https://youtube.com"   target="_blank" rel="noreferrer" className="sf-social" aria-label="YouTube"><YouTubeIcon/></a>
        <a href="https://github.com"    target="_blank" rel="noreferrer" className="sf-social" aria-label="GitHub"><GithubIcon/></a>
      </div>
      <span className="sf-copy">© {new Date().getFullYear()} Cuchco. All rights reserved.</span>
    </footer>
  );
}

export default function SpeedTimer() {
  // Apply theme from localStorage on mount
  useEffect(() => {
    const t = localStorage.getItem("cuchco-theme") || "dark";
    const resolved = t === "system"
      ? (window.matchMedia("(prefers-color-scheme:light)").matches ? "light" : "dark")
      : t;
    document.documentElement.setAttribute("data-theme", resolved);
  }, []);

  const [puzzle,   setPuzzle]   = useState("3x3");
  const [scramble, setScramble] = useState(() => gen3x3());
  const [running,  setRunning]  = useState(false);
  const [elapsed,  setElapsed]  = useState(0);
  const [solves,   setSolves]   = useState([]);
  const [showSet,  setShowSet]  = useState(false);

  const startRef = useRef(0);
  const rafRef   = useRef(null);
  const runRef   = useRef(false); // sync ref for event handlers

  function tick() {
    setElapsed(Date.now() - startRef.current);
    rafRef.current = requestAnimationFrame(tick);
  }

  function startTimer() {
    startRef.current = Date.now();
    setElapsed(0);
    setRunning(true);
    runRef.current = true;
    rafRef.current = requestAnimationFrame(tick);
  }

  function stopTimer() {
    cancelAnimationFrame(rafRef.current);
    const t = Date.now() - startRef.current;
    setElapsed(t);
    setRunning(false);
    runRef.current = false;
    setSolves(s => [...s, t]);
    setScramble(PUZZLES[puzzle].gen());
  }

  function toggle() {
    if (runRef.current) stopTimer();
    else startTimer();
  }

  // Spacebar
  useEffect(() => {
    const onKey = (e) => {
      if (e.code === "Space") { e.preventDefault(); toggle(); }
    };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); cancelAnimationFrame(rafRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [puzzle]);

  function changePuzzle(p) {
    if (runRef.current) stopTimer();
    setPuzzle(p);
    setScramble(PUZZLES[p].gen());
    setSolves([]);
    setElapsed(0);
  }

  const times  = solves;
  const best   = times.length ? Math.min(...times) : null;
  const ao5    = trimAvg(times, 5);
  const ao12   = trimAvg(times, 12);
  const meanv  = times.length ? times.reduce((a,b)=>a+b,0)/times.length : null;

  const timerColor = running ? "var(--red)" : solves.length ? "var(--green-solve)" : "var(--text)";

  return (
    <div className="st-root">
      {/* ── TOP BAR ── */}
      <header className="st-topbar">
        <a href="/" className="st-tb-home" title="Home"><FiHome size={17}/></a>
        <div className="st-tb-div"/>
        <span className="st-tb-brand">CUCHCO</span>
        <span className="st-tb-slash">/</span>
        <span className="st-tb-page">SPEED TIMER</span>
        <div className="st-tb-gap"/>
        <button className="st-tb-icon" onClick={() => setShowSet(s=>!s)} title="Settings"><FiSettings size={15}/></button>
        <a href="/cube" className="st-tb-back">← Cube</a>
      </header>

      <div className="st-layout">
        {/* ── LEFT / MAIN ── */}
        <div className="st-main">

          {/* Puzzle selector */}
          <div className="st-puzzles">
            {Object.entries(PUZZLES).map(([k,v]) => (
              <button
                key={k}
                className={`st-puzzle-btn${puzzle===k?" active":""}`}
                onClick={() => changePuzzle(k)}
              >{v.label}</button>
            ))}
          </div>

          {/* Settings panel */}
          {showSet && (
            <div className="st-settings">
              <span className="st-set-label">Press SPACE or tap timer to start/stop. No inspection time.</span>
              <button className="st-set-close" onClick={() => setShowSet(false)}><FiX size={13}/></button>
            </div>
          )}

          {/* Scramble */}
          <div className="st-scramble-bar">
            <div className="st-scramble-moves">
              {scramble.split(" ").map((m,i) => (
                <span key={i} className="st-scr-move">{m}</span>
              ))}
            </div>
            <button className="st-scr-btn" onClick={() => setScramble(PUZZLES[puzzle].gen())} title="New scramble">
              <FiRefreshCw size={14}/>
            </button>
          </div>

          {/* Timer — tap/click toggles */}
          <div
            className={`st-timer-zone${running ? " st-running" : ""}`}
            onClick={toggle}
            role="button"
            tabIndex={-1}
            aria-label="Start/stop timer"
          >
            <div className="st-time" style={{color: timerColor}}>
              {fmt(elapsed)}
            </div>
            <div className="st-hint">
              {running ? "SPACE / TAP  →  STOP" : "SPACE / TAP  →  START"}
            </div>
          </div>

          {/* Stats strip */}
          <div className="st-stats">
            {[
              {k:"BEST",  v:best,  hi:true},
              {k:"MEAN",  v:meanv},
              {k:"Ao5",   v:ao5},
              {k:"Ao12",  v:ao12},
              {k:"COUNT", v:times.length, raw:true},
            ].map(({k,v,hi,raw}) => (
              <div key={k} className="st-stat">
                <div className="st-stat-val" style={hi&&v?{color:"var(--red)"}:{}}>{raw?v:fmt(v)}</div>
                <div className="st-stat-key">{k}</div>
              </div>
            ))}
          </div>

          <SiteFooter/>
        </div>

        {/* ── RIGHT: session ── */}
        <div className="st-sidebar">
          <div className="st-sb-hd">
            <div className="st-sb-title">
              <MdTimer size={13}/> SESSION <span className="st-sb-cnt">{solves.length}</span>
            </div>
            <button className="st-sb-clr" onClick={() => { setSolves([]); setElapsed(0); }} title="Clear"><FiTrash2 size={12}/></button>
          </div>
          <div className="st-solve-list">
            {solves.length === 0 && <div className="st-empty">No solves yet</div>}
            {[...solves].reverse().map((t,i) => {
              const idx = solves.length - i;
              const isBest = t === best && times.filter(x=>x===best).length===1;
              return (
                <div key={i} className={`st-row${isBest?" st-best":""}`}>
                  <span className="st-ri">{idx}</span>
                  <span className="st-rt">{fmt(t)}</span>
                  <button className="st-rdel" onClick={() => setSolves(s=>s.filter((_,j)=>j!==solves.length-1-i))}>
                    <FiX size={10}/>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
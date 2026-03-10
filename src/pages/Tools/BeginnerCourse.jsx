import { useState, useEffect } from "react";
import { FiHome, FiSun, FiMoon, FiMonitor } from "react-icons/fi";
import "./CoursePages.css";

const ACC     = "#FF5733";
const ACC_GLOW= "rgba(255,87,51,0.12)";

const LESSONS = [
  {
    num:"01", title:"Know Your Cube", time:"5 min",
    desc:"Learn the anatomy of a 3×3 cube, the 3 piece types, and the move notation system used worldwide.",
    content:[
      { type:"tip", text:"Every move has a name. U = Up face clockwise, U' = counter-clockwise, U2 = 180°. The same logic applies to D (Down), R (Right), L (Left), F (Front), B (Back)." },
      { type:"alg", label:"Piece Types", moves:"Corners (3 colours) · Edges (2 colours) · Centers (1 colour)", name:"Centers define the face colour — they never move relative to each other." },
      { type:"note", text:"White is usually on the bottom for beginners. Your white center defines your 'white face'. Each center shows you which colour belongs on that face." },
    ]
  },
  {
    num:"02", title:"White Cross", time:"15 min",
    desc:"Build a white plus sign on the bottom face, with side colours matching each centre.",
    content:[
      { type:"tip", text:"Don't memorise algorithms yet — try to think intuitively. Each white edge needs to land with its side colour matching the centre." },
      { type:"alg", label:"Edge Flip (when edge is upside-down)", moves:"F R U R' U' F'", name:"Use when the white sticker faces out instead of down." },
      { type:"note", text:"Work one edge at a time. If you accidentally knock a solved edge, just redo it. Speed comes later — understanding comes first." },
    ]
  },
  {
    num:"03", title:"White Corners", time:"15 min",
    desc:"Fill in the four white corners to complete the entire white face.",
    content:[
      { type:"tip", text:"All 4 corners can be solved with one algorithm repeated. Look for the white corner above its target slot first." },
      { type:"alg", label:"Sexy Move (insert corner)", moves:"R U R' U'", name:"Repeat 1–5 times until corner drops in. Rotate U to re-align as needed." },
      { type:"alg", label:"Corner stuck in slot wrong", moves:"R U R' U' R U R' U' R U R'", name:"This kicks out the corner and re-inserts it correctly." },
    ]
  },
  {
    num:"04", title:"Middle Layer Edges", time:"20 min",
    desc:"Solve the 4 middle layer edges using two mirror algorithms.",
    content:[
      { type:"tip", text:"Hold the cube with white on the bottom. Find a non-yellow edge in the top layer that belongs in the middle. Align it with its matching centre, then use the appropriate insert." },
      { type:"alg", label:"Right Insert (edge goes right)", moves:"U R U' R' U' F' U F", name:"" },
      { type:"alg", label:"Left Insert (edge goes left)", moves:"U' L' U L U F U' F'", name:"" },
      { type:"note", text:"If a middle edge is in place but flipped, first use either algorithm to replace it with a top-layer edge, then reinsert correctly." },
    ]
  },
  {
    num:"05", title:"Yellow Cross (OLL Step 1)", time:"10 min",
    desc:"Orient the yellow edges on the top face to form a cross — ignoring corners for now.",
    content:[
      { type:"tip", text:"You only need one algorithm. Keep applying it and rotating U until you have a yellow cross. Check for a dot, L-shape, or line." },
      { type:"alg", label:"OLL Line / L-shape / Dot", moves:"F R U R' U' F'", name:"Apply from dot → L-shape → line → cross." },
      { type:"note", text:"Dot (no yellow edges up): apply twice. L-shape: hold L at back-left, apply once. Line: hold horizontal, apply once." },
    ]
  },
  {
    num:"06", title:"Orient Yellow Corners", time:"15 min",
    desc:"Twist all four yellow corners until the entire top face is yellow.",
    content:[
      { type:"tip", text:"Look for a corner with yellow facing the right side. Hold that at the front-right. Apply Sune until only that corner is yellow-up, then turn U to find the next." },
      { type:"alg", label:"Sune Algorithm", moves:"R U R' U R U2 R'", name:"The most important beginner algorithm. Repeat and adjust U until all 4 corners are yellow-up." },
    ]
  },
  {
    num:"07", title:"Permute Corners (PLL Step 1)", time:"10 min",
    desc:"Cycle the yellow corners into their correct positions.",
    content:[
      { type:"tip", text:"First check if any corner is already in the right position. If yes, hold that at the front-right and apply the algorithm. If no corner is correct, apply once from any angle, then check again." },
      { type:"alg", label:"Corner 3-Cycle", moves:"U R U' L' U R' U' L", name:"Cycles 3 corners. Repeat and turn U until all 4 corners are in the right spots." },
    ]
  },
  {
    num:"08", title:"Permute Edges (PLL Step 2)", time:"10 min",
    desc:"The final step — cycle the last 4 edges to complete the solve.",
    content:[
      { type:"tip", text:"Find an edge that is already in the right position (or close to it). Face that side toward you and apply U-Perm. If none is correct, apply once, then check again." },
      { type:"alg", label:"U-Perm (3 edges counter-clockwise)", moves:"R U' R U R U R U' R' U' R2", name:"" },
      { type:"alg", label:"U-Perm b (3 edges clockwise)", moves:"R2 U R U R' U' R' U' R' U R'", name:"" },
      { type:"note", text:"After this step your cube should be solved! If not, check you applied each algorithm from the correct angle. You did it! Now work on speed." },
    ]
  },
];

const SunIcon     = () => <FiSun size={14}/>;
const MoonIcon    = () => <FiMoon size={14}/>;
const MonitorIcon = () => <FiMonitor size={14}/>;
const TwitterIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L2.25 2.25h6.836l4.265 5.633L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/></svg>;
const InstaIcon   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>;
const YTIcon      = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M23 7s-.3-2-1.2-2.7c-1.1-1.2-2.4-1.2-3-1.3C16.2 2.9 12 2.9 12 2.9s-4.2 0-6.8.2c-.6 0-1.9.1-3 1.3C1.3 5 1 7 1 7S.7 9.3.7 11.5v2.1c0 2.2.3 4.4.3 4.4s.3 2 1.2 2.7c1.1 1.2 2.6 1.1 3.3 1.2C7.4 22 12 22 12 22s4.2 0 6.8-.2c.6 0 1.9-.1 3-1.3.9-.7 1.2-2.7 1.2-2.7s.3-2.2.3-4.4v-2.1C23.3 9.3 23 7 23 7zM9.7 15.5V8.4l6.6 3.6-6.6 3.5z"/></svg>;
const GHIcon      = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>;

// Malayalam YouTube link placeholder — swap in real link when ready
const MALAYALAM_URL = "";  // e.g. "https://www.youtube.com/embed/VIDEO_ID"
const ENGLISH_URL   = "";  // e.g. "https://www.youtube.com/embed/VIDEO_ID"

export default function BeginnerCourse() {
  const [theme,    setTheme]    = useState(() => localStorage.getItem("cuchco-theme") || "dark");
  const [active,   setActive]   = useState(0);
  const [done,     setDone]     = useState({});

  useEffect(() => {
    const t = theme === "system"
      ? (window.matchMedia("(prefers-color-scheme:light)").matches ? "light" : "dark")
      : theme;
    document.documentElement.setAttribute("data-theme", t);
    localStorage.setItem("cuchco-theme", theme);
  }, [theme]);

  const toggleDone = (i) => setDone(d => ({...d, [i]: !d[i]}));
  const completed  = Object.values(done).filter(Boolean).length;
  const lesson     = LESSONS[active];

  return (
    <div className="cp-root" style={{"--acc": ACC, "--acc-glow": ACC_GLOW}}>

      {/* ── NAV ── */}
      <nav className="cp-nav">
        <a href="/" className="cp-nav-home" title="Home"><FiHome size={17}/></a>
        <div className="cp-nav-div"/>
        <span className="cp-nav-brand">CUCHCO</span>
        <span className="cp-nav-slash">/</span>
        <span className="cp-nav-title">BEGINNER COURSE</span>
        <div className="cp-nav-gap"/>
        <div className="cp-theme-toggle">
          <button className={`cp-t-btn${theme==="light"?" on":""}`}  onClick={()=>setTheme("light")}><SunIcon/></button>
          <button className={`cp-t-btn${theme==="system"?" on":""}`} onClick={()=>setTheme("system")}><MonitorIcon/></button>
          <button className={`cp-t-btn${theme==="dark"?" on":""}`}   onClick={()=>setTheme("dark")}><MoonIcon/></button>
        </div>
        <a href="/cube" className="cp-nav-back">← Cube</a>
      </nav>

      {/* ── HERO ── */}
      <div className="cp-hero">
        <div className="cp-hero-eyebrow">BEGINNER COURSE</div>
        <h1 className="cp-hero-h1">LAYER BY<br/><span>LAYER</span></h1>
        <p className="cp-hero-sub">8 lessons. Zero experience needed. Solve your first cube this afternoon.</p>
        <div className="cp-progress-wrap">
          <div className="cp-progress-track">
            <div className="cp-progress-fill" style={{width:`${(completed/LESSONS.length)*100}%`}}/>
          </div>
          <div className="cp-progress-label">{completed} / {LESSONS.length} LESSONS COMPLETE</div>
        </div>
        <div className="cp-hero-stats">
          <div className="cp-hero-stat"><strong>8</strong>Lessons</div>
          <div className="cp-hero-stat"><strong>FREE</strong>No account needed</div>
          <div className="cp-hero-stat"><strong>~90</strong>Minutes</div>
        </div>
      </div>

      {/* ── VIDEO SECTION ── */}
      <div className="cp-videos">
        <div className="cp-video-block">
          <div className="cp-video-label">
            <span>🇮🇳 Malayalam Tutorial</span>
          </div>
          <div className="cp-video-frame">
            {MALAYALAM_URL
              ? <iframe src={MALAYALAM_URL} title="Malayalam Tutorial" allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"/>
              : <div className="cp-coming-soon">
                  <div className="cp-cs-icon">🎬</div>
                  <div className="cp-cs-tag">COMING SOON</div>
                  <div className="cp-cs-title">VIDEO</div>
                  <div className="cp-cs-sub">Malayalam tutorial — link pending</div>
                </div>
            }
          </div>
        </div>
        <div className="cp-video-block">
          <div className="cp-video-label">
            <span>🌍 English Tutorial</span>
          </div>
          <div className="cp-video-frame">
            {ENGLISH_URL
              ? <iframe src={ENGLISH_URL} title="English Tutorial" allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"/>
              : <div className="cp-coming-soon">
                  <div className="cp-cs-icon">🎬</div>
                  <div className="cp-cs-tag">COMING SOON</div>
                  <div className="cp-cs-title">VIDEO</div>
                  <div className="cp-cs-sub">English tutorial — link pending</div>
                </div>
            }
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="cp-body">

        {/* Sidebar */}
        <aside className="cp-sidebar">
          <div className="cp-sidebar-label">LESSONS</div>
          {LESSONS.map((l,i) => (
            <button
              key={i}
              className={`cp-sb-btn${active===i?" active":""}`}
              onClick={() => setActive(i)}
            >
              <span className="cp-sb-num">0{i+1}</span>
              <span className="cp-sb-name">{l.title}</span>
              <div className={`cp-sb-check${done[i]?" done":""}`}>{done[i]?"✓":""}</div>
            </button>
          ))}
        </aside>

        {/* Content */}
        <main className="cp-content">
          <div className="cp-lesson-eyebrow">LESSON {lesson.num} · {lesson.time}</div>
          <h2 className="cp-lesson-h2">{lesson.title}</h2>
          <p className="cp-lesson-desc">{lesson.desc}</p>

          {lesson.content.map((block,i) => {
            if (block.type === "alg") return (
              <div key={i} className="cp-alg-block">
                <div className="cp-alg-header">
                  <span className="cp-alg-label">{block.label || "Algorithm"}</span>
                  <button className="cp-alg-copy" onClick={()=>{navigator.clipboard?.writeText(block.moves);}}>Copy</button>
                </div>
                <div className="cp-alg-body">
                  <div className="cp-alg-moves">{block.moves}</div>
                  {block.name && <div className="cp-alg-note">{block.name}</div>}
                </div>
              </div>
            );
            if (block.type === "tip") return (
              <div key={i} className="cp-tip">
                <div className="cp-tip-icon">💡</div>
                <div className="cp-tip-text">{block.text}</div>
              </div>
            );
            if (block.type === "note") return (
              <div key={i} className="cp-tip" style={{background:"rgba(255,209,0,0.04)",borderColor:"rgba(255,209,0,0.1)"}}>
                <div className="cp-tip-icon">📌</div>
                <div className="cp-tip-text">{block.text}</div>
              </div>
            );
            return null;
          })}

          <button
            className={`cp-done-btn ${done[active]?"done":"undone"}`}
            onClick={() => toggleDone(active)}
          >
            {done[active] ? "✓  Completed — Undo" : "Mark as Complete"}
          </button>
        </main>
      </div>

      {/* ── FOOTER ── */}
      <footer className="cp-footer">
        <a href="/" className="cp-footer-logo">CUCHCO</a>
        <div className="cp-footer-socials">
          <a href="https://twitter.com"   target="_blank" rel="noreferrer" className="cp-footer-social"><TwitterIcon/></a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="cp-footer-social"><InstaIcon/></a>
          <a href="https://youtube.com"   target="_blank" rel="noreferrer" className="cp-footer-social"><YTIcon/></a>
          <a href="https://github.com"    target="_blank" rel="noreferrer" className="cp-footer-social"><GHIcon/></a>
        </div>
        <span className="cp-footer-copy">© {new Date().getFullYear()} Cuchco. All rights reserved.</span>
      </footer>
    </div>
  );
}
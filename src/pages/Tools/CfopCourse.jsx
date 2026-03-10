import { useState, useEffect } from "react";
import { FiHome, FiSun, FiMoon, FiMonitor } from "react-icons/fi";
import "./CoursePages.css";

const ACC      = "#FF5733";
const ACC_GLOW = "rgba(255,87,51,0.10)";

// Malayalam and English placeholders
const MALAYALAM_URL = "";
const ENGLISH_URL   = "";

const SECTIONS = [
  {
    id:"cross", label:"CROSS", color:"#FF5733",
    lessons:[
      { num:"01", title:"Cross Intuition",      time:"20 min", desc:"Plan the entire 4-edge cross before you make a move. Colour-neutral thinking, influencing F2L.", content:[
        {type:"tip",  text:"A good cross should be solved in 8 moves or fewer. Start by inspecting the cube for 15 seconds (WCA style) and plan all 4 edges in your head before touching it."},
        {type:"alg",  label:"Goal", moves:"4 bottom edges solved + matching centres", name:"No single algorithm — pure intuition."},
        {type:"note", text:"Colour neutrality: learn to start on white, yellow, OR any face. Solving on your easiest cross colour can save 2–4 moves every solve."},
      ]},
      { num:"02", title:"XCross",               time:"30 min", desc:"Solve the cross AND first F2L pair simultaneously — sub-6 second starts begin here.", content:[
        {type:"tip",  text:"Look for an F2L corner-edge pair that can be inserted while you're completing the last edge of the cross. With practice this becomes intuitive."},
        {type:"alg",  label:"Example XCross", moves:"y' R' F R F' d' L' U L", name:"Solves cross edge + inserts the pair in fewer total moves than doing them separately."},
      ]},
      { num:"03", title:"Colour Neutral Cross",  time:"25 min", desc:"Start on any face colour to find the most efficient cross each solve.", content:[
        {type:"note", text:"Full CN (6 colour neutral) is ideal but hard. 2CN (white+yellow) gives 80% of the benefit. Check both faces during inspection and pick whichever has a better cross."},
      ]},
    ]
  },
  {
    id:"f2l", label:"F2L", color:"#FFD100",
    lessons:[
      { num:"04", title:"F2L Fundamentals",     time:"30 min", desc:"Understand the 4 base cases and how corner+edge pairs work together.", content:[
        {type:"tip",  text:"F2L is about pairing the corner and edge in the U layer, then inserting them together. Always think: where is the corner? where is the edge? How do I connect them?"},
        {type:"alg",  label:"Standard pair (corner & edge both in U)", moves:"U R U' R'", name:"Basic right-side insert. Mirror: U' L' U L for left slot."},
        {type:"alg",  label:"Pair already connected", moves:"R U R'", name:"Direct insert — no setup needed."},
      ]},
      { num:"05", title:"All 41 F2L Cases",     time:"45 min", desc:"Every corner-edge combo with efficient algorithms. Drill until automatic.", content:[
        {type:"alg",  label:"Corner in slot, edge in U", moves:"R U' R' U R U R'", name:""},
        {type:"alg",  label:"Edge in slot, corner in U", moves:"R U R' U' R U R'  or  U R U2 R' U R U' R'", name:""},
        {type:"alg",  label:"Both in slot, wrong way", moves:"R U' R' U2 R U R' U R U' R'", name:"Eject and re-insert pair."},
        {type:"tip",  text:"For all 41 cases, refer to a full F2L sheet. Learning them in groups (corner correct orientation, edge correct orientation) is faster than memorising one by one."},
      ]},
      { num:"06", title:"Look-Ahead",            time:"60 min", desc:"Track the next F2L pair while inserting the current one — this separates sub-20 from sub-15.", content:[
        {type:"tip",  text:"While your hands do an insertion, your eyes should already be finding the next pair. Start slow — use pauses consciously. Over time, the pauses shrink to zero."},
        {type:"note", text:"Practise 'slow solves' at half your normal speed while keeping your eyes constantly moving to the next pair. This trains look-ahead faster than speed drills."},
      ]},
      { num:"07", title:"Advanced F2L",          time:"40 min", desc:"Influence OLL during F2L. Forced pairs. Multislotting. Empty slot strategies.", content:[
        {type:"alg",  label:"Influencing OLL (insert corner oriented)", moves:"R U' R' U' R U R'  instead of  R U R' U' R U R'", name:"Correct corner orientation during F2L eliminates the OLL corner step."},
        {type:"tip",  text:"Multislotting: use two adjacent F2L slots to influence each other. Solving slot 1 while setting up slot 2 can save 8–12 moves per solve."},
      ]},
    ]
  },
  {
    id:"oll", label:"OLL", color:"#B882FF",
    lessons:[
      { num:"08", title:"2-Look OLL",            time:"20 min", desc:"Solve OLL in 2 steps with just 9 algorithms — the fastest path to full 1-look.", content:[
        {type:"alg",  label:"Step 1: Edge Orientation (OLL Cross)", moves:"F R U R' U' F'  and  f R U R' U' f'", name:"Gets you 4 yellow edges up."},
        {type:"alg",  label:"Step 2: Corner Sune", moves:"R U R' U R U2 R'", name:"Sune"},
        {type:"alg",  label:"Step 2: Anti-Sune",   moves:"L' U' L U' L' U2 L", name:"Anti-Sune"},
        {type:"alg",  label:"Step 2: Pi (Bruno)",  moves:"R U2 R2' U' R2 U' R2' U2 R", name:"All 4 corners wrong"},
        {type:"alg",  label:"Step 2: H case",      moves:"F R U R' U' F' f R U R' U' f'", name:"Headlights on both sides"},
        {type:"alg",  label:"Step 2: T case",      moves:"r U R' U' r' F R F'", name:"T-shape"},
        {type:"alg",  label:"Step 2: U case",      moves:"R2 D R' U2 R D' R' U2 R'", name:"U-shape"},
      ]},
      { num:"09", title:"Full OLL — Groups 1–28", time:"45 min", desc:"Cross, dot, L-shapes, T-shapes, squares. First half of full 57-alg set.", content:[
        {type:"alg",  label:"OLL 1 — Cross (all edges flipped)", moves:"(R U2)(R2' F R F')(U2)(R' F R F')", name:""},
        {type:"alg",  label:"OLL 2 — Lightning", moves:"F R U R' U' F' f R U R' U' f'", name:""},
        {type:"alg",  label:"OLL 3 — Cross T", moves:"F R U R' U' F'", name:""},
        {type:"alg",  label:"OLL 4 — Cross L", moves:"f R U R' U' f'", name:""},
        {type:"alg",  label:"OLL 33 — P-shape", moves:"(R U R' U')(R' F R F')", name:""},
        {type:"alg",  label:"OLL 37 — Fish Salad", moves:"F R' F' R U R U' R'", name:""},
        {type:"alg",  label:"OLL 45 — T-case", moves:"F R U R' U' F'", name:""},
        {type:"tip",  text:"Learn by shape recognition, not number. Look at the yellow stickers on the side faces to identify each case instantly."},
      ]},
      { num:"10", title:"Full OLL — Groups 29–57", time:"45 min", desc:"Corners, fish, knight, and more. Complete the full 57-alg set.", content:[
        {type:"alg",  label:"OLL 21 — Sune", moves:"R U R' U R U2 R'", name:""},
        {type:"alg",  label:"OLL 22 — Anti-Sune", moves:"L' U' L U' L' U2 L", name:""},
        {type:"alg",  label:"OLL 26 — Headlights", moves:"R U2 R' U' R U' R'", name:""},
        {type:"alg",  label:"OLL 27 — Pi (Bruno)", moves:"R U2 R2' U' R2 U' R2' U2 R", name:""},
        {type:"alg",  label:"OLL 29 — Knight", moves:"M U R U R' U' R' F R F' M'", name:""},
        {type:"alg",  label:"OLL 57 — Skip", moves:"—", name:"All yellow — execute PLL directly!"},
        {type:"note", text:"The full 57 OLLs take weeks to master. Prioritise the most common ones (Sune family, T-case, cross cases) first."},
      ]},
    ]
  },
  {
    id:"pll", label:"PLL", color:"#00C4D4",
    lessons:[
      { num:"11", title:"2-Look PLL",            time:"20 min", desc:"Solve PLL in 2 steps using just 6 algorithms.", content:[
        {type:"alg",  label:"Step 1: Corner 3-cycle (Y-perm)", moves:"F R U' R' U' R U R' F' R U R' U' R' F R F'", name:""},
        {type:"alg",  label:"Step 1: Corner 3-cycle (A-perm a)", moves:"x R' U R' D2 R U' R' D2 R2 x'", name:""},
        {type:"alg",  label:"Step 2: U-perm a", moves:"R U' R U R U R U' R' U' R2", name:"3 edges counter-clockwise"},
        {type:"alg",  label:"Step 2: U-perm b", moves:"R2 U R U R' U' R' U' R' U R'", name:"3 edges clockwise"},
        {type:"alg",  label:"Step 2: H-perm", moves:"M2 U M2 U2 M2 U M2", name:"Swap opposite edges"},
        {type:"alg",  label:"Step 2: Z-perm", moves:"M2 U M2 U M' U2 M2 U2 M' U2", name:"Swap adjacent edges"},
      ]},
      { num:"12", title:"Full PLL — All 21 Perms", time:"60 min", desc:"All 21 PLL algorithms. Sub-20 solvers know these cold.", content:[
        {type:"alg",  label:"T-perm", moves:"R U R' U' R' F R2 U' R' U' R U R' F'", name:"Adjacent corner + edge swap"},
        {type:"alg",  label:"J-perm a", moves:"x' R2 F R F' R U2 r' U r U2 x", name:""},
        {type:"alg",  label:"J-perm b", moves:"R U R' F' R U R' U' R' F R2 U' R'", name:""},
        {type:"alg",  label:"F-perm", moves:"R' U' F' R U R' U' R' F R2 U' R' U' R U R' U R", name:""},
        {type:"alg",  label:"R-perm a", moves:"R U' R' U' R U R D R' U' R D' R' U2 R' U'", name:""},
        {type:"alg",  label:"R-perm b", moves:"R' U2 R U2 R' F R U R' U' R' F' R2 U'", name:""},
        {type:"alg",  label:"Y-perm", moves:"F R U' R' U' R U R' F' R U R' U' R' F R F'", name:"Diagonal corners"},
        {type:"alg",  label:"E-perm", moves:"x' R U' R' D R U R' D' R U R' D R U' R' D' x", name:"Diagonal corner swap"},
        {type:"alg",  label:"V-perm", moves:"R' U R' U' y R' F' R2 U' R' U R' F R F", name:""},
        {type:"alg",  label:"N-perm a", moves:"R U R' U R U R' F' R U R' U' R' F R2 U' R' U2 R U' R'", name:""},
        {type:"alg",  label:"G-perm a", moves:"R2 U R' U R' U' R U' R2 D U' R' U R D'", name:""},
        {type:"alg",  label:"Z-perm", moves:"M2 U M2 U M' U2 M2 U2 M' U2", name:"Adjacent edge swap"},
        {type:"alg",  label:"H-perm", moves:"M2 U M2 U2 M2 U M2", name:"Opposite edge swap"},
        {type:"alg",  label:"A-perm a", moves:"x R' U R' D2 R U' R' D2 R2 x'", name:""},
        {type:"alg",  label:"A-perm b", moves:"x R2 D2 R U R' D2 R U' R x'", name:""},
        {type:"alg",  label:"Skip (PLL skip)", moves:"—", name:"Cube is solved after OLL! Lucky!"},
        {type:"note", text:"Learn the PLLs in groups: edges only (U, H, Z), corners only (A, E), then adjacent pairs (T, J, F, R). This is 80% of all PLLs you'll see."},
      ]},
    ]
  },
  {
    id:"advanced", label:"ADVANCED", color:"#22c55e",
    lessons:[
      { num:"13", title:"Fingertricks",          time:"30 min", desc:"The difference between sub-20 and sub-15 is mostly fingertricks.", content:[
        {type:"tip",  text:"The right-hand sexy move (R U R' U') should be 1 second or faster using index-finger trigger. Practise in isolation until it's muscle memory."},
        {type:"alg",  label:"Key Fingertrick Moves", moves:"R U R' — index trigger · U — ring push · M — thumb pull", name:""},
      ]},
      { num:"14", title:"Full CFOP Optimization", time:"60 min", desc:"Combining all elements: inspection, XCross, influence OLL, fast recognition.", content:[
        {type:"tip",  text:"Use your entire 15 second inspection time. Plan your cross + identify your first F2L pair before you start. This alone can shave 5+ seconds."},
        {type:"note", text:"At sub-20 level: average cross 1.5s, F2L 9s, OLL 2s, PLL 2s = ~15s. Every second saved in one step can be offset by rushing another. Find your weak phase."},
      ]},
      { num:"15", title:"Sub-20 & Beyond",        time:"∞", desc:"Practice frameworks, solve analysis, and the path from sub-20 to sub-15 to sub-10.", content:[
        {type:"tip",  text:"Reconstruct your own solves using a scramble log. Identify where you pause, where look-ahead breaks down, and what algorithms you're hesitating on."},
        {type:"note", text:"Sub-10 requires: full CN, full OLL+PLL recognition in ~0.5s, near-zero pauses in F2L. It's achievable in 1–3 years of consistent dedicated practice."},
      ]},
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

export default function CfopCourse() {
  const [theme,    setTheme]    = useState(() => localStorage.getItem("cuchco-theme") || "dark");
  const [section,  setSection]  = useState(0);
  const [lessonIdx,setLessonIdx]= useState(0);
  const [done,     setDone]     = useState({});

  useEffect(() => {
    const t = theme === "system"
      ? (window.matchMedia("(prefers-color-scheme:light)").matches ? "light" : "dark") : theme;
    document.documentElement.setAttribute("data-theme", t);
    localStorage.setItem("cuchco-theme", theme);
  }, [theme]);

  const sec    = SECTIONS[section];
  const lesson = sec.lessons[lessonIdx];
  const totalL = SECTIONS.reduce((a,s)=>a+s.lessons.length, 0);
  const doneC  = Object.values(done).filter(Boolean).length;
  const lessonKey = `${section}-${lessonIdx}`;

  const goToLesson = (si, li) => { setSection(si); setLessonIdx(li); };

  return (
    <div className="cp-root" style={{"--acc": sec.color, "--acc-glow": "rgba(255,87,51,0.1)"}}>

      {/* ── NAV ── */}
      <nav className="cp-nav">
        <a href="/" className="cp-nav-home" title="Home"><FiHome size={17}/></a>
        <div className="cp-nav-div"/>
        <span className="cp-nav-brand">CUCHCO</span>
        <span className="cp-nav-slash">/</span>
        <span className="cp-nav-title">CFOP COURSE</span>
        <div className="cp-nav-gap"/>
        <div className="cp-theme-toggle">
          <button className={`cp-t-btn${theme==="light"?" on":""}`}  onClick={()=>setTheme("light")}><SunIcon/></button>
          <button className={`cp-t-btn${theme==="system"?" on":""}`} onClick={()=>setTheme("system")}><MonitorIcon/></button>
          <button className={`cp-t-btn${theme==="dark"?" on":""}`}   onClick={()=>setTheme("dark")}><MoonIcon/></button>
        </div>
        <a href="/cube" className="cp-nav-back">← Cube</a>
      </nav>

      {/* ── HERO ── */}
      <div className="cp-hero" style={{"--acc": ACC, "--acc-glow": ACC_GLOW}}>
        <div className="cp-hero-eyebrow">CFOP SPEEDSOLVING COURSE</div>
        <h1 className="cp-hero-h1">CROSS · F2L<br/><span style={{color:ACC}}>OLL · PLL</span></h1>
        <p className="cp-hero-sub">15 lessons from white-cross intuition to sub-20 solves. Learn the method used by every world record holder.</p>
        <div className="cp-progress-wrap">
          <div className="cp-progress-track">
            <div className="cp-progress-fill" style={{width:`${(doneC/totalL)*100}%`, background:ACC}}/>
          </div>
          <div className="cp-progress-label">{doneC} / {totalL} LESSONS COMPLETE</div>
        </div>
      </div>

      {/* ── VIDEO SECTION ── */}
      <div className="cp-videos">
        <div className="cp-video-block">
          <div className="cp-video-label"><span className="cp-video-badge">MALAYALAM</span><span className="cp-video-title">🇮🇳 Tutorial</span></div>
          <div className="cp-video-frame">
            {MALAYALAM_URL
              ? <iframe src={MALAYALAM_URL} title="Malayalam CFOP Tutorial" allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"/>
              : <div className="cp-coming-soon"><div className="cp-cs-icon">🎬</div><div className="cp-cs-tag">COMING SOON</div><div className="cp-cs-title">VIDEO</div><div className="cp-cs-sub">Malayalam CFOP video</div></div>
            }
          </div>
        </div>
        <div className="cp-video-block">
          <div className="cp-video-label"><span className="cp-video-badge">ENGLISH</span><span className="cp-video-title">🌍 Tutorial</span></div>
          <div className="cp-video-frame">
            {ENGLISH_URL
              ? <iframe src={ENGLISH_URL} title="English CFOP Tutorial" allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"/>
              : <div className="cp-coming-soon"><div className="cp-cs-icon">🎬</div><div className="cp-cs-tag">COMING SOON</div><div className="cp-cs-title">VIDEO</div><div className="cp-cs-sub">English CFOP video</div></div>
            }
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="cp-body">

        {/* Sidebar */}
        <aside className="cp-sidebar">
          {SECTIONS.map((s, si) => (
            <div key={si}>
              <div className="cp-sb-section" style={{color: s.color}}>{s.label}</div>
              {s.lessons.map((l, li) => {
                const key = `${si}-${li}`;
                return (
                  <button
                    key={li}
                    className={`cp-sb-btn${section===si&&lessonIdx===li?" active":""}`}
                    style={section===si&&lessonIdx===li?{"--acc":s.color}:{}}
                    onClick={() => goToLesson(si, li)}
                  >
                    <span className="cp-sb-num">{l.num}</span>
                    <span className="cp-sb-name">{l.title}</span>
                    <div className={`cp-sb-check${done[key]?" done":""}`} style={done[key]?{background:s.color,borderColor:s.color}:{}}>{done[key]?"✓":""}</div>
                  </button>
                );
              })}
            </div>
          ))}
        </aside>

        {/* Content */}
        <main className="cp-content" style={{"--acc": sec.color}}>
          <div className="cp-lesson-eyebrow" style={{color: sec.color}}>{sec.label} · LESSON {lesson.num} · {lesson.time}</div>
          <h2 className="cp-lesson-h2">{lesson.title}</h2>
          <p className="cp-lesson-desc">{lesson.desc}</p>

          {lesson.content.map((block, i) => {
            if (block.type === "alg") return (
              <div key={i} className="cp-alg-block">
                <div className="cp-alg-header">
                  <span className="cp-alg-label">{block.label || "Algorithm"}</span>
                  <button className="cp-alg-copy" onClick={()=>{navigator.clipboard?.writeText(block.moves);}}>Copy</button>
                </div>
                <div className="cp-alg-body">
                  <div className="cp-alg-moves" style={{color:sec.color}}>{block.moves}</div>
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
              <div key={i} className="cp-tip" style={{background:"rgba(255,209,0,0.04)", borderColor:"rgba(255,209,0,0.12)"}}>
                <div className="cp-tip-icon">📌</div>
                <div className="cp-tip-text">{block.text}</div>
              </div>
            );
            return null;
          })}

          <button
            className={`cp-done-btn ${done[lessonKey]?"done":"undone"}`}
            style={!done[lessonKey]?{background: sec.color}:{}}
            onClick={() => setDone(d => ({...d, [lessonKey]: !d[lessonKey]}))}
          >
            {done[lessonKey] ? "✓  Completed — Undo" : "Mark as Complete"}
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
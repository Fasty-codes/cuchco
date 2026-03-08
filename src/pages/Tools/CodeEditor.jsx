// import { useState, useRef, useEffect, useCallback } from "react";
// import "./CodeEditor.css";

// /* ============================================================
//    STARTER TEMPLATES
//    ============================================================ */
// const TEMPLATES = {
//   blank: {
//     label: "Blank",
//     html: `<!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8"/>
//   <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
//   <title>My Page</title>
// </head>
// <body>
//   <h1>Hello World!</h1>
// </body>
// </html>`,
//     css: `body {
//   font-family: sans-serif;
//   margin: 40px;
//   background: #fff;
//   color: #111;
// }`,
//     js: `// Your JavaScript here
// console.log("Hello from JS!");`,
//   },
//   card: {
//     label: "Profile Card",
//     html: `<div class="card">
//   <div class="avatar">😎</div>
//   <h2 class="name">Alex Dev</h2>
//   <p class="role">Full Stack Developer</p>
//   <div class="tags">
//     <span>HTML</span>
//     <span>CSS</span>
//     <span>JS</span>
//   </div>
//   <button class="follow-btn" onclick="toggle(this)">Follow</button>
// </div>`,
//     css: `* { box-sizing: border-box; margin: 0; padding: 0; }
// body {
//   min-height: 100vh;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   background: linear-gradient(135deg, #0A0A0A, #1C1C1C);
//   font-family: 'Segoe UI', sans-serif;
// }
// .card {
//   background: #1C1C1C;
//   border: 1px solid #333;
//   border-radius: 16px;
//   padding: 40px 32px;
//   text-align: center;
//   width: 280px;
//   box-shadow: 0 20px 60px rgba(0,0,0,0.5);
//   transition: transform 0.3s;
// }
// .card:hover { transform: translateY(-6px); }
// .avatar { font-size: 4rem; margin-bottom: 16px; }
// .name { color: #fff; font-size: 1.4rem; margin-bottom: 6px; }
// .role { color: #888; font-size: 0.85rem; margin-bottom: 20px; }
// .tags { display: flex; gap: 8px; justify-content: center; margin-bottom: 24px; }
// .tags span { background: rgba(255,209,0,0.1); color: #FFD100; padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; }
// .follow-btn {
//   width: 100%; padding: 12px;
//   background: #FFD100; color: #0A0A0A;
//   border: none; border-radius: 8px;
//   font-weight: 700; font-size: 0.9rem;
//   cursor: pointer; transition: all 0.2s;
// }
// .follow-btn:hover { background: #e6bc00; transform: scale(1.02); }
// .follow-btn.following { background: transparent; color: #FFD100; border: 2px solid #FFD100; }`,
//     js: `function toggle(btn) {
//   btn.classList.toggle('following');
//   btn.textContent = btn.classList.contains('following')
//     ? 'Following ✓' : 'Follow';
// }`,
//   },
//   animation: {
//     label: "CSS Animation",
//     html: `<div class="scene">
//   <div class="cube-3d">
//     <div class="face front">F</div>
//     <div class="face back">B</div>
//     <div class="face left">L</div>
//     <div class="face right">R</div>
//     <div class="face top">T</div>
//     <div class="face bottom">Bo</div>
//   </div>
// </div>
// <p class="label">Hover to pause</p>`,
//     css: `* { box-sizing: border-box; margin: 0; padding: 0; }
// body {
//   min-height: 100vh;
//   display: flex; flex-direction: column;
//   align-items: center; justify-content: center;
//   background: #0A0A0A;
//   font-family: sans-serif;
// }
// .scene {
//   width: 120px; height: 120px;
//   perspective: 500px;
//   margin-bottom: 24px;
// }
// .cube-3d {
//   width: 100%; height: 100%;
//   position: relative;
//   transform-style: preserve-3d;
//   animation: spin3d 4s infinite linear;
//   transform-origin: center center;
// }
// .scene:hover .cube-3d { animation-play-state: paused; }
// .face {
//   position: absolute;
//   width: 120px; height: 120px;
//   display: flex; align-items: center; justify-content: center;
//   font-size: 1.4rem; font-weight: 700;
//   border: 2px solid rgba(255,255,255,0.15);
//   border-radius: 4px;
// }
// .front  { background: rgba(255,87,51,0.8);  transform: translateZ(60px); color:#fff; }
// .back   { background: rgba(0,70,173,0.8);   transform: rotateY(180deg) translateZ(60px); color:#fff; }
// .left   { background: rgba(255,88,0,0.8);   transform: rotateY(-90deg) translateZ(60px); color:#fff; }
// .right  { background: rgba(196,30,58,0.8);  transform: rotateY(90deg) translateZ(60px); color:#fff; }
// .top    { background: rgba(255,209,0,0.85); transform: rotateX(90deg) translateZ(60px); color:#000; }
// .bottom { background: rgba(0,165,80,0.8);   transform: rotateX(-90deg) translateZ(60px); color:#fff; }
// @keyframes spin3d {
//   from { transform: rotateX(20deg) rotateY(0deg); }
//   to   { transform: rotateX(20deg) rotateY(360deg); }
// }
// .label { color: #555; font-size: 0.8rem; letter-spacing: 2px; text-transform: uppercase; }`,
//     js: `// CSS animation — no JS needed for this one!
// console.log("Pure CSS 3D cube ✨");`,
//   },
//   counter: {
//     label: "JS Counter",
//     html: `<div class="app">
//   <h1>Counter App</h1>
//   <div class="counter-display" id="display">0</div>
//   <div class="btns">
//     <button onclick="change(-1)" class="btn minus">−</button>
//     <button onclick="reset()"   class="btn reset">Reset</button>
//     <button onclick="change(1)"  class="btn plus">+</button>
//   </div>
//   <p id="msg" class="msg"></p>
// </div>`,
//     css: `* { box-sizing:border-box; margin:0; padding:0; }
// body {
//   min-height:100vh; display:flex;
//   align-items:center; justify-content:center;
//   background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
//   font-family: 'Segoe UI', sans-serif;
// }
// .app { text-align:center; }
// h1 { color:#fff; font-size:1.6rem; margin-bottom:32px; letter-spacing:3px; opacity:0.7; }
// .counter-display {
//   font-size:6rem; font-weight:900; color:#FFD100;
//   margin-bottom:32px;
//   transition: transform 0.15s, color 0.3s;
//   text-shadow: 0 0 40px rgba(255,209,0,0.4);
// }
// .btns { display:flex; gap:16px; justify-content:center; margin-bottom:20px; }
// .btn {
//   width:60px; height:60px; border:none; border-radius:50%;
//   font-size:1.5rem; font-weight:bold; cursor:pointer;
//   transition:all 0.15s; box-shadow:0 4px 12px rgba(0,0,0,0.3);
// }
// .plus  { background:#4caf50; color:#fff; }
// .minus { background:#f44336; color:#fff; }
// .reset { background:#555; color:#fff; font-size:0.75rem; }
// .btn:hover { transform:scale(1.12); }
// .btn:active { transform:scale(0.95); }
// .msg { color:#aaa; font-size:0.85rem; letter-spacing:1px; min-height:20px; }`,
//     js: `let count = 0;
// const display = document.getElementById('display');
// const msg = document.getElementById('msg');

// function update() {
//   display.textContent = count;
//   display.style.color = count > 0 ? '#4caf50' : count < 0 ? '#f44336' : '#FFD100';
//   display.style.transform = 'scale(1.15)';
//   setTimeout(() => display.style.transform = 'scale(1)', 150);
//   msg.textContent = count === 0 ? '🎯 Zero' : count > 10 ? '🔥 Going up!' : count < -10 ? '❄️ Going down!' : '';
// }

// function change(n) { count += n; update(); }
// function reset()   { count = 0;  update(); }`,
//   },
// };

// /* ============================================================
//    EDITOR TABS
//    ============================================================ */
// const TABS = ["html","css","js"];
// const TAB_COLORS = { html:"#FF5733", css:"#00C4D4", js:"#FFD100" };

// /* ============================================================
//    MAIN COMPONENT
//    ============================================================ */
// export default function CodeEditor() {
//   const [activeTab,   setActiveTab]   = useState("html");
//   const [template,    setTemplate]    = useState("blank");
//   const [code,        setCode]        = useState({ ...TEMPLATES.blank });
//   const [autoRun,     setAutoRun]     = useState(true);
//   const [previewSrc,  setPreviewSrc]  = useState("");
//   const [layout,      setLayout]      = useState("split"); // split | editor | preview
//   const [fontSize,    setFontSize]    = useState(14);
//   const [copied,      setCopied]      = useState(false);
//   const iframeRef   = useRef(null);
//   const textareaRef = useRef(null);

//   // Build preview HTML
//   const buildPreview = useCallback((c) => {
//     return `<!DOCTYPE html>
// <html>
// <head>
// <meta charset="UTF-8"/>
// <style>${c.css}</style>
// </head>
// <body>
// ${c.html}
// <script>
// try { ${c.js} } catch(e){ console.error(e); }
// </script>
// </body>
// </html>`;
//   }, []);

//   // Run preview
//   const runPreview = useCallback(() => {
//     setPreviewSrc(buildPreview(code));
//   }, [code, buildPreview]);

//   // Auto-run on code change
//   useEffect(() => {
//     if (!autoRun) return;
//     const t = setTimeout(runPreview, 600);
//     return () => clearTimeout(t);
//   }, [code, autoRun, runPreview]);

//   // Initial run — eslint-disable-next-line is intentional: we only want this once on mount
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   useEffect(() => { runPreview(); }, []);

//   const handleCodeChange = (e) => {
//     setCode(prev => ({ ...prev, [activeTab]: e.target.value }));
//   };

//   const loadTemplate = (key) => {
//     setTemplate(key);
//     setCode({ ...TEMPLATES[key] });
//   };

//   const handleKeyDown = (e) => {
//     // Tab key inserts spaces
//     if (e.key === "Tab") {
//       e.preventDefault();
//       const ta = e.target;
//       const start = ta.selectionStart;
//       const end   = ta.selectionEnd;
//       const newVal = ta.value.substring(0,start) + "  " + ta.value.substring(end);
//       setCode(prev => ({ ...prev, [activeTab]: newVal }));
//       setTimeout(() => { ta.selectionStart = ta.selectionEnd = start + 2; }, 0);
//     }
//   };

//   const copyCode = () => {
//     navigator.clipboard.writeText(code[activeTab]);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   const lineCount = (code[activeTab] || "").split("\n").length;

//   return (
//     <div className="tool-page editor-page">
//       {/* Header */}
//       <div className="tool-header editor-header">
//         <a href="/" className="tool-back">← Back</a>
//         <div>
//           <div className="tool-eyebrow">💻 Cuchco Tools</div>
//           <h1 className="tool-title">CODE PLAYGROUND</h1>
//           <p className="tool-sub">Live HTML · CSS · JS editor with instant preview</p>
//         </div>

//         {/* Header controls */}
//         <div className="editor-header-controls">
//           {/* Templates */}
//           <div className="template-select-wrap">
//             <span className="ctrl-label-inline">Template</span>
//             <select
//               className="template-select"
//               value={template}
//               onChange={e => loadTemplate(e.target.value)}
//             >
//               {Object.entries(TEMPLATES).map(([k,v]) => (
//                 <option key={k} value={k}>{v.label}</option>
//               ))}
//             </select>
//           </div>

//           {/* Layout toggle */}
//           <div className="layout-toggle">
//             {[["split","⬛⬜"],["editor","📝"],["preview","👁"]].map(([v,l]) => (
//               <button
//                 key={v}
//                 className={`layout-btn${layout===v?" active":""}`}
//                 onClick={() => setLayout(v)}
//                 title={v}
//               >
//                 {l}
//               </button>
//             ))}
//           </div>

//           {/* Auto-run toggle */}
//           <button
//             className={`auto-run-btn${autoRun?" on":""}`}
//             onClick={() => setAutoRun(v => !v)}
//           >
//             {autoRun ? "⚡ Auto" : "⏸ Manual"}
//           </button>

//           {/* Run button */}
//           {!autoRun && (
//             <button className="run-btn" onClick={runPreview}>▶ Run</button>
//           )}
//         </div>
//       </div>

//       {/* Main area */}
//       <div className={`editor-layout layout-${layout}`}>

//         {/* ── Editor panel ── */}
//         {layout !== "preview" && (
//           <div className="editor-panel">
//             {/* Language tabs */}
//             <div className="editor-tabs">
//               {TABS.map(tab => (
//                 <button
//                   key={tab}
//                   className={`editor-tab${activeTab===tab?" active":""}`}
//                   style={{ "--tab-color": TAB_COLORS[tab] }}
//                   onClick={() => setActiveTab(tab)}
//                 >
//                   {tab.toUpperCase()}
//                   <span className="tab-dot" style={{ background: TAB_COLORS[tab] }}/>
//                 </button>
//               ))}

//               <div className="editor-tab-right">
//                 <span className="line-count">{lineCount} lines</span>
//                 <button className="font-btn" onClick={() => setFontSize(s => Math.max(10,s-1))}>A−</button>
//                 <button className="font-btn" onClick={() => setFontSize(s => Math.min(22,s+1))}>A+</button>
//                 <button className="copy-btn" onClick={copyCode}>{copied ? "✓ Copied!" : "Copy"}</button>
//               </div>
//             </div>

//             {/* Code area with line numbers */}
//             <div className="code-area">
//               <div className="line-nums">
//                 {Array.from({length: lineCount}, (_,i) => (
//                   <div key={i} className="line-num">{i+1}</div>
//                 ))}
//               </div>
//               <textarea
//                 ref={textareaRef}
//                 className="code-textarea"
//                 value={code[activeTab]}
//                 onChange={handleCodeChange}
//                 onKeyDown={handleKeyDown}
//                 spellCheck={false}
//                 autoComplete="off"
//                 autoCorrect="off"
//                 autoCapitalize="off"
//                 style={{ fontSize: `${fontSize}px` }}
//               />
//             </div>
//           </div>
//         )}

//         {/* ── Preview panel ── */}
//         {layout !== "editor" && (
//           <div className="preview-panel">
//             <div className="preview-bar">
//               <div className="preview-dots">
//                 <span className="pd red"/>
//                 <span className="pd yellow"/>
//                 <span className="pd green"/>
//               </div>
//               <div className="preview-label">LIVE PREVIEW</div>
//               <button className="preview-open-btn" onClick={() => {
//                 const w = window.open(); w.document.write(buildPreview(code));
//               }}>
//                 ↗ Open
//               </button>
//             </div>
//             <iframe
//               ref={iframeRef}
//               className="preview-iframe"
//               title="preview"
//               srcDoc={previewSrc}
//               sandbox="allow-scripts allow-same-origin"
//             />
//           </div>
//         )}
//       </div>

//       {/* Status bar */}
//       <div className="editor-statusbar">
//         <span className="status-lang">{activeTab.toUpperCase()}</span>
//         <span className="status-size">Font: {fontSize}px</span>
//         <span className="status-auto">{autoRun ? "⚡ Auto-run ON" : "⏸ Auto-run OFF"}</span>
//         <span className="status-template">Template: {TEMPLATES[template].label}</span>
//       </div>
//     </div>
//   );
// }

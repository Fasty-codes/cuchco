// import { useState } from "react";
// import "./CubeSolver.css";

// export default function CubeSolver() {
//   const [scramble, setScramble] = useState("");

//   return (
//     <div className="cube-solver-page">
//       <div className="tool-header">
//         <h1>🧩 CUBE SOLVER</h1>
//         <p>Interactive 3D Rubik's Cube solver and visualizer</p>
//       </div>
      
//       <div className="tool-content">
//         <div className="solver-section">
//           <h2>Enter Scramble</h2>
//           <input
//             type="text"
//             placeholder="e.g., R U R' U'"
//             value={scramble}
//             onChange={(e) => setScramble(e.target.value)}
//             className="scramble-input"
//           />
//           <button className="solve-btn">Solve Cube</button>
//         </div>

//         <div className="cube-display">
//           <div className="cube-placeholder">
//             <div className="cube-face front">F</div>
//             <div className="cube-face back">B</div>
//             <div className="cube-face left">L</div>
//             <div className="cube-face right">R</div>
//             <div className="cube-face top">U</div>
//             <div className="cube-face bottom">D</div>
//           </div>
//         </div>

//         <div className="features">
//           <h3>Features</h3>
//           <ul>
//             <li>🎯 Step-by-step solution</li>
//             <li>⏱️ Speed timer with statistics</li>
//             <li>📚 Algorithm library</li>
//             <li>🏆 Progress tracking</li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// }

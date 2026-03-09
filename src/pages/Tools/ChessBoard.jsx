// import { useState } from "react";
// import "./ChessBoard.css";

// export default function ChessBoard() {
//   const [position, setPosition] = useState("start");

//   return (
//     <div className="chess-board-page">
//       <div className="tool-header">
//         <h1>♟️ CHESS BOARD</h1>
//         <p>Play and analyze games interactively</p>
//       </div>
      
//       <div className="tool-content">
//         <div className="board-section">
//           <div className="chess-board-placeholder">
//             <div className="chess-squares">
//               {Array.from({length: 64}, (_, i) => (
//                 <div key={i} className={`square ${(Math.floor(i/8) + i) % 2 === 0 ? 'light' : 'dark'}`}>
//                   {i === 0 && '♜'} {i === 1 && '♞'} {i === 2 && '♝'} {i === 3 && '♛'} {i === 4 && '♚'} {i === 5 && '♝'} {i === 6 && '♞'} {i === 7 && '♜'}
//                   {i === 56 && '♖'} {i === 57 && '♘'} {i === 58 && '♗'} {i === 59 && '♕'} {i === 60 && '♔'} {i === 61 && '♗'} {i === 62 && '♘'} {i === 63 && '♖'}
//                   {i === 8 && '♟'} {i === 9 && '♟'} {i === 10 && '♟'} {i === 11 && '♟'} {i === 12 && '♟'} {i === 13 && '♟'} {i === 14 && '♟'} {i === 15 && '♟'}
//                   {i === 48 && '♙'} {i === 49 && '♙'} {i === 50 && '♙'} {i === 51 && '♙'} {i === 52 && '♙'} {i === 53 && '♙'} {i === 54 && '♙'} {i === 55 && '♙'}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         <div className="controls">
//           <button className="control-btn">New Game</button>
//           <button className="control-btn">Analyze</button>
//           <button className="control-btn">Puzzle Mode</button>
//         </div>

//         <div className="features">
//           <h3>Features</h3>
//           <ul>
//             <li>🧩 Daily puzzle trainer</li>
//             <li>📊 Game analysis with engine hints</li>
//             <li>📚 Opening explorer</li>
//             <li>🎯 Endgame studies</li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// }

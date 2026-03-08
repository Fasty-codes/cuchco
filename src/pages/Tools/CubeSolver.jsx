import { useState, useCallback } from "react";
import "./CubeSolver.css";

/* ============================================================
   CUBE LOGIC
   A cube state is 6 faces × 9 stickers = 54 values
   Faces: U=0 D=1 F=2 B=3 L=4 R=5
   Colors: W Y G B O R
   ============================================================ */
const COLORS = { W:"#FFFFFF", Y:"#FFD100", G:"#00A550", B:"#0046AD", O:"#FF5800", R:"#C41E3A" };
const FACE_NAMES = ["U","D","F","B","L","R"];
const FACE_COLORS = { U:"W", D:"Y", F:"G", B:"B", L:"O", R:"R" };

function initCube() {
  // Each face: 9 stickers all same color
  return {
    U: Array(9).fill("W"),
    D: Array(9).fill("Y"),
    F: Array(9).fill("G"),
    B: Array(9).fill("B"),
    L: Array(9).fill("O"),
    R: Array(9).fill("R"),
  };
}

function cloneCube(c) {
  return { U:[...c.U], D:[...c.D], F:[...c.F], B:[...c.B], L:[...c.L], R:[...c.R] };
}

function rotateFaceCW(face) {
  // Rotate a 3×3 face clockwise
  return [
    face[6],face[3],face[0],
    face[7],face[4],face[1],
    face[8],face[5],face[2],
  ];
}
function rotateFaceCCW(face) {
  return [
    face[2],face[5],face[8],
    face[1],face[4],face[7],
    face[0],face[3],face[6],
  ];
}

// Apply a single move to a cube state
function applyMove(cube, move) {
  const c = cloneCube(cube);
  switch(move) {
    case "U": {
      c.U = rotateFaceCW(cube.U);
      [c.F[0],c.F[1],c.F[2]] = [cube.R[0],cube.R[1],cube.R[2]];
      [c.L[0],c.L[1],c.L[2]] = [cube.F[0],cube.F[1],cube.F[2]];
      [c.B[0],c.B[1],c.B[2]] = [cube.L[0],cube.L[1],cube.L[2]];
      [c.R[0],c.R[1],c.R[2]] = [cube.B[0],cube.B[1],cube.B[2]];
      break;
    }
    case "U'": {
      c.U = rotateFaceCCW(cube.U);
      [c.F[0],c.F[1],c.F[2]] = [cube.L[0],cube.L[1],cube.L[2]];
      [c.R[0],c.R[1],c.R[2]] = [cube.F[0],cube.F[1],cube.F[2]];
      [c.B[0],c.B[1],c.B[2]] = [cube.R[0],cube.R[1],cube.R[2]];
      [c.L[0],c.L[1],c.L[2]] = [cube.B[0],cube.B[1],cube.B[2]];
      break;
    }
    case "D": {
      c.D = rotateFaceCW(cube.D);
      [c.F[6],c.F[7],c.F[8]] = [cube.L[6],cube.L[7],cube.L[8]];
      [c.R[6],c.R[7],c.R[8]] = [cube.F[6],cube.F[7],cube.F[8]];
      [c.B[6],c.B[7],c.B[8]] = [cube.R[6],cube.R[7],cube.R[8]];
      [c.L[6],c.L[7],c.L[8]] = [cube.B[6],cube.B[7],cube.B[8]];
      break;
    }
    case "D'": {
      c.D = rotateFaceCCW(cube.D);
      [c.F[6],c.F[7],c.F[8]] = [cube.R[6],cube.R[7],cube.R[8]];
      [c.L[6],c.L[7],c.L[8]] = [cube.F[6],cube.F[7],cube.F[8]];
      [c.B[6],c.B[7],c.B[8]] = [cube.L[6],cube.L[7],cube.L[8]];
      [c.R[6],c.R[7],c.R[8]] = [cube.B[6],cube.B[7],cube.B[8]];
      break;
    }
    case "R": {
      c.R = rotateFaceCW(cube.R);
      [c.U[2],c.U[5],c.U[8]] = [cube.F[2],cube.F[5],cube.F[8]];
      [c.B[0],c.B[3],c.B[6]] = [cube.U[8],cube.U[5],cube.U[2]];
      [c.D[2],c.D[5],c.D[8]] = [cube.B[6],cube.B[3],cube.B[0]];
      [c.F[2],c.F[5],c.F[8]] = [cube.D[2],cube.D[5],cube.D[8]];
      break;
    }
    case "R'": {
      c.R = rotateFaceCCW(cube.R);
      [c.F[2],c.F[5],c.F[8]] = [cube.U[2],cube.U[5],cube.U[8]];
      [c.D[2],c.D[5],c.D[8]] = [cube.F[2],cube.F[5],cube.F[8]];
      [c.B[0],c.B[3],c.B[6]] = [cube.D[8],cube.D[5],cube.D[2]];
      [c.U[2],c.U[5],c.U[8]] = [cube.B[6],cube.B[3],cube.B[0]];
      break;
    }
    case "L": {
      c.L = rotateFaceCW(cube.L);
      [c.U[0],c.U[3],c.U[6]] = [cube.B[8],cube.B[5],cube.B[2]];
      [c.F[0],c.F[3],c.F[6]] = [cube.U[0],cube.U[3],cube.U[6]];
      [c.D[0],c.D[3],c.D[6]] = [cube.F[0],cube.F[3],cube.F[6]];
      [c.B[2],c.B[5],c.B[8]] = [cube.D[6],cube.D[3],cube.D[0]];
      break;
    }
    case "L'": {
      c.L = rotateFaceCCW(cube.L);
      [c.U[0],c.U[3],c.U[6]] = [cube.F[0],cube.F[3],cube.F[6]];
      [c.B[2],c.B[5],c.B[8]] = [cube.U[6],cube.U[3],cube.U[0]];
      [c.D[0],c.D[3],c.D[6]] = [cube.B[8],cube.B[5],cube.B[2]];
      [c.F[0],c.F[3],c.F[6]] = [cube.D[0],cube.D[3],cube.D[6]];
      break;
    }
    case "F": {
      c.F = rotateFaceCW(cube.F);
      [c.U[6],c.U[7],c.U[8]] = [cube.L[8],cube.L[5],cube.L[2]];
      [c.R[0],c.R[3],c.R[6]] = [cube.U[6],cube.U[7],cube.U[8]];
      [c.D[0],c.D[1],c.D[2]] = [cube.R[6],cube.R[3],cube.R[0]];
      [c.L[2],c.L[5],c.L[8]] = [cube.D[0],cube.D[1],cube.D[2]];
      break;
    }
    case "F'": {
      c.F = rotateFaceCCW(cube.F);
      [c.U[6],c.U[7],c.U[8]] = [cube.R[0],cube.R[3],cube.R[6]];
      [c.L[2],c.L[5],c.L[8]] = [cube.U[8],cube.U[7],cube.U[6]];
      [c.D[0],c.D[1],c.D[2]] = [cube.L[2],cube.L[5],cube.L[8]];
      [c.R[0],c.R[3],c.R[6]] = [cube.D[2],cube.D[1],cube.D[0]];
      break;
    }
    case "B": {
      c.B = rotateFaceCW(cube.B);
      [c.U[0],c.U[1],c.U[2]] = [cube.R[2],cube.R[5],cube.R[8]];
      [c.L[0],c.L[3],c.L[6]] = [cube.U[2],cube.U[1],cube.U[0]];
      [c.D[6],c.D[7],c.D[8]] = [cube.L[0],cube.L[3],cube.L[6]];
      [c.R[2],c.R[5],c.R[8]] = [cube.D[8],cube.D[7],cube.D[6]];
      break;
    }
    case "B'": {
      c.B = rotateFaceCCW(cube.B);
      [c.U[0],c.U[1],c.U[2]] = [cube.L[6],cube.L[3],cube.L[0]];
      [c.R[2],c.R[5],c.R[8]] = [cube.U[0],cube.U[1],cube.U[2]];
      [c.D[6],c.D[7],c.D[8]] = [cube.R[8],cube.R[5],cube.R[2]];
      [c.L[0],c.L[3],c.L[6]] = [cube.D[8],cube.D[7],cube.D[6]];
      break;
    }
    case "M": {
      [c.U[1],c.U[4],c.U[7]] = [cube.F[1],cube.F[4],cube.F[7]];
      [c.B[1],c.B[4],c.B[7]] = [cube.U[7],cube.U[4],cube.U[1]];
      [c.D[1],c.D[4],c.D[7]] = [cube.B[7],cube.B[4],cube.B[1]];
      [c.F[1],c.F[4],c.F[7]] = [cube.D[1],cube.D[4],cube.D[7]];
      break;
    }
    default: break;
  }
  return c;
}

function applyMoves(cube, moves) {
  return moves.reduce((c, m) => applyMove(c, m), cube);
}

function scrambleCube(cube) {
  const moves = ["U","U'","D","D'","R","R'","L","L'","F","F'","B","B'"];
  const seq = [];
  for (let i = 0; i < 20; i++) {
    seq.push(moves[Math.floor(Math.random() * moves.length)]);
  }
  return { cube: applyMoves(cube, seq), seq };
}

/* ============================================================
   FACE COMPONENT
   ============================================================ */
function Face({ label, stickers, size = 52 }) {
  return (
    <div className="cube-face">
      <div className="face-label">{label}</div>
      <div className="face-grid" style={{ gridTemplateColumns:`repeat(3, ${size}px)`, gridTemplateRows:`repeat(3, ${size}px)` }}>
        {stickers.map((color, i) => (
          <div
            key={i}
            className="sticker"
            style={{ background: COLORS[color], width:size, height:size }}
          />
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   MOVE BUTTON
   ============================================================ */
const MOVE_GROUPS = [
  { label:"Up",    moves:["U","U'"]  },
  { label:"Down",  moves:["D","D'"]  },
  { label:"Right", moves:["R","R'"]  },
  { label:"Left",  moves:["L","L'"]  },
  { label:"Front", moves:["F","F'"]  },
  { label:"Back",  moves:["B","B'"]  },
  { label:"Mid",   moves:["M"]       },
];

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
export default function CubeSolver() {
  const [cube,     setCube]     = useState(initCube());
  const [history,  setHistory]  = useState([]);
  const [scramble, setScramble] = useState([]);
  const [flash,    setFlash]    = useState(null);

  const doMove = useCallback((move) => {
    setCube(prev => applyMove(prev, move));
    setHistory(prev => [...prev, move]);
    setFlash(move);
    setTimeout(() => setFlash(null), 300);
  }, []);

  const doScramble = () => {
    const { cube: sc, seq } = scrambleCube(initCube());
    setCube(sc);
    setScramble(seq);
    setHistory([]);
  };

  const doReset = () => {
    setCube(initCube());
    setHistory([]);
    setScramble([]);
  };

  const undoMove = () => {
    if (!history.length) return;
    const newHistory = [...history];
    const last = newHistory.pop();
    const inverse = last.includes("'") ? last.replace("'","") : last + "'";
    setCube(prev => applyMove(prev, inverse));
    setHistory(newHistory);
  };

  const isSolved = FACE_NAMES.every(f => cube[f].every(s => s === cube[f][0]));

  return (
    <div className="tool-page cube-page">
      {/* Header */}
      <div className="tool-header">
        <a href="/" className="tool-back">← Back</a>
        <div>
          <div className="tool-eyebrow">🧩 Cuchco Tools</div>
          <h1 className="tool-title">CUBE SOLVER</h1>
          <p className="tool-sub">Visualize and apply moves on a full 3×3 Rubik's Cube</p>
        </div>
        {isSolved && (
          <div className="solved-badge">✓ SOLVED!</div>
        )}
      </div>

      <div className="cube-layout">

        {/* ── LEFT: Controls ── */}
        <div className="cube-controls">
          <div className="ctrl-section">
            <div className="ctrl-label">Quick Actions</div>
            <div className="ctrl-row">
              <button className="ctrl-btn scramble" onClick={doScramble}>🎲 Scramble</button>
              <button className="ctrl-btn reset"    onClick={doReset}>↺ Reset</button>
              <button className="ctrl-btn undo"     onClick={undoMove} disabled={!history.length}>↩ Undo</button>
            </div>
          </div>

          <div className="ctrl-section">
            <div className="ctrl-label">Apply Moves</div>
            {MOVE_GROUPS.map(g => (
              <div className="move-group" key={g.label}>
                <span className="move-group-label">{g.label}</span>
                <div className="move-btns">
                  {g.moves.map(m => (
                    <button
                      key={m}
                      className={`move-btn${flash === m ? " flash" : ""}`}
                      onClick={() => doMove(m)}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Move history */}
          <div className="ctrl-section">
            <div className="ctrl-label">Move History ({history.length})</div>
            <div className="move-history">
              {history.length === 0
                ? <span className="history-empty">No moves yet</span>
                : history.map((m,i) => (
                    <span key={i} className="history-move">{m}</span>
                  ))
              }
            </div>
          </div>

          {/* Scramble sequence */}
          {scramble.length > 0 && (
            <div className="ctrl-section">
              <div className="ctrl-label">Scramble Sequence</div>
              <div className="scramble-seq">
                {scramble.map((m,i) => <span key={i} className="seq-move">{m}</span>)}
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT: Cube visual ── */}
        <div className="cube-visual">
          <div className="cube-net">
            {/* Row 1: U face centered */}
            <div className="net-row">
              <div className="net-spacer"/>
              <Face label="U — White" stickers={cube.U} />
              <div className="net-spacer"/>
              <div className="net-spacer"/>
            </div>

            {/* Row 2: L F R B */}
            <div className="net-row">
              <Face label="L — Orange" stickers={cube.L} />
              <Face label="F — Green"  stickers={cube.F} />
              <Face label="R — Red"    stickers={cube.R} />
              <Face label="B — Blue"   stickers={cube.B} />
            </div>

            {/* Row 3: D face */}
            <div className="net-row">
              <div className="net-spacer"/>
              <Face label="D — Yellow" stickers={cube.D} />
              <div className="net-spacer"/>
              <div className="net-spacer"/>
            </div>
          </div>

          {/* Color legend */}
          <div className="color-legend">
            {Object.entries(COLORS).map(([key, hex]) => (
              <div key={key} className="legend-item">
                <div className="legend-swatch" style={{ background: hex, border: key==="W" ? "1px solid #555" : "none" }}/>
                <span>{key === "W" ? "White/U" : key === "Y" ? "Yellow/D" : key === "G" ? "Green/F" : key === "B" ? "Blue/B" : key === "O" ? "Orange/L" : "Red/R"}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
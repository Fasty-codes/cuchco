import { useState, useCallback } from "react";
import "./ChessBoard.css";

/* ============================================================
   CHESS ENGINE — piece definitions, legal moves
   ============================================================ */
const PIECES = {
  wK:"♔", wQ:"♕", wR:"♖", wB:"♗", wN:"♘", wP:"♙",
  bK:"♚", bQ:"♛", bR:"♜", bB:"♝", bN:"♞", bP:"♟",
};

function initBoard() {
  const b = Array(8).fill(null).map(() => Array(8).fill(null));
  // Black pieces row 0
  b[0] = ["bR","bN","bB","bQ","bK","bB","bN","bR"];
  b[1] = Array(8).fill("bP");
  // White pieces row 7
  b[6] = Array(8).fill("wP");
  b[7] = ["wR","wN","wB","wQ","wK","wB","wN","wR"];
  return b;
}

function cloneBoard(b) { return b.map(r => [...r]); }

function color(piece) { return piece ? piece[0] : null; }

function isInBounds(r, c) { return r >= 0 && r < 8 && c >= 0 && c < 8; }

function getRawMoves(board, r, c) {
  const piece = board[r][c];
  if (!piece) return [];
  const col = color(piece);
  const type = piece[1];
  const moves = [];
  const opp = col === "w" ? "b" : "w";

  const slide = (dr, dc) => {
    let nr = r + dr, nc = c + dc;
    while (isInBounds(nr, nc)) {
      if (!board[nr][nc]) { moves.push([nr, nc]); }
      else { if (color(board[nr][nc]) === opp) moves.push([nr, nc]); break; }
      nr += dr; nc += dc;
    }
  };

  if (type === "R") { [[-1,0],[1,0],[0,-1],[0,1]].forEach(([dr,dc]) => slide(dr,dc)); }
  if (type === "B") { [[-1,-1],[-1,1],[1,-1],[1,1]].forEach(([dr,dc]) => slide(dr,dc)); }
  if (type === "Q") { [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]].forEach(([dr,dc]) => slide(dr,dc)); }
  if (type === "N") {
    [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].forEach(([dr,dc]) => {
      const nr = r+dr, nc = c+dc;
      if (isInBounds(nr,nc) && color(board[nr][nc]) !== col) moves.push([nr,nc]);
    });
  }
  if (type === "K") {
    [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]].forEach(([dr,dc]) => {
      const nr = r+dr, nc = c+dc;
      if (isInBounds(nr,nc) && color(board[nr][nc]) !== col) moves.push([nr,nc]);
    });
  }
  if (type === "P") {
    const dir = col === "w" ? -1 : 1;
    const startRow = col === "w" ? 6 : 1;
    // Forward
    if (isInBounds(r+dir,c) && !board[r+dir][c]) {
      moves.push([r+dir,c]);
      if (r === startRow && !board[r+dir*2][c]) moves.push([r+dir*2,c]);
    }
    // Captures
    [-1,1].forEach(dc => {
      const nr = r+dir, nc = c+dc;
      if (isInBounds(nr,nc) && color(board[nr][nc]) === opp) moves.push([nr,nc]);
    });
  }
  return moves;
}

function findKing(board, col) {
  for (let r=0; r<8; r++) for (let c=0; c<8; c++) {
    if (board[r][c] === col+"K") return [r,c];
  }
  return null;
}

function isUnderAttack(board, r, c, byColor) {
  for (let fr=0; fr<8; fr++) for (let fc=0; fc<8; fc++) {
    if (color(board[fr][fc]) === byColor) {
      if (getRawMoves(board, fr, fc).some(([mr,mc]) => mr===r && mc===c)) return true;
    }
  }
  return false;
}

function isInCheck(board, col) {
  const king = findKing(board, col);
  if (!king) return false;
  return isUnderAttack(board, king[0], king[1], col === "w" ? "b" : "w");
}

function getLegalMoves(board, r, c) {
  const piece = board[r][c];
  if (!piece) return [];
  const col = color(piece);
  return getRawMoves(board, r, c).filter(([nr, nc]) => {
    const nb = cloneBoard(board);
    nb[nr][nc] = nb[r][c];
    nb[r][c] = null;
    return !isInCheck(nb, col);
  });
}

function hasAnyLegalMoves(board, col) {
  for (let r=0; r<8; r++) for (let c=0; c<8; c++) {
    if (color(board[r][c]) === col && getLegalMoves(board, r, c).length > 0) return true;
  }
  return false;
}

/* ============================================================
   PIECE SYMBOL
   ============================================================ */
function PieceEl({ piece }) {
  if (!piece) return null;
  return <span className={`chess-piece ${color(piece) === "w" ? "white-piece" : "black-piece"}`}>{PIECES[piece]}</span>;
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
export default function ChessBoard() {
  const [board,    setBoard]    = useState(initBoard());
  const [selected, setSelected] = useState(null);   // [r,c]
  const [legalMvs, setLegalMvs] = useState([]);
  const [turn,     setTurn]     = useState("w");
  const [status,   setStatus]   = useState(""); // "check" | "checkmate" | "stalemate" | ""
  const [captured, setCaptured] = useState({ w:[], b:[] });
  const [lastMove, setLastMove] = useState(null);
  const [moveLog,  setMoveLog]  = useState([]);
  const [promoteTo,setPromoteTo]= useState(null); // pending promotion {r,c,col}

  const handleSquare = useCallback((r, c) => {
    if (promoteTo) return;

    // Promotion choice made elsewhere
    if (selected) {
      const [sr, sc] = selected;
      const isLegal = legalMvs.some(([lr,lc]) => lr===r && lc===c);

      if (isLegal) {
        // Make the move
        const nb = cloneBoard(board);
        const piece = nb[sr][sc];
        const captured_piece = nb[r][c];

        nb[r][c] = nb[sr][sc];
        nb[sr][sc] = null;

        // Pawn promotion
        if (piece === "wP" && r === 0) { setPromoteTo({r, c, col:"w"}); setBoard(nb); setSelected(null); setLegalMvs([]); return; }
        if (piece === "bP" && r === 7) { setPromoteTo({r, c, col:"b"}); setBoard(nb); setSelected(null); setLegalMvs([]); return; }

        // Update captured
        if (captured_piece) {
          setCaptured(prev => ({
            ...prev,
            [color(piece)]: [...prev[color(piece)], captured_piece]
          }));
        }

        // Move log
        const files = "abcdefgh";
        setMoveLog(prev => [...prev, `${piece} ${files[sc]}${8-sr}→${files[c]}${8-r}`]);

        const nextTurn = turn === "w" ? "b" : "w";
        setBoard(nb);
        setTurn(nextTurn);
        setSelected(null);
        setLegalMvs([]);
        setLastMove([sr,sc,r,c]);

        // Check / checkmate / stalemate
        if (isInCheck(nb, nextTurn)) {
          if (!hasAnyLegalMoves(nb, nextTurn)) setStatus("checkmate");
          else setStatus("check");
        } else if (!hasAnyLegalMoves(nb, nextTurn)) {
          setStatus("stalemate");
        } else {
          setStatus("");
        }
        return;
      }
    }

    // Select a piece
    const piece = board[r][c];
    if (piece && color(piece) === turn) {
      setSelected([r,c]);
      setLegalMvs(getLegalMoves(board, r, c));
    } else {
      setSelected(null);
      setLegalMvs([]);
    }
  }, [board, selected, legalMvs, turn, promoteTo]);

  const promote = (pieceType) => {
    if (!promoteTo) return;
    const nb = cloneBoard(board);
    nb[promoteTo.r][promoteTo.c] = promoteTo.col + pieceType;
    const nextTurn = promoteTo.col === "w" ? "b" : "w";
    setBoard(nb);
    setPromoteTo(null);
    setTurn(nextTurn);
    if (isInCheck(nb, nextTurn)) {
      setStatus(!hasAnyLegalMoves(nb, nextTurn) ? "checkmate" : "check");
    } else if (!hasAnyLegalMoves(nb, nextTurn)) {
      setStatus("stalemate");
    }
  };

  const resetGame = () => {
    setBoard(initBoard());
    setSelected(null); setLegalMvs([]);
    setTurn("w"); setStatus(""); setCaptured({w:[],b:[]});
    setLastMove(null); setMoveLog([]); setPromoteTo(null);
  };

  const isHighlighted = (r, c) => legalMvs.some(([lr,lc]) => lr===r && lc===c);
  const isSelected    = (r, c) => selected && selected[0]===r && selected[1]===c;
  const isLastMove    = (r, c) => lastMove && (
    (lastMove[0]===r && lastMove[1]===c) || (lastMove[2]===r && lastMove[3]===c)
  );

  return (
    <div className="tool-page chess-page">
      {/* Header */}
      <div className="tool-header">
        <a href="/" className="tool-back">← Back</a>
        <div>
          <div className="tool-eyebrow">♟️ Cuchco Tools</div>
          <h1 className="tool-title">CHESS BOARD</h1>
          <p className="tool-sub">Play a full game of chess — click a piece, then click where to move</p>
        </div>
        <div className="chess-status-wrap">
          {status === "checkmate" && <div className="status-badge checkmate">♚ CHECKMATE — {turn === "w" ? "Black" : "White"} wins!</div>}
          {status === "stalemate" && <div className="status-badge stalemate">⬜ STALEMATE — Draw!</div>}
          {status === "check"     && <div className="status-badge check">⚠ {turn === "w" ? "White" : "Black"} is in CHECK!</div>}
          {status === ""          && <div className="turn-indicator">{turn === "w" ? "⬜ White's turn" : "⬛ Black's turn"}</div>}
        </div>
      </div>

      <div className="chess-layout">

        {/* ── LEFT: Info panel ── */}
        <div className="chess-panel">

          <div className="ctrl-section">
            <div className="ctrl-label">Controls</div>
            <button className="ctrl-btn reset" onClick={resetGame}>↺ New Game</button>
          </div>

          {/* Captured pieces */}
          <div className="ctrl-section">
            <div className="ctrl-label">White Captured</div>
            <div className="captured-row">
              {captured.w.length === 0
                ? <span style={{fontSize:"0.7rem",color:"var(--text3)"}}>None yet</span>
                : captured.w.map((p,i) => <span key={i} className="cap-piece">{PIECES[p]}</span>)
              }
            </div>
          </div>

          <div className="ctrl-section">
            <div className="ctrl-label">Black Captured</div>
            <div className="captured-row">
              {captured.b.length === 0
                ? <span style={{fontSize:"0.7rem",color:"var(--text3)"}}>None yet</span>
                : captured.b.map((p,i) => <span key={i} className="cap-piece">{PIECES[p]}</span>)
              }
            </div>
          </div>

          {/* Move log */}
          <div className="ctrl-section" style={{flex:1}}>
            <div className="ctrl-label">Move Log ({moveLog.length})</div>
            <div className="move-log">
              {moveLog.length === 0
                ? <span className="history-empty">No moves yet</span>
                : moveLog.map((m,i) => (
                    <div key={i} className="log-entry">
                      <span className="log-num">{Math.floor(i/2)+1}{i%2===0?"w":"b"}.</span>
                      <span className="log-move">{m}</span>
                    </div>
                  ))
              }
            </div>
          </div>

          {/* How to play */}
          <div className="ctrl-section">
            <div className="ctrl-label">How to Play</div>
            <div className="how-to">
              <p>🖱️ Click a <strong>piece</strong> to select it</p>
              <p>🟡 <strong>Yellow dots</strong> show legal moves</p>
              <p>🖱️ Click a <strong>dot</strong> to move there</p>
              <p>♟️ Pawns auto-promote at the end</p>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Board ── */}
        <div className="chess-board-wrap">
          {/* File labels top */}
          <div className="board-files">
            {"abcdefgh".split("").map(f => <span key={f}>{f}</span>)}
          </div>

          <div className="board-and-ranks">
            {/* Rank labels */}
            <div className="board-ranks">
              {[8,7,6,5,4,3,2,1].map(n => <span key={n}>{n}</span>)}
            </div>

            {/* Board */}
            <div className="chess-board">
              {board.map((row, r) =>
                row.map((piece, c) => {
                  const light = (r + c) % 2 === 0;
                  const sel   = isSelected(r, c);
                  const hi    = isHighlighted(r, c);
                  const lm    = isLastMove(r, c);
                  return (
                    <div
                      key={`${r}${c}`}
                      className={`chess-square ${light?"sq-light":"sq-dark"}${sel?" sq-selected":""}${lm?" sq-lastmove":""}${status==="check" && piece && piece===(turn+"K")?" sq-check":""}`}
                      onClick={() => handleSquare(r, c)}
                    >
                      <PieceEl piece={piece}/>
                      {hi && <div className={`move-dot${piece ? " capture-ring" : ""}`}/>}
                    </div>
                  );
                })
              )}
            </div>

            {/* Rank labels right */}
            <div className="board-ranks">
              {[8,7,6,5,4,3,2,1].map(n => <span key={n}>{n}</span>)}
            </div>
          </div>

          {/* File labels bottom */}
          <div className="board-files">
            {"abcdefgh".split("").map(f => <span key={f}>{f}</span>)}
          </div>
        </div>
      </div>

      {/* Promotion modal */}
      {promoteTo && (
        <div className="promotion-overlay">
          <div className="promotion-box">
            <div className="promotion-title">Choose Promotion</div>
            {["Q","R","B","N"].map(t => (
              <button key={t} className="promotion-btn" onClick={() => promote(t)}>
                {PIECES[promoteTo.col + t]}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
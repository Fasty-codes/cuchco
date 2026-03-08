import { useState, useCallback, useEffect, useRef } from "react";
import "./ChessBoard.css";

/* ============================================================
   CHESS ENGINE
   ============================================================ */
const PIECE_UNICODE = {
  wK:"♔", wQ:"♕", wR:"♖", wB:"♗", wN:"♘", wP:"♙",
  bK:"♚", bQ:"♛", bR:"♜", bB:"♝", bN:"♞", bP:"♟",
};

const PIECE_NAMES = {
  K:"King", Q:"Queen", R:"Rook", B:"Bishop", N:"Knight", P:"Pawn"
};

function initBoard() {
  const b = Array(8).fill(null).map(() => Array(8).fill(null));
  b[0] = ["bR","bN","bB","bQ","bK","bB","bN","bR"];
  b[1] = Array(8).fill("bP");
  b[6] = Array(8).fill("wP");
  b[7] = ["wR","wN","wB","wQ","wK","wB","wN","wR"];
  return b;
}

function cloneBoard(b) { return b.map(r => [...r]); }
function col(p) { return p ? p[0] : null; }
function inBounds(r,c) { return r>=0&&r<8&&c>=0&&c<8; }

function getRawMoves(board, r, c, enPassant=null) {
  const piece = board[r][c];
  if (!piece) return [];
  const pc = col(piece), type = piece[1], opp = pc==="w"?"b":"w";
  const moves = [];
  const slide = (dr,dc) => {
    let nr=r+dr, nc=c+dc;
    while(inBounds(nr,nc)){
      if(!board[nr][nc]) moves.push([nr,nc]);
      else { if(col(board[nr][nc])===opp) moves.push([nr,nc]); break; }
      nr+=dr; nc+=dc;
    }
  };
  if(type==="R") [[-1,0],[1,0],[0,-1],[0,1]].forEach(([dr,dc])=>slide(dr,dc));
  if(type==="B") [[-1,-1],[-1,1],[1,-1],[1,1]].forEach(([dr,dc])=>slide(dr,dc));
  if(type==="Q") [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]].forEach(([dr,dc])=>slide(dr,dc));
  if(type==="N") [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].forEach(([dr,dc])=>{
    const nr=r+dr,nc=c+dc;
    if(inBounds(nr,nc)&&col(board[nr][nc])!==pc) moves.push([nr,nc]);
  });
  if(type==="K") {
    [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]].forEach(([dr,dc])=>{
      const nr=r+dr,nc=c+dc;
      if(inBounds(nr,nc)&&col(board[nr][nc])!==pc) moves.push([nr,nc]);
    });
  }
  if(type==="P") {
    const dir = pc==="w"?-1:1, startRow = pc==="w"?6:1;
    if(inBounds(r+dir,c)&&!board[r+dir][c]) {
      moves.push([r+dir,c]);
      if(r===startRow&&!board[r+dir*2][c]) moves.push([r+dir*2,c]);
    }
    [-1,1].forEach(dc=>{
      const nr=r+dir,nc=c+dc;
      if(inBounds(nr,nc)&&col(board[nr][nc])===opp) moves.push([nr,nc]);
      // En passant
      if(enPassant&&nr===enPassant[0]&&nc===enPassant[1]) moves.push([nr,nc]);
    });
  }
  return moves;
}

function findKing(board, c) {
  for(let r=0;r<8;r++) for(let fc=0;fc<8;fc++)
    if(board[r][fc]===c+"K") return [r,fc];
  return null;
}

function isAttacked(board, r, c, byColor) {
  for(let fr=0;fr<8;fr++) for(let fc=0;fc<8;fc++)
    if(col(board[fr][fc])===byColor)
      if(getRawMoves(board,fr,fc).some(([mr,mc])=>mr===r&&mc===c)) return true;
  return false;
}

function inCheck(board, c) {
  const k = findKing(board,c);
  return k ? isAttacked(board,k[0],k[1],c==="w"?"b":"w") : false;
}

function getLegal(board, r, c, castleRights=null, enPassant=null) {
  const piece = board[r][c];
  if(!piece) return [];
  const pc = col(piece), type = piece[1];
  let moves = getRawMoves(board,r,c,enPassant).filter(([nr,nc])=>{
    const nb = cloneBoard(board);
    // Handle en passant capture
    if(type==="P"&&enPassant&&nr===enPassant[0]&&nc===enPassant[1]) {
      const captureRow = pc==="w"?nr+1:nr-1;
      nb[captureRow][nc]=null;
    }
    nb[nr][nc]=nb[r][c]; nb[r][c]=null;
    return !inCheck(nb,pc);
  });
  // Castling
  if(type==="K"&&castleRights) {
    const cr = castleRights;
    const row = pc==="w"?7:0;
    if(r===row&&c===4) {
      // Kingside
      if(cr[pc].kSide && !board[row][5] && !board[row][6] &&
         !isAttacked(board,row,4,pc==="w"?"b":"w") &&
         !isAttacked(board,row,5,pc==="w"?"b":"w") &&
         !isAttacked(board,row,6,pc==="w"?"b":"w"))
        moves.push([row,6,"castle"]);
      // Queenside
      if(cr[pc].qSide && !board[row][3] && !board[row][2] && !board[row][1] &&
         !isAttacked(board,row,4,pc==="w"?"b":"w") &&
         !isAttacked(board,row,3,pc==="w"?"b":"w") &&
         !isAttacked(board,row,2,pc==="w"?"b":"w"))
        moves.push([row,2,"castle"]);
    }
  }
  return moves;
}

function hasAnyLegal(board, c, castleRights, enPassant) {
  for(let r=0;r<8;r++) for(let fc=0;fc<8;fc++)
    if(col(board[r][fc])===c && getLegal(board,r,fc,castleRights,enPassant).length>0) return true;
  return false;
}

const FILES = "abcdefgh";
function toAN(sr,sc,nr,nc,piece,captured,promotion="") {
  const file = FILES[sc], rank = 8-sr;
  const toFile = FILES[nc], toRank = 8-nr;
  if(piece[1]==="P") {
    let s = captured ? `${file}x${toFile}${toRank}` : `${toFile}${toRank}`;
    if(promotion) s += "="+promotion;
    return s;
  }
  return `${piece[1]}${captured?"x":""}${toFile}${toRank}`;
}

/* ============================================================
   EVALUATION (simple, for material display)
   ============================================================ */
const MATERIAL = { P:1, N:3, B:3, R:5, Q:9, K:0 };
function getMaterial(board) {
  let w=0, b=0;
  for(let r=0;r<8;r++) for(let c=0;c<8;c++) {
    const p = board[r][c];
    if(p) { if(col(p)==="w") w+=MATERIAL[p[1]]; else b+=MATERIAL[p[1]]; }
  }
  return { w, b, diff: w-b };
}

/* ============================================================
   SOUND EFFECTS (Web Audio)
   ============================================================ */
function playSound(type) {
  try {
    const ctx = new (window.AudioContext||window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    if(type==="move")     { o.frequency.value=440; g.gain.setValueAtTime(0.1,ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.1); }
    if(type==="capture")  { o.frequency.value=220; g.gain.setValueAtTime(0.15,ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.15); }
    if(type==="check")    { o.frequency.value=880; g.gain.setValueAtTime(0.2,ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.3); }
    if(type==="checkmate"){ o.type="sawtooth"; o.frequency.setValueAtTime(200,ctx.currentTime); o.frequency.exponentialRampToValueAtTime(50,ctx.currentTime+1); g.gain.setValueAtTime(0.3,ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+1); }
    o.start(); o.stop(ctx.currentTime+1.5);
  } catch(e){}
}

/* ============================================================
   COMPONENTS
   ============================================================ */
function Piece({ piece }) {
  if(!piece) return null;
  return <span className={`piece ${col(piece)==="w"?"p-white":"p-black"}`}>{PIECE_UNICODE[piece]}</span>;
}

/* ============================================================
   CHECK OVERLAY
   ============================================================ */
function CheckOverlay({ turn }) {
  return (
    <div className="check-overlay">
      <div className="check-overlay-inner">
        <div className="check-icon">⚠</div>
        <div className="check-word">CHECK</div>
        <div className="check-sub">{turn==="w"?"White":"Black"} king is under attack!</div>
      </div>
    </div>
  );
}

/* ============================================================
   CHECKMATE OVERLAY
   ============================================================ */
function CheckmateOverlay({ winner, onNewGame }) {
  return (
    <div className="checkmate-overlay">
      <div className="checkmate-box">
        <div className="cm-crown">♛</div>
        <div className="cm-title">CHECKMATE</div>
        <div className="cm-winner">
          <span className="cm-winner-name">{winner==="w"?"White":"Black"}</span>
          <span className="cm-wins-text"> wins!</span>
        </div>
        <div className="cm-divider"/>
        <p className="cm-quote">"The queen sacrificed — the game was won."</p>
        <button className="cm-new-game" onClick={onNewGame}>
          ↺ New Game
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   STALEMATE OVERLAY
   ============================================================ */
function StalemateOverlay({ onNewGame }) {
  return (
    <div className="stalemate-overlay">
      <div className="checkmate-box">
        <div className="cm-crown" style={{filter:"grayscale(1)"}}>⬜</div>
        <div className="cm-title" style={{color:"#aaa"}}>STALEMATE</div>
        <div className="cm-winner"><span className="cm-wins-text">It's a Draw!</span></div>
        <div className="cm-divider"/>
        <p className="cm-quote">"Neither side could advance. A perfect standoff."</p>
        <button className="cm-new-game" onClick={onNewGame}>↺ New Game</button>
      </div>
    </div>
  );
}

/* ============================================================
   PROMOTION PICKER
   ============================================================ */
function PromotionPicker({ col: pc, onChoose }) {
  return (
    <div className="promotion-overlay">
      <div className="promotion-box">
        <div className="promo-title">Promote Pawn</div>
        <div className="promo-pieces">
          {["Q","R","B","N"].map(t => (
            <button key={t} className="promo-btn" onClick={() => onChoose(t)}>
              <span className="promo-piece">{PIECE_UNICODE[pc+t]}</span>
              <span className="promo-name">{PIECE_NAMES[t]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   MAIN CHESS COMPONENT
   ============================================================ */
export default function ChessBoard() {
  const [board,       setBoard]       = useState(initBoard());
  const [selected,    setSelected]    = useState(null);
  const [legalMoves,  setLegalMoves]  = useState([]);
  const [turn,        setTurn]        = useState("w");
  const [gameState,   setGameState]   = useState("playing"); // playing | check | checkmate | stalemate
  const [lastMove,    setLastMove]    = useState(null);
  const [captured,    setCaptured]    = useState({ w:[], b:[] });
  const [moveHistory, setMoveHistory] = useState([]);
  const [promotion,   setPromotion]   = useState(null);
  const [castleRights,setCastleRights]= useState({ w:{kSide:true,qSide:true}, b:{kSide:true,qSide:true} });
  const [enPassant,   setEnPassant]   = useState(null);
  const [checkAnim,   setCheckAnim]   = useState(false);
  const [flipped,     setFlipped]     = useState(false);
  const logRef = useRef(null);

  // Auto-scroll move log
  useEffect(() => {
    if(logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [moveHistory]);

  // Show check animation briefly
  useEffect(() => {
    if(gameState==="check") {
      setCheckAnim(true);
      const t = setTimeout(() => setCheckAnim(false), 2500);
      return () => clearTimeout(t);
    }
  }, [gameState, moveHistory.length]);

  const resetGame = () => {
    setBoard(initBoard()); setSelected(null); setLegalMoves([]);
    setTurn("w"); setGameState("playing"); setLastMove(null);
    setCaptured({w:[],b:[]}); setMoveHistory([]); setPromotion(null);
    setCastleRights({w:{kSide:true,qSide:true},b:{kSide:true,qSide:true}});
    setEnPassant(null); setCheckAnim(false);
  };

  const handleSquare = useCallback((r, c) => {
    if(gameState==="checkmate"||gameState==="stalemate"||promotion) return;

    if(selected) {
      const [sr,sc] = selected;
      const move = legalMoves.find(([mr,mc])=>mr===r&&mc===c);

      if(move) {
        const nb = cloneBoard(board);
        const piece = nb[sr][sc];
        const capturedPiece = nb[r][c];
        let newEnPassant = null;
        let newCastle = { w:{...castleRights.w}, b:{...castleRights.b} };

        // En passant capture
        if(piece[1]==="P"&&enPassant&&r===enPassant[0]&&c===enPassant[1]) {
          const capRow = col(piece)==="w"?r+1:r-1;
          setCaptured(prev => ({ ...prev, [col(piece)]: [...prev[col(piece)], nb[capRow][c]] }));
          nb[capRow][c]=null;
        }

        // Set en passant square
        if(piece[1]==="P"&&Math.abs(r-sr)===2) {
          newEnPassant = [sr+(r-sr)/2, c];
        }

        // Castling
        if(move[2]==="castle") {
          const row = col(piece)==="w"?7:0;
          if(c===6) { nb[row][5]=nb[row][7]; nb[row][7]=null; }
          if(c===2) { nb[row][3]=nb[row][0]; nb[row][0]=null; }
        }

        // Update castle rights
        if(piece==="wK") { newCastle.w={kSide:false,qSide:false}; }
        if(piece==="bK") { newCastle.b={kSide:false,qSide:false}; }
        if(piece==="wR"&&sr===7&&sc===7) newCastle.w.kSide=false;
        if(piece==="wR"&&sr===7&&sc===0) newCastle.w.qSide=false;
        if(piece==="bR"&&sr===0&&sc===7) newCastle.b.kSide=false;
        if(piece==="bR"&&sr===0&&sc===0) newCastle.b.qSide=false;

        // Move piece
        nb[r][c] = nb[sr][sc];
        nb[sr][sc] = null;

        // Captured
        if(capturedPiece) {
          setCaptured(prev => ({ ...prev, [col(piece)]: [...prev[col(piece)], capturedPiece] }));
          playSound("capture");
        } else {
          playSound("move");
        }

        // Pawn promotion
        if(piece[1]==="P"&&(r===0||r===7)) {
          setBoard(nb); setPromotion({r,c,nb,piece,sr,sc,nr:r,nc:c,newCastle,newEnPassant});
          setSelected(null); setLegalMoves([]);
          return;
        }

        // Move notation
        const an = toAN(sr,sc,r,c,piece,!!capturedPiece);
        const nextTurn = turn==="w"?"b":"w";

        // Check / checkmate / stalemate
        let newState = "playing";
        if(inCheck(nb,nextTurn)) {
          if(!hasAnyLegal(nb,nextTurn,newCastle,newEnPassant)) { newState="checkmate"; playSound("checkmate"); }
          else { newState="check"; playSound("check"); }
        } else if(!hasAnyLegal(nb,nextTurn,newCastle,newEnPassant)) {
          newState="stalemate";
        }

        setBoard(nb);
        setTurn(nextTurn);
        setGameState(newState);
        setLastMove([sr,sc,r,c]);
        setMoveHistory(prev => [...prev, { an: an+(newState==="check"?"+":(newState==="checkmate"?"#":"")), turn }]);
        setCastleRights(newCastle);
        setEnPassant(newEnPassant);
        setSelected(null); setLegalMoves([]);
        return;
      }
    }

    // Select
    const piece = board[r][c];
    if(piece && col(piece)===turn) {
      const moves = getLegal(board,r,c,castleRights,enPassant);
      setSelected([r,c]);
      setLegalMoves(moves);
    } else {
      setSelected(null); setLegalMoves([]);
    }
  }, [board,selected,legalMoves,turn,gameState,promotion,castleRights,enPassant]);

  const handlePromotion = (type) => {
    if(!promotion) return;
    const { r,c,nb,piece,sr,sc,nr,nc,newCastle,newEnPassant } = promotion;
    nb[r][c] = col(piece)+type;
    const nextTurn = turn==="w"?"b":"w";
    let newState = "playing";
    if(inCheck(nb,nextTurn)) {
      if(!hasAnyLegal(nb,nextTurn,newCastle,newEnPassant)) { newState="checkmate"; playSound("checkmate"); }
      else { newState="check"; playSound("check"); }
    } else if(!hasAnyLegal(nb,nextTurn,newCastle,newEnPassant)) {
      newState="stalemate";
    }
    const an = toAN(sr,sc,r,c,piece,false,type)+(newState==="check"?"+":(newState==="checkmate"?"#":""));
    setBoard(nb); setTurn(nextTurn); setGameState(newState);
    setLastMove([sr,sc,r,c]);
    setMoveHistory(prev => [...prev, {an, turn}]);
    setCastleRights(newCastle); setEnPassant(newEnPassant);
    setPromotion(null);
  };

  const mat = getMaterial(board);
  const isHi = (r,c) => legalMoves.some(([mr,mc])=>mr===r&&mc===c);
  const isSel = (r,c) => selected&&selected[0]===r&&selected[1]===c;
  const isLast = (r,c) => lastMove&&((lastMove[0]===r&&lastMove[1]===c)||(lastMove[2]===r&&lastMove[3]===c));
  const kingPos = findKing(board,turn);
  const isKingCheck = (r,c) => (gameState==="check"||gameState==="checkmate")&&kingPos&&kingPos[0]===r&&kingPos[1]===c;

  const rows = flipped ? [0,1,2,3,4,5,6,7] : [7,6,5,4,3,2,1,0];
  const cols = flipped ? [7,6,5,4,3,2,1,0] : [0,1,2,3,4,5,6,7];

  return (
    <div className="chess-page">

      {/* ── TOP BAR ── */}
      <div className="chess-topbar">
        <a href="/" className="chess-back">← Back</a>
        <div className="chess-title-wrap">
          <span className="chess-eyebrow">♟ Cuchco</span>
          <h1 className="chess-title">CHESS</h1>
        </div>
        <div className="chess-topbar-right">
          <div className={`turn-badge ${turn==="w"?"tb-white":"tb-black"}`}>
            {gameState==="playing"||gameState==="check"
              ? <>{turn==="w"?"⬜":"⬛"} {turn==="w"?"White":"Black"}'s turn</>
              : gameState==="checkmate" ? "Game Over" : "Draw"
            }
          </div>
          <button className="chess-ctrl-btn" onClick={() => setFlipped(f=>!f)}>⇅ Flip</button>
          <button className="chess-ctrl-btn danger" onClick={resetGame}>↺ New Game</button>
        </div>
      </div>

      <div className="chess-body">

        {/* ── LEFT PANEL ── */}
        <div className="chess-sidebar">

          {/* Material advantage */}
          <div className="material-section">
            <div className="mat-row">
              <div className="mat-label">⬜ White</div>
              <div className="mat-pieces">{captured.w.map((p,i)=><span key={i}>{PIECE_UNICODE[p]}</span>)}</div>
              {mat.diff>0 && <div className="mat-advantage">+{mat.diff}</div>}
            </div>
            <div className="mat-bar-wrap">
              <div className="mat-bar" style={{width:`${Math.min(100,50+mat.diff*3)}%`}}/>
            </div>
            <div className="mat-row">
              <div className="mat-label">⬛ Black</div>
              <div className="mat-pieces">{captured.b.map((p,i)=><span key={i}>{PIECE_UNICODE[p]}</span>)}</div>
              {mat.diff<0 && <div className="mat-advantage">+{Math.abs(mat.diff)}</div>}
            </div>
          </div>

          {/* Move history */}
          <div className="sidebar-label">Move History</div>
          <div className="move-log" ref={logRef}>
            {moveHistory.length===0
              ? <div className="log-empty">No moves yet</div>
              : moveHistory.reduce((acc,mv,i) => {
                  if(i%2===0) acc.push([mv]);
                  else acc[acc.length-1].push(mv);
                  return acc;
                },[]).map((pair,i) => (
                  <div key={i} className="log-pair">
                    <span className="log-num">{i+1}.</span>
                    <span className="log-w">{pair[0]?.an}</span>
                    <span className="log-b">{pair[1]?.an||""}</span>
                  </div>
                ))
            }
          </div>

          {/* How to play */}
          <div className="sidebar-label">Controls</div>
          <div className="chess-help">
            <div className="help-row"><span className="help-key">Click</span><span>Select piece</span></div>
            <div className="help-row"><span className="help-key">🟡 dot</span><span>Legal move</span></div>
            <div className="help-row"><span className="help-key">🔴 ring</span><span>Capture</span></div>
            <div className="help-row"><span className="help-key">⇅ Flip</span><span>Rotate board</span></div>
          </div>
        </div>

        {/* ── BOARD ── */}
        <div className="chess-board-container">

          {/* Rank labels */}
          <div className="rank-labels">
            {rows.map(r => <div key={r} className="rank-label">{8-r}</div>)}
          </div>

          <div className="board-col">
            {/* File labels top */}
            <div className="file-labels">
              {cols.map(c => <div key={c} className="file-label">{FILES[c]}</div>)}
            </div>

            <div className={`chess-board${gameState==="checkmate"?" board-checkmate":gameState==="check"?" board-check":""}`}>
              {rows.map(r =>
                cols.map(c => {
                  const light = (r+c)%2===0;
                  const piece = board[r][c];
                  const hi    = isHi(r,c);
                  const sel   = isSel(r,c);
                  const last  = isLast(r,c);
                  const kchk  = isKingCheck(r,c);
                  return (
                    <div
                      key={`${r}${c}`}
                      className={[
                        "sq",
                        light?"sq-l":"sq-d",
                        sel?"sq-sel":"",
                        last?"sq-last":"",
                        kchk?"sq-king-check":"",
                        hi&&piece?"sq-capture":"",
                      ].filter(Boolean).join(" ")}
                      onClick={() => handleSquare(r,c)}
                    >
                      <Piece piece={piece}/>
                      {hi && !piece && <div className="move-dot"/>}
                      {hi &&  piece && <div className="capture-ring"/>}
                      {/* Coordinate labels on edge squares */}
                      {c===0 && <div className="sq-rank">{8-r}</div>}
                      {r===(flipped?0:7) && <div className="sq-file">{FILES[c]}</div>}
                    </div>
                  );
                })
              )}
            </div>

            <div className="file-labels">
              {cols.map(c => <div key={c} className="file-label">{FILES[c]}</div>)}
            </div>
          </div>

          <div className="rank-labels">
            {rows.map(r => <div key={r} className="rank-label">{8-r}</div>)}
          </div>
        </div>

        {/* ── RIGHT PANEL (captured by black) ── */}
        <div className="chess-sidebar chess-sidebar-right">
          <div className="sidebar-label">Black Captured</div>
          <div className="captured-grid">
            {captured.b.length===0
              ? <span className="cap-empty">—</span>
              : captured.b.map((p,i)=><span key={i} className="cap-piece">{PIECE_UNICODE[p]}</span>)
            }
          </div>
          <div className="sidebar-label" style={{marginTop:24}}>White Captured</div>
          <div className="captured-grid">
            {captured.w.length===0
              ? <span className="cap-empty">—</span>
              : captured.w.map((p,i)=><span key={i} className="cap-piece">{PIECE_UNICODE[p]}</span>)
            }
          </div>
        </div>
      </div>

      {/* ── OVERLAYS ── */}
      {checkAnim && gameState==="check" && <CheckOverlay turn={turn}/>}
      {gameState==="checkmate" && <CheckmateOverlay winner={turn==="w"?"b":"w"} onNewGame={resetGame}/>}
      {gameState==="stalemate" && <StalemateOverlay onNewGame={resetGame}/>}
      {promotion && <PromotionPicker col={col(board[promotion.r][promotion.c])||turn} onChoose={handlePromotion}/>}
    </div>
  );
}
import { useState, useCallback, useEffect, useRef } from "react";
import { FiHome, FiRotateCcw, FiRotateCw, FiFlag, FiEdit2 } from "react-icons/fi";
import { TbChessKing } from "react-icons/tb";
import "./ChessBoard.css";

/* ============================================================
   SVG CHESS PIECES — Chess.com style using Unicode SVG paths
   We use the standard Wikimedia chess piece SVGs via CDN
   ============================================================ */
const PIECE_IMG = {
  wK: "https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg",
  wQ: "https://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg",
  wR: "https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg",
  wB: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg",
  wN: "https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg",
  wP: "https://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg",
  bK: "https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg",
  bQ: "https://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg",
  bR: "https://upload.wikimedia.org/wikipedia/commons/f/ff/Chess_rdt45.svg",
  bB: "https://upload.wikimedia.org/wikipedia/commons/9/98/Chess_bdt45.svg",
  bN: "https://upload.wikimedia.org/wikipedia/commons/e/ef/Chess_ndt45.svg",
  bP: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Chess_pdt45.svg",
};

const PIECE_VALUES = {K:0,Q:9,R:5,B:3,N:3,P:1};
const FILES = ["a","b","c","d","e","f","g","h"];

function initBoard(){
  const b=Array(8).fill(null).map(()=>Array(8).fill(null));
  b[0]=["bR","bN","bB","bQ","bK","bB","bN","bR"];
  b[1]=Array(8).fill("bP");
  b[6]=Array(8).fill("wP");
  b[7]=["wR","wN","wB","wQ","wK","wB","wN","wR"];
  return b;
}
function cloneBoard(b){return b.map(r=>[...r]);}
function pc(p){return p?p[0]:null;}
function inBounds(r,c){return r>=0&&r<8&&c>=0&&c<8;}

function getRawMoves(board,r,c,enPassant=null){
  const piece=board[r][c]; if(!piece) return [];
  const color=pc(piece),type=piece[1],opp=color==="w"?"b":"w";
  const moves=[];
  const slide=(dr,dc)=>{
    let nr=r+dr,nc=c+dc;
    while(inBounds(nr,nc)){
      if(!board[nr][nc]) moves.push([nr,nc]);
      else{if(pc(board[nr][nc])===opp) moves.push([nr,nc]); break;}
      nr+=dr; nc+=dc;
    }
  };
  if(type==="R") [[-1,0],[1,0],[0,-1],[0,1]].forEach(([dr,dc])=>slide(dr,dc));
  if(type==="B") [[-1,-1],[-1,1],[1,-1],[1,1]].forEach(([dr,dc])=>slide(dr,dc));
  if(type==="Q") [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]].forEach(([dr,dc])=>slide(dr,dc));
  if(type==="N") [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].forEach(([dr,dc])=>{
    const nr=r+dr,nc=c+dc;
    if(inBounds(nr,nc)&&pc(board[nr][nc])!==color) moves.push([nr,nc]);
  });
  if(type==="K"){
    [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]].forEach(([dr,dc])=>{
      const nr=r+dr,nc=c+dc;
      if(inBounds(nr,nc)&&pc(board[nr][nc])!==color) moves.push([nr,nc]);
    });
  }
  if(type==="P"){
    const dir=color==="w"?-1:1, startRow=color==="w"?6:1;
    if(inBounds(r+dir,c)&&!board[r+dir][c]){
      moves.push([r+dir,c]);
      if(r===startRow&&!board[r+2*dir][c]) moves.push([r+2*dir,c]);
    }
    [-1,1].forEach(dc=>{
      const nr=r+dir,nc=c+dc;
      if(inBounds(nr,nc)){
        if(pc(board[nr][nc])===opp) moves.push([nr,nc]);
        if(enPassant&&enPassant[0]===nr&&enPassant[1]===nc) moves.push([nr,nc]);
      }
    });
  }
  return moves;
}

function findKing(board,color){
  for(let r=0;r<8;r++) for(let c=0;c<8;c++) if(board[r][c]===color+"K") return[r,c];
  return null;
}
function isUnderAttack(board,r,c,byColor){
  for(let br=0;br<8;br++) for(let bc=0;bc<8;bc++){
    if(pc(board[br][bc])===byColor){
      const ms=getRawMoves(board,br,bc,null);
      if(ms.some(([mr,mc])=>mr===r&&mc===c)) return true;
    }
  }
  return false;
}
function isInCheck(board,color){
  const k=findKing(board,color); if(!k) return false;
  return isUnderAttack(board,k[0],k[1],color==="w"?"b":"w");
}
function getLegalMoves(board,r,c,enPassant){
  const piece=board[r][c]; if(!piece) return [];
  const color=pc(piece),type=piece[1];
  let moves=getRawMoves(board,r,c,enPassant);
  // Castling
  if(type==="K"){
    const row=color==="w"?7:0, opp=color==="w"?"b":"w";
    if(!isInCheck(board,color)){
      // Kingside
      if(board[row][7]===color+"R"&&!board[row][5]&&!board[row][6]
        &&!isUnderAttack(board,row,5,opp)&&!isUnderAttack(board,row,6,opp))
        moves.push([row,6,"castle-k"]);
      // Queenside
      if(board[row][0]===color+"R"&&!board[row][1]&&!board[row][2]&&!board[row][3]
        &&!isUnderAttack(board,row,3,opp)&&!isUnderAttack(board,row,2,opp))
        moves.push([row,2,"castle-q"]);
    }
  }
  return moves.filter(([nr,nc,flag])=>{
    const nb=cloneBoard(board);
    if(flag==="castle-k"){nb[color==="w"?7:0][5]=color+"R";nb[color==="w"?7:0][7]=null;}
    else if(flag==="castle-q"){nb[color==="w"?7:0][3]=color+"R";nb[color==="w"?7:0][0]=null;}
    if(type==="P"&&enPassant&&nr===enPassant[0]&&nc===enPassant[1]) nb[r][nc]=null;
    nb[nr][nc]=nb[r][c]; nb[r][c]=null;
    return !isInCheck(nb,color);
  });
}
function toAN(piece,from,to,capture,special){
  const t=piece[1],f=FILES[from[1]],tf=FILES[to[1]],tr=8-to[0];
  if(special==="castle-k") return "O-O";
  if(special==="castle-q") return "O-O-O";
  const cap=capture?"x":"";
  if(t==="P") return capture?`${f}x${tf}${tr}`:`${tf}${tr}`;
  return `${t}${cap}${tf}${tr}`;
}

function Piece({piece}){
  if(!piece) return null;
  return(
    <img
      src={PIECE_IMG[piece]}
      alt={piece}
      className="chess-piece-img"
      draggable={false}
      onError={e=>{e.target.style.display="none";}}
    />
  );
}

function PromotionPicker({color,onChoose}){
  return(
    <div className="promo-overlay">
      <div className="promo-box">
        <div className="promo-title">PROMOTE PAWN</div>
        <div className="promo-pieces">
          {["Q","R","B","N"].map(t=>(
            <button key={t} className="promo-btn" onClick={()=>onChoose(t)}>
              <img src={PIECE_IMG[color+t]} alt={t} className="promo-img" draggable={false}/>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function GameOverlay({title,sub,onNew}){
  return(
    <div className="go-overlay">
      <div className="go-box">
        <div className="go-icon"><TbChessKing size={40}/></div>
        <div className="go-title">{title}</div>
        <div className="go-sub">{sub}</div>
        <button className="go-btn" onClick={onNew}>New Game</button>
      </div>
    </div>
  );
}

// ── Edit mode: place arbitrary pieces ─────────────────────
const EDIT_PIECES = ["wK","wQ","wR","wB","wN","wP","bK","bQ","bR","bB","bN","bP"];

export default function ChessBoard(){
  const [board,        setBoard]       = useState(initBoard);
  const [selected,     setSelected]    = useState(null);
  const [highlights,   setHighlights]  = useState([]);
  const [turn,         setTurn]        = useState("w");
  const [enPassant,    setEnPassant]   = useState(null);
  const [castleRights, setCastleRights]= useState({wK:true,wQ:true,bK:true,bQ:true});
  const [promotion,    setPromotion]   = useState(null);
  const [gameState,    setGameState]   = useState("playing");
  const [flipped,      setFlipped]     = useState(false);
  const [moveHistory,  setMoveHistory] = useState([]);
  const [captured,     setCaptured]    = useState({w:[],b:[]});
  const [lastMove,     setLastMove]    = useState(null);
  const [editMode,     setEditMode]    = useState(false);
  const [editPiece,    setEditPiece]   = useState("wQ");
  const logRef=useRef(null);

  useEffect(()=>{ if(logRef.current) logRef.current.scrollTop=logRef.current.scrollHeight; },[moveHistory]);

  const matScore=(b,color)=>{
    let s=0;
    for(let r=0;r<8;r++) for(let c=0;c<8;c++){
      const p=b[r][c]; if(p&&pc(p)===color) s+=PIECE_VALUES[p[1]]||0;
    }
    return s;
  };
  const mat={
    w:matScore(board,"w"),b:matScore(board,"b"),
    diff:matScore(board,"w")-matScore(board,"b")
  };

  const rows=flipped?[0,1,2,3,4,5,6,7]:[7,6,5,4,3,2,1,0];
  const cols=flipped?[7,6,5,4,3,2,1,0]:[0,1,2,3,4,5,6,7];

  function resetGame(){
    setBoard(initBoard()); setSelected(null); setHighlights([]);
    setTurn("w"); setEnPassant(null);
    setCastleRights({wK:true,wQ:true,bK:true,bQ:true});
    setPromotion(null); setGameState("playing");
    setMoveHistory([]); setCaptured({w:[],b:[]}); setLastMove(null);
    setEditMode(false);
  }

  function handleSquare(r,c){
    if(gameState==="checkmate"||gameState==="stalemate") return;

    // Edit mode
    if(editMode){
      const nb=cloneBoard(board);
      if(editPiece==="erase") nb[r][c]=null;
      else nb[r][c]=editPiece;
      setBoard(nb); return;
    }

    const piece=board[r][c];
    if(selected){
      const [sr,sc]=selected;
      const move=highlights.find(([mr,mc])=>mr===r&&mc===c);
      if(move){
        const [,, flag]=move;
        const nb=cloneBoard(board);
        const moved=nb[sr][sc];
        const cap=nb[r][c];
        let newEP=null;
        let newCR={...castleRights};

        // En passant capture
        if(moved[1]==="P"&&enPassant&&r===enPassant[0]&&c===enPassant[1]){
          const capRow=moved[0]==="w"?r+1:r-1; // fix: use turn
          const capRowFix=turn==="w"?r+1:r-1;
          setCaptured(prev=>({...prev,[turn==="w"?"b":"w"]:[...prev[turn==="w"?"b":"w"],nb[capRowFix][c]]}));
          nb[capRowFix][c]=null;
        }
        // Castling
        if(flag==="castle-k"){
          const row=turn==="w"?7:0;
          nb[row][5]=turn+"R"; nb[row][7]=null;
        }
        if(flag==="castle-q"){
          const row=turn==="w"?7:0;
          nb[row][3]=turn+"R"; nb[row][0]=null;
        }
        // Double pawn push → en passant
        if(moved[1]==="P"&&Math.abs(r-sr)===2) newEP=[(sr+r)/2,c];
        // Castle rights
        if(moved==="wK") newCR={...newCR,wK:false,wQ:false};
        if(moved==="bK") newCR={...newCR,bK:false,bQ:false};
        if(moved==="wR"&&sc===7) newCR.wK=false;
        if(moved==="wR"&&sc===0) newCR.wQ=false;
        if(moved==="bR"&&sc===7) newCR.bK=false;
        if(moved==="bR"&&sc===0) newCR.bQ=false;

        if(cap) setCaptured(prev=>({...prev,[turn]:[...prev[turn],cap]}));

        nb[r][c]=moved; nb[sr][sc]=null;
        setLastMove([[sr,sc],[r,c]]);
        const an=toAN(moved,[sr,sc],[r,c],!!cap,flag);

        // Pawn promotion
        if(moved[1]==="P"&&(r===0||r===7)){
          setBoard(nb); setPromotion({r,c,an}); setSelected(null); setHighlights([]);
          setEnPassant(newEP); setCastleRights(newCR); return;
        }

        const opp=turn==="w"?"b":"w";
        const inChk=isInCheck(nb,opp);
        // Checkmate/stalemate check
        let hasLegal=false;
        outer: for(let br=0;br<8;br++) for(let bc=0;bc<8;bc++){
          if(pc(nb[br][bc])===opp){
            if(getLegalMoves(nb,br,bc,newEP).length>0){hasLegal=true; break outer;}
          }
        }
        let newGS="playing";
        if(!hasLegal) newGS=inChk?"checkmate":"stalemate";
        else if(inChk) newGS="check";

        setBoard(nb); setTurn(opp); setEnPassant(newEP); setCastleRights(newCR);
        setGameState(newGS);
        setMoveHistory(h=>[...h,{an,color:turn}]);
        setSelected(null); setHighlights([]);
      } else if(piece&&pc(piece)===turn){
        setSelected([r,c]);
        setHighlights(getLegalMoves(board,r,c,enPassant));
      } else{
        setSelected(null); setHighlights([]);
      }
    } else if(piece&&pc(piece)===turn){
      setSelected([r,c]);
      setHighlights(getLegalMoves(board,r,c,enPassant));
    }
  }

  function handlePromotion(type){
    const{r,c,an}=promotion;
    const nb=cloneBoard(board);
    nb[r][c]=turn+type;
    const opp=turn==="w"?"b":"w";
    const inChk=isInCheck(nb,opp);
    let hasLegal=false;
    outer: for(let br=0;br<8;br++) for(let bc=0;bc<8;bc++){
      if(pc(nb[br][bc])===opp) if(getLegalMoves(nb,br,bc,enPassant).length>0){hasLegal=true;break outer;}
    }
    let newGS="playing";
    if(!hasLegal) newGS=inChk?"checkmate":"stalemate";
    else if(inChk) newGS="check";
    setBoard(nb); setTurn(opp); setGameState(newGS);
    setMoveHistory(h=>[...h,{an:an+"="+type,color:turn}]);
    setPromotion(null);
  }

  function isSel(r,c){return selected&&selected[0]===r&&selected[1]===c;}
  function isHi(r,c){return highlights.some(([hr,hc])=>hr===r&&hc===c);}
  function isLast(r,c){return lastMove&&(lastMove[0][0]===r&&lastMove[0][1]===c||lastMove[1][0]===r&&lastMove[1][1]===c);}
  function isKingCheck(r,c){return board[r][c]&&board[r][c][1]==="K"&&pc(board[r][c])===turn&&gameState==="check";}

  return(
    <div className="chess-root">
      {/* ── TOP BAR ── */}
      <header className="chess-topbar">
        <a href="/" className="chess-tb-home" title="Home"><FiHome size={17}/></a>
        <div className="chess-tb-divider"/>
        <span className="chess-tb-brand">CUCHCO</span>
        <span className="chess-tb-slash">/</span>
        <span className="chess-tb-title">CHESS</span>
        <div style={{flex:1}}/>
        <button className={`chess-tb-btn${editMode?" chess-tb-btn-on":""}`} onClick={()=>setEditMode(m=>!m)}>
          <FiEdit2 size={14}/><span>Edit Board</span>
        </button>
        <button className="chess-tb-btn" onClick={()=>setFlipped(f=>!f)}>
          <FiRotateCcw size={14}/><span>Flip</span>
        </button>
        <button className="chess-tb-btn chess-tb-danger" onClick={resetGame}>
          <FiRotateCw size={14}/><span>New Game</span>
        </button>
        <a href="/chess" className="chess-tb-back">← Chess</a>
      </header>

      <div className="chess-body">

        {/* ── LEFT SIDEBAR ── */}
        <div className="chess-sidebar chess-sidebar-left">

          {/* Edit piece selector */}
          {editMode&&(
            <div className="edit-panel">
              <div className="edit-label">PLACE PIECE</div>
              <div className="edit-pieces-grid">
                {EDIT_PIECES.map(p=>(
                  <button key={p} className={`edit-piece-btn${editPiece===p?" on":""}`} onClick={()=>setEditPiece(p)}>
                    <img src={PIECE_IMG[p]} alt={p} draggable={false}/>
                  </button>
                ))}
                <button className={`edit-piece-btn edit-erase${editPiece==="erase"?" on":""}`} onClick={()=>setEditPiece("erase")}>
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Material */}
          <div className="chess-material">
            <div className="chess-player chess-player-top">
              <div className="chess-player-dot chess-dot-black"/>
              <span className="chess-player-name">Black</span>
              {mat.diff<0&&<span className="chess-mat-adv">+{Math.abs(mat.diff)}</span>}
            </div>
            <div className="chess-mat-bar-wrap">
              <div className="chess-mat-bar" style={{width:`${Math.min(100,50+mat.diff*3)}%`}}/>
            </div>
            <div className="chess-player chess-player-bottom">
              <div className="chess-player-dot chess-dot-white"/>
              <span className="chess-player-name">White</span>
              {mat.diff>0&&<span className="chess-mat-adv">+{mat.diff}</span>}
            </div>
          </div>

          {/* Turn indicator */}
          <div className={`chess-turn-badge chess-turn-${turn}`}>
            <div className={`chess-turn-dot chess-turn-dot-${turn}`}/>
            {gameState==="check"
              ? <span style={{color:"#ef4444"}}>{turn==="w"?"White":"Black"} in CHECK</span>
              : <span>{turn==="w"?"White":"Black"}'s turn</span>
            }
          </div>

          {/* Move history */}
          <div className="chess-history-label">MOVES</div>
          <div className="chess-move-log" ref={logRef}>
            {moveHistory.length===0
              ? <div className="chess-log-empty">No moves yet</div>
              : moveHistory.reduce((acc,mv,i)=>{
                  if(i%2===0) acc.push([mv]);
                  else acc[acc.length-1].push(mv);
                  return acc;
                },[]).map((pair,i)=>(
                  <div key={i} className="chess-log-row">
                    <span className="chess-log-n">{i+1}.</span>
                    <span className="chess-log-w">{pair[0]?.an}</span>
                    <span className="chess-log-b">{pair[1]?.an||""}</span>
                  </div>
                ))
            }
          </div>
        </div>

        {/* ── BOARD ── */}
        <div className="chess-board-wrap">
          <div className="chess-board-outer">
            {/* Rank labels left */}
            <div className="chess-labels-col">
              {rows.map(r=><div key={r} className="chess-rank-lbl">{8-r}</div>)}
            </div>

            <div>
              {/* File labels top */}
              <div className="chess-labels-row">
                {cols.map(c=><div key={c} className="chess-file-lbl">{FILES[c]}</div>)}
              </div>

              <div className="chess-board">
                {rows.map(r=>cols.map(c=>{
                  const light=(r+c)%2===0;
                  const piece=board[r][c];
                  const hi=isHi(r,c);
                  const sel=isSel(r,c);
                  const last=isLast(r,c);
                  const kchk=isKingCheck(r,c);
                  return(
                    <div
                      key={`${r}${c}`}
                      className={[
                        "chess-sq",
                        light?"chess-sq-l":"chess-sq-d",
                        sel?"chess-sq-sel":"",
                        last?"chess-sq-last":"",
                        kchk?"chess-sq-check":"",
                        hi&&piece?"chess-sq-capture":"",
                      ].filter(Boolean).join(" ")}
                      onClick={()=>handleSquare(r,c)}
                    >
                      <Piece piece={piece}/>
                      {hi&&!piece&&<div className="chess-dot"/>}
                      {hi&&piece&&<div className="chess-cap-ring"/>}
                    </div>
                  );
                }))}
              </div>

              {/* File labels bottom */}
              <div className="chess-labels-row">
                {cols.map(c=><div key={c} className="chess-file-lbl">{FILES[c]}</div>)}
              </div>
            </div>

            {/* Rank labels right */}
            <div className="chess-labels-col">
              {rows.map(r=><div key={r} className="chess-rank-lbl">{8-r}</div>)}
            </div>
          </div>
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <div className="chess-sidebar chess-sidebar-right">
          <div className="chess-captured-section">
            <div className="chess-cap-label">CAPTURED BY WHITE</div>
            <div className="chess-cap-grid">
              {captured.w.length===0
                ? <span className="chess-cap-empty">—</span>
                : captured.w.map((p,i)=><img key={i} src={PIECE_IMG[p]} alt={p} className="chess-cap-img" draggable={false}/>)
              }
            </div>
            <div className="chess-cap-label" style={{marginTop:16}}>CAPTURED BY BLACK</div>
            <div className="chess-cap-grid">
              {captured.b.length===0
                ? <span className="chess-cap-empty">—</span>
                : captured.b.map((p,i)=><img key={i} src={PIECE_IMG[p]} alt={p} className="chess-cap-img" draggable={false}/>)
              }
            </div>
          </div>
          <div className="chess-legend">
            <div className="chess-legend-title">CONTROLS</div>
            <div className="chess-legend-row"><div className="chess-dot-demo"/><span>Legal move</span></div>
            <div className="chess-legend-row"><div className="chess-cap-demo"/><span>Capture</span></div>
            <div className="chess-legend-row"><div className="chess-sel-demo"/><span>Selected</span></div>
          </div>
        </div>
      </div>

      {/* Overlays */}
      {promotion&&<PromotionPicker color={turn} onChoose={handlePromotion}/>}
      {gameState==="checkmate"&&(
        <GameOverlay
          title="CHECKMATE"
          sub={`${turn==="w"?"Black":"White"} wins!`}
          onNew={resetGame}
        />
      )}
      {gameState==="stalemate"&&(
        <GameOverlay title="STALEMATE" sub="Draw by stalemate" onNew={resetGame}/>
      )}
    </div>
  );
}
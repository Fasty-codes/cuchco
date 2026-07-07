// import { useState, useCallback, useEffect, useRef } from "react";
// import { FiHome, FiRotateCcw, FiRotateCw, FiFlag, FiEdit2 } from "react-icons/fi";
// import { TbChessKing } from "react-icons/tb";
// import "./ChessBoard.css";

// /* ============================================================
//    SVG CHESS PIECES — Chess.com style using Unicode SVG paths
//    We use the standard Wikimedia chess piece SVGs via CDN
//    ============================================================ */
// const PIECE_IMG = {
//   wK: "https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg",
//   wQ: "https://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg",
//   wR: "https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg",
//   wB: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg",
//   wN: "https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg",
//   wP: "https://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg",
//   bK: "https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg",
//   bQ: "https://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg",
//   bR: "https://upload.wikimedia.org/wikipedia/commons/f/ff/Chess_rdt45.svg",
//   bB: "https://upload.wikimedia.org/wikipedia/commons/9/98/Chess_bdt45.svg",
//   bN: "https://upload.wikimedia.org/wikipedia/commons/e/ef/Chess_ndt45.svg",
//   bP: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Chess_pdt45.svg",
// };

// const PIECE_VALUES = {K:0,Q:9,R:5,B:3,N:3,P:1};
// const FILES = ["a","b","c","d","e","f","g","h"];

// function initBoard(){
//   const b=Array(8).fill(null).map(()=>Array(8).fill(null));
//   b[0]=["bR","bN","bB","bQ","bK","bB","bN","bR"];
//   b[1]=Array(8).fill("bP");
//   b[6]=Array(8).fill("wP");
//   b[7]=["wR","wN","wB","wQ","wK","wB","wN","wR"];
//   return b;
// }
// function cloneBoard(b){return b.map(r=>[...r]);}
// function pc(p){return p?p[0]:null;}
// function inBounds(r,c){return r>=0&&r<8&&c>=0&&c<8;}

// function getRawMoves(board,r,c,enPassant=null){
//   const piece=board[r][c]; if(!piece) return [];
//   const color=pc(piece),type=piece[1],opp=color==="w"?"b":"w";
//   const moves=[];
//   const slide=(dr,dc)=>{
//     let nr=r+dr,nc=c+dc;
//     while(inBounds(nr,nc)){
//       if(!board[nr][nc]) moves.push([nr,nc]);
//       else{if(pc(board[nr][nc])===opp) moves.push([nr,nc]); break;}
//       nr+=dr; nc+=dc;
//     }
//   };
//   if(type==="R") [[-1,0],[1,0],[0,-1],[0,1]].forEach(([dr,dc])=>slide(dr,dc));
//   if(type==="B") [[-1,-1],[-1,1],[1,-1],[1,1]].forEach(([dr,dc])=>slide(dr,dc));
//   if(type==="Q") [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]].forEach(([dr,dc])=>slide(dr,dc));
//   if(type==="N") [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].forEach(([dr,dc])=>{
//     const nr=r+dr,nc=c+dc;
//     if(inBounds(nr,nc)&&pc(board[nr][nc])!==color) moves.push([nr,nc]);
//   });
//   if(type==="K"){
//     [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]].forEach(([dr,dc])=>{
//       const nr=r+dr,nc=c+dc;
//       if(inBounds(nr,nc)&&pc(board[nr][nc])!==color) moves.push([nr,nc]);
//     });
//   }
//   if(type==="P"){
//     const dir=color==="w"?-1:1, startRow=color==="w"?6:1;
//     if(inBounds(r+dir,c)&&!board[r+dir][c]){
//       moves.push([r+dir,c]);
//       if(r===startRow&&!board[r+2*dir][c]) moves.push([r+2*dir,c]);
//     }
//     [-1,1].forEach(dc=>{
//       const nr=r+dir,nc=c+dc;
//       if(inBounds(nr,nc)){
//         if(pc(board[nr][nc])===opp) moves.push([nr,nc]);
//         if(enPassant&&enPassant[0]===nr&&enPassant[1]===nc) moves.push([nr,nc]);
//       }
//     });
//   }
//   return moves;
// }

// function findKing(board,color){
//   for(let r=0;r<8;r++) for(let c=0;c<8;c++) if(board[r][c]===color+"K") return[r,c];
//   return null;
// }
// function isUnderAttack(board,r,c,byColor){
//   for(let br=0;br<8;br++) for(let bc=0;bc<8;bc++){
//     if(pc(board[br][bc])===byColor){
//       const ms=getRawMoves(board,br,bc,null);
//       if(ms.some(([mr,mc])=>mr===r&&mc===c)) return true;
//     }
//   }
//   return false;
// }
// function isInCheck(board,color){
//   const k=findKing(board,color); if(!k) return false;
//   return isUnderAttack(board,k[0],k[1],color==="w"?"b":"w");
// }
// function getLegalMoves(board,r,c,enPassant){
//   const piece=board[r][c]; if(!piece) return [];
//   const color=pc(piece),type=piece[1];
//   let moves=getRawMoves(board,r,c,enPassant);
//   // Castling
//   if(type==="K"){
//     const row=color==="w"?7:0, opp=color==="w"?"b":"w";
//     if(!isInCheck(board,color)){
//       // Kingside
//       if(board[row][7]===color+"R"&&!board[row][5]&&!board[row][6]
//         &&!isUnderAttack(board,row,5,opp)&&!isUnderAttack(board,row,6,opp))
//         moves.push([row,6,"castle-k"]);
//       // Queenside
//       if(board[row][0]===color+"R"&&!board[row][1]&&!board[row][2]&&!board[row][3]
//         &&!isUnderAttack(board,row,3,opp)&&!isUnderAttack(board,row,2,opp))
//         moves.push([row,2,"castle-q"]);
//     }
//   }
//   return moves.filter(([nr,nc,flag])=>{
//     const nb=cloneBoard(board);
//     if(flag==="castle-k"){nb[color==="w"?7:0][5]=color+"R";nb[color==="w"?7:0][7]=null;}
//     else if(flag==="castle-q"){nb[color==="w"?7:0][3]=color+"R";nb[color==="w"?7:0][0]=null;}
//     if(type==="P"&&enPassant&&nr===enPassant[0]&&nc===enPassant[1]) nb[r][nc]=null;
//     nb[nr][nc]=nb[r][c]; nb[r][c]=null;
//     return !isInCheck(nb,color);
//   });
// }
// function toAN(piece,from,to,capture,special){
//   const t=piece[1],f=FILES[from[1]],tf=FILES[to[1]],tr=8-to[0];
//   if(special==="castle-k") return "O-O";
//   if(special==="castle-q") return "O-O-O";
//   const cap=capture?"x":"";
//   if(t==="P") return capture?`${f}x${tf}${tr}`:`${tf}${tr}`;
//   return `${t}${cap}${tf}${tr}`;
// }

// function Piece({piece}){
//   if(!piece) return null;
//   return(
//     <img
//       src={PIECE_IMG[piece]}
//       alt={piece}
//       className="chess-piece-img"
//       draggable={false}
//       onError={e=>{e.target.style.display="none";}}
//     />
//   );
// }

// function PromotionPicker({color,onChoose}){
//   return(
//     <div className="promo-overlay">
//       <div className="promo-box">
//         <div className="promo-title">PROMOTE PAWN</div>
//         <div className="promo-pieces">
//           {["Q","R","B","N"].map(t=>(
//             <button key={t} className="promo-btn" onClick={()=>onChoose(t)}>
//               <img src={PIECE_IMG[color+t]} alt={t} className="promo-img" draggable={false}/>
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// function GameOverlay({title,sub,onNew}){
//   return(
//     <div className="go-overlay">
//       <div className="go-box">
//         <div className="go-icon"><TbChessKing size={40}/></div>
//         <div className="go-title">{title}</div>
//         <div className="go-sub">{sub}</div>
//         <button className="go-btn" onClick={onNew}>New Game</button>
//       </div>
//     </div>
//   );
// }

// // ── Edit mode: place arbitrary pieces ─────────────────────
// const EDIT_PIECES = ["wK","wQ","wR","wB","wN","wP","bK","bQ","bR","bB","bN","bP"];

// export default function ChessBoard(){
//   // Apply theme from localStorage on mount
//   useEffect(() => {
//     const t = localStorage.getItem("cuchco-theme") || "dark";
//     const resolved = t === "system"
//       ? (window.matchMedia("(prefers-color-scheme:light)").matches ? "light" : "dark")
//       : t;
//     document.documentElement.setAttribute("data-theme", resolved);
//   }, []);

//   const [board,        setBoard]       = useState(initBoard);
//   const [selected,     setSelected]    = useState(null);
//   const [highlights,   setHighlights]  = useState([]);
//   const [turn,         setTurn]        = useState("w");
//   const [enPassant,    setEnPassant]   = useState(null);
//   const [castleRights, setCastleRights]= useState({wK:true,wQ:true,bK:true,bQ:true});
//   const [promotion,    setPromotion]   = useState(null);
//   const [gameState,    setGameState]   = useState("playing");
//   const [flipped,      setFlipped]     = useState(false);
//   const [moveHistory,  setMoveHistory] = useState([]);
//   const [captured,     setCaptured]    = useState({w:[],b:[]});
//   const [lastMove,     setLastMove]    = useState(null);
//   const [editMode,     setEditMode]    = useState(false);
//   const [editPiece,    setEditPiece]   = useState("wQ");
//   const logRef=useRef(null);

//   useEffect(()=>{ if(logRef.current) logRef.current.scrollTop=logRef.current.scrollHeight; },[moveHistory]);

//   const matScore=(b,color)=>{
//     let s=0;
//     for(let r=0;r<8;r++) for(let c=0;c<8;c++){
//       const p=b[r][c]; if(p&&pc(p)===color) s+=(PIECE_VALUES[p[1]]||0);
//     }
//     return s;
//   };
//   const mat={
//     w:matScore(board,"w"),b:matScore(board,"b"),
//     diff:matScore(board,"w")-matScore(board,"b")
//   };

//   const rows=flipped?[0,1,2,3,4,5,6,7]:[7,6,5,4,3,2,1,0];
//   const cols=flipped?[7,6,5,4,3,2,1,0]:[0,1,2,3,4,5,6,7];

//   function resetGame(){
//     setBoard(initBoard()); setSelected(null); setHighlights([]);
//     setTurn("w"); setEnPassant(null);
//     setCastleRights({wK:true,wQ:true,bK:true,bQ:true});
//     setPromotion(null); setGameState("playing");
//     setMoveHistory([]); setCaptured({w:[],b:[]}); setLastMove(null);
//     setEditMode(false);
//   }

//   function handleSquare(r,c){
//     if(gameState==="checkmate"||gameState==="stalemate") return;

//     // Edit mode
//     if(editMode){
//       const nb=cloneBoard(board);
//       if(editPiece==="erase") nb[r][c]=null;
//       else nb[r][c]=editPiece;
//       setBoard(nb); return;
//     }

//     const piece=board[r][c];
//     if(selected){
//       const [sr,sc]=selected;
//       const move=highlights.find(([mr,mc])=>mr===r&&mc===c);
//       if(move){
//         const [,, flag]=move;
//         const nb=cloneBoard(board);
//         const moved=nb[sr][sc];
//         const cap=nb[r][c];
//         let newEP=null;
//         let newCR={...castleRights};

//         // En passant capture
//         if(moved[1]==="P"&&enPassant&&r===enPassant[0]&&c===enPassant[1]){
//           const capRow=moved[0]==="w"?r+1:r-1; // fix: use turn
//           const capRowFix=turn==="w"?r+1:r-1;
//           setCaptured(prev=>({...prev,[turn==="w"?"b":"w"]:[...prev[turn==="w"?"b":"w"],nb[capRowFix][c]]}));
//           nb[capRowFix][c]=null;
//         }
//         // Castling
//         if(flag==="castle-k"){
//           const row=turn==="w"?7:0;
//           nb[row][5]=turn+"R"; nb[row][7]=null;
//         }
//         if(flag==="castle-q"){
//           const row=turn==="w"?7:0;
//           nb[row][3]=turn+"R"; nb[row][0]=null;
//         }
//         // Double pawn push → en passant
//         if(moved[1]==="P"&&Math.abs(r-sr)===2) newEP=[(sr+r)/2,c];
//         // Castle rights
//         if(moved==="wK") newCR={...newCR,wK:false,wQ:false};
//         if(moved==="bK") newCR={...newCR,bK:false,bQ:false};
//         if(moved==="wR"&&sc===7) newCR.wK=false;
//         if(moved==="wR"&&sc===0) newCR.wQ=false;
//         if(moved==="bR"&&sc===7) newCR.bK=false;
//         if(moved==="bR"&&sc===0) newCR.bQ=false;

//         if(cap) setCaptured(prev=>({...prev,[turn]:[...prev[turn],cap]}));

//         nb[r][c]=moved; nb[sr][sc]=null;
//         setLastMove([[sr,sc],[r,c]]);
//         const an=toAN(moved,[sr,sc],[r,c],!!cap,flag);

//         // Pawn promotion
//         if(moved[1]==="P"&&(r===0||r===7)){
//           setBoard(nb); setPromotion({r,c,an}); setSelected(null); setHighlights([]);
//           setEnPassant(newEP); setCastleRights(newCR); return;
//         }

//         const opp=turn==="w"?"b":"w";
//         const inChk=isInCheck(nb,opp);
//         // Checkmate/stalemate check
//         let hasLegal=false;
//         outer: for(let br=0;br<8;br++) for(let bc=0;bc<8;bc++){
//           if(pc(nb[br][bc])===opp){
//             if(getLegalMoves(nb,br,bc,newEP).length>0){hasLegal=true; break outer;}
//           }
//         }
//         let newGS="playing";
//         if(!hasLegal) newGS=inChk?"checkmate":"stalemate";
//         else if(inChk) newGS="check";

//         setBoard(nb); setTurn(opp); setEnPassant(newEP); setCastleRights(newCR);
//         setGameState(newGS);
//         setMoveHistory(h=>[...h,{an,color:turn}]);
//         setSelected(null); setHighlights([]);
//       } else if(piece&&pc(piece)===turn){
//         setSelected([r,c]);
//         setHighlights(getLegalMoves(board,r,c,enPassant));
//       } else{
//         setSelected(null); setHighlights([]);
//       }
//     } else if(piece&&pc(piece)===turn){
//       setSelected([r,c]);
//       setHighlights(getLegalMoves(board,r,c,enPassant));
//     }
//   }

//   function handlePromotion(type){
//     const{r,c,an}=promotion;
//     const nb=cloneBoard(board);
//     nb[r][c]=turn+type;
//     const opp=turn==="w"?"b":"w";
//     const inChk=isInCheck(nb,opp);
//     let hasLegal=false;
//     outer: for(let br=0;br<8;br++) for(let bc=0;bc<8;bc++){
//       if(pc(nb[br][bc])===opp) if(getLegalMoves(nb,br,bc,enPassant).length>0){hasLegal=true;break outer;}
//     }
//     let newGS="playing";
//     if(!hasLegal) newGS=inChk?"checkmate":"stalemate";
//     else if(inChk) newGS="check";
//     setBoard(nb); setTurn(opp); setGameState(newGS);
//     setMoveHistory(h=>[...h,{an:an+"="+type,color:turn}]);
//     setPromotion(null);
//   }

//   function isSel(r,c){return selected&&selected[0]===r&&selected[1]===c;}
//   function isHi(r,c){return highlights.some(([hr,hc])=>hr===r&&hc===c);}
//   function isLast(r,c){return lastMove&&((lastMove[0][0]===r&&lastMove[0][1]===c)||(lastMove[1][0]===r&&lastMove[1][1]===c));}
//   function isKingCheck(r,c){return board[r][c]&&board[r][c][1]==="K"&&pc(board[r][c])===turn&&gameState==="check";}

//   return(
//     <div className="chess-root">
//       {/* ── TOP BAR ── */}
//       <header className="chess-topbar">
//         <a href="/" className="chess-tb-home" title="Home"><FiHome size={17}/></a>
//         <div className="chess-tb-divider"/>
//         <span className="chess-tb-brand">CUCHCO</span>
//         <span className="chess-tb-slash">/</span>
//         <span className="chess-tb-title">CHESS</span>
//         <div style={{flex:1}}/>
//         <button className={`chess-tb-btn${editMode?" chess-tb-btn-on":""}`} onClick={()=>setEditMode(m=>!m)}>
//           <FiEdit2 size={14}/><span>Edit Board</span>
//         </button>
//         <button className="chess-tb-btn" onClick={()=>setFlipped(f=>!f)}>
//           <FiRotateCcw size={14}/><span>Flip</span>
//         </button>
//         <button className="chess-tb-btn chess-tb-danger" onClick={resetGame}>
//           <FiRotateCw size={14}/><span>New Game</span>
//         </button>
//         <a href="/chess" className="chess-tb-back">← Chess</a>
//       </header>

//       <div className="chess-body">

//         {/* ── LEFT SIDEBAR ── */}
//         <div className="chess-sidebar chess-sidebar-left">

//           {/* Edit piece selector */}
//           {editMode&&(
//             <div className="edit-panel">
//               <div className="edit-label">PLACE PIECE</div>
//               <div className="edit-pieces-grid">
//                 {EDIT_PIECES.map(p=>(
//                   <button key={p} className={`edit-piece-btn${editPiece===p?" on":""}`} onClick={()=>setEditPiece(p)}>
//                     <img src={PIECE_IMG[p]} alt={p} draggable={false}/>
//                   </button>
//                 ))}
//                 <button className={`edit-piece-btn edit-erase${editPiece==="erase"?" on":""}`} onClick={()=>setEditPiece("erase")}>
//                   ✕
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Material */}
//           <div className="chess-material">
//             <div className="chess-player chess-player-top">
//               <div className="chess-player-dot chess-dot-black"/>
//               <span className="chess-player-name">Black</span>
//               {mat.diff<0&&<span className="chess-mat-adv">+{Math.abs(mat.diff)}</span>}
//             </div>
//             <div className="chess-mat-bar-wrap">
//               <div className="chess-mat-bar" style={{width:`${Math.min(100,50+mat.diff*3)}%`}}/>
//             </div>
//             <div className="chess-player chess-player-bottom">
//               <div className="chess-player-dot chess-dot-white"/>
//               <span className="chess-player-name">White</span>
//               {mat.diff>0&&<span className="chess-mat-adv">+{mat.diff}</span>}
//             </div>
//           </div>

//           {/* Turn indicator */}
//           <div className={`chess-turn-badge chess-turn-${turn}`}>
//             <div className={`chess-turn-dot chess-turn-dot-${turn}`}/>
//             {gameState==="check"
//               ? <span style={{color:"#ef4444"}}>{turn==="w"?"White":"Black"} in CHECK</span>
//               : <span>{turn==="w"?"White":"Black"}'s turn</span>
//             }
//           </div>

//           {/* Move history */}
//           <div className="chess-history-label">MOVES</div>
//           <div className="chess-move-log" ref={logRef}>
//             {moveHistory.length===0
//               ? <div className="chess-log-empty">No moves yet</div>
//               : moveHistory.reduce((acc,mv,i)=>{
//                   if(i%2===0) acc.push([mv]);
//                   else acc[acc.length-1].push(mv);
//                   return acc;
//                 },[]).map((pair,i)=>(
//                   <div key={i} className="chess-log-row">
//                     <span className="chess-log-n">{i+1}.</span>
//                     <span className="chess-log-w">{pair[0]?.an}</span>
//                     <span className="chess-log-b">{pair[1]?.an||""}</span>
//                   </div>
//                 ))
//             }
//           </div>
//         </div>

//         {/* ── BOARD ── */}
//         <div className="chess-board-wrap">
//           <div className="chess-board-outer">
//             {/* Rank labels left */}
//             <div className="chess-labels-col">
//               {rows.map(r=><div key={r} className="chess-rank-lbl">{8-r}</div>)}
//             </div>

//             <div>
//               {/* File labels top */}
//               <div className="chess-labels-row">
//                 {cols.map(c=><div key={c} className="chess-file-lbl">{FILES[c]}</div>)}
//               </div>

//               <div className="chess-board">
//                 {rows.map(r=>cols.map(c=>{
//                   const light=(r+c)%2===0;
//                   const piece=board[r][c];
//                   const hi=isHi(r,c);
//                   const sel=isSel(r,c);
//                   const last=isLast(r,c);
//                   const kchk=isKingCheck(r,c);
//                   return(
//                     <div
//                       key={`${r}${c}`}
//                       className={[
//                         "chess-sq",
//                         light?"chess-sq-l":"chess-sq-d",
//                         sel?"chess-sq-sel":"",
//                         last?"chess-sq-last":"",
//                         kchk?"chess-sq-check":"",
//                         hi&&piece?"chess-sq-capture":"",
//                       ].filter(Boolean).join(" ")}
//                       onClick={()=>handleSquare(r,c)}
//                     >
//                       <Piece piece={piece}/>
//                       {hi&&!piece&&<div className="chess-dot"/>}
//                       {hi&&piece&&<div className="chess-cap-ring"/>}
//                     </div>
//                   );
//                 }))}
//               </div>

//               {/* File labels bottom */}
//               <div className="chess-labels-row">
//                 {cols.map(c=><div key={c} className="chess-file-lbl">{FILES[c]}</div>)}
//               </div>
//             </div>

//             {/* Rank labels right */}
//             <div className="chess-labels-col">
//               {rows.map(r=><div key={r} className="chess-rank-lbl">{8-r}</div>)}
//             </div>
//           </div>
//         </div>

//         {/* ── RIGHT SIDEBAR ── */}
//         <div className="chess-sidebar chess-sidebar-right">
//           <div className="chess-captured-section">
//             <div className="chess-cap-label">CAPTURED BY WHITE</div>
//             <div className="chess-cap-grid">
//               {captured.w.length===0
//                 ? <span className="chess-cap-empty">—</span>
//                 : captured.w.map((p,i)=><img key={i} src={PIECE_IMG[p]} alt={p} className="chess-cap-img" draggable={false}/>)
//               }
//             </div>
//             <div className="chess-cap-label" style={{marginTop:16}}>CAPTURED BY BLACK</div>
//             <div className="chess-cap-grid">
//               {captured.b.length===0
//                 ? <span className="chess-cap-empty">—</span>
//                 : captured.b.map((p,i)=><img key={i} src={PIECE_IMG[p]} alt={p} className="chess-cap-img" draggable={false}/>)
//               }
//             </div>
//           </div>
//           <div className="chess-legend">
//             <div className="chess-legend-title">CONTROLS</div>
//             <div className="chess-legend-row"><div className="chess-dot-demo"/><span>Legal move</span></div>
//             <div className="chess-legend-row"><div className="chess-cap-demo"/><span>Capture</span></div>
//             <div className="chess-legend-row"><div className="chess-sel-demo"/><span>Selected</span></div>
//           </div>
//         </div>
//       </div>

//       {/* Overlays */}
//       {promotion&&<PromotionPicker color={turn} onChoose={handlePromotion}/>}
//       {gameState==="checkmate"&&(
//         <GameOverlay
//           title="CHECKMATE"
//           sub={`${turn==="w"?"Black":"White"} wins!`}
//           onNew={resetGame}
//         />
//       )}
//       {gameState==="stalemate"&&(
//         <GameOverlay title="STALEMATE" sub="Draw by stalemate" onNew={resetGame}/>
//       )}
//     </div>
//   );
// }
import { useState, useEffect, useRef } from "react";
import { FiHome, FiRotateCcw, FiRotateCw, FiFlag, FiEdit2, FiCpu, FiUsers } from "react-icons/fi";
import { TbChessKing } from "react-icons/tb";
import "./ChessBoard.css";

/* ─── PIECE IMAGES ──────────────────────────────────────── */
const PIECE_IMG = {
  wK:"https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg",
  wQ:"https://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg",
  wR:"https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg",
  wB:"https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg",
  wN:"https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg",
  wP:"https://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg",
  bK:"https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg",
  bQ:"https://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg",
  bR:"https://upload.wikimedia.org/wikipedia/commons/f/ff/Chess_rdt45.svg",
  bB:"https://upload.wikimedia.org/wikipedia/commons/9/98/Chess_bdt45.svg",
  bN:"https://upload.wikimedia.org/wikipedia/commons/e/ef/Chess_ndt45.svg",
  bP:"https://upload.wikimedia.org/wikipedia/commons/c/c7/Chess_pdt45.svg",
};
const PIECE_VALUES = {K:0,Q:9,R:5,B:3,N:3,P:1};
const FILES = ["a","b","c","d","e","f","g","h"];

/* ─── AI BOTS ────────────────────────────────────────────── */
const BOTS = [
  { id:"bot_300",  name:"Pawn Pete",     elo:300,  depth:1, rand:0.9, color:"#94a3b8", emoji:"🐣" },
  { id:"bot_600",  name:"Rook Rookie",   elo:600,  depth:1, rand:0.6, color:"#22c55e", emoji:"♜" },
  { id:"bot_900",  name:"Bishop Belle",  elo:900,  depth:2, rand:0.4, color:"#3b82f6", emoji:"♝" },
  { id:"bot_1200", name:"Knight Nate",   elo:1200, depth:2, rand:0.2, color:"#a855f7", emoji:"♞" },
  { id:"bot_1500", name:"Queen Quinn",   elo:1500, depth:3, rand:0.1, color:"#f59e0b", emoji:"♛" },
  { id:"bot_1800", name:"Magnus Jr.",    elo:1800, depth:3, rand:0.04,color:"#ef4444", emoji:"👑" },
  { id:"bot_2200", name:"Deep Mind",     elo:2200, depth:4, rand:0.01,color:"#0ea5e9", emoji:"🤖" },
];

/* ─── ELO CALCULATION ────────────────────────────────────── */
function calcElo(myElo, oppElo, result) {  // result: 1=win, 0.5=draw, 0=loss
  const K = myElo < 1000 ? 40 : myElo < 2000 ? 20 : 10;
  const expected = 1 / (1 + Math.pow(10, (oppElo - myElo) / 400));
  return Math.round(myElo + K * (result - expected));
}

/* ─── CHESS LOGIC ────────────────────────────────────────── */
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
  if(type==="K"){
    const row=color==="w"?7:0, opp=color==="w"?"b":"w";
    if(!isInCheck(board,color)){
      if(board[row][7]===color+"R"&&!board[row][5]&&!board[row][6]
        &&!isUnderAttack(board,row,5,opp)&&!isUnderAttack(board,row,6,opp))
        moves.push([row,6,"castle-k"]);
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
function getAllLegalMoves(board,color,enPassant){
  const all=[];
  for(let r=0;r<8;r++) for(let c=0;c<8;c++)
    if(pc(board[r][c])===color) getLegalMoves(board,r,c,enPassant).forEach(m=>all.push({r,c,m}));
  return all;
}
function toAN(piece,from,to,capture,special){
  const t=piece[1],f=FILES[from[1]],tf=FILES[to[1]],tr=8-to[0];
  if(special==="castle-k") return "O-O";
  if(special==="castle-q") return "O-O-O";
  const cap=capture?"x":"";
  if(t==="P") return capture?`${f}x${tf}${tr}`:`${tf}${tr}`;
  return `${t}${cap}${tf}${tr}`;
}

/* ─── AI ENGINE (minimax + alpha-beta) ───────────────────── */
// Piece-square tables for positional evaluation
const PST = {
  P: [
    [0,0,0,0,0,0,0,0],[50,50,50,50,50,50,50,50],
    [10,10,20,30,30,20,10,10],[5,5,10,25,25,10,5,5],
    [0,0,0,20,20,0,0,0],[5,-5,-10,0,0,-10,-5,5],
    [5,10,10,-20,-20,10,10,5],[0,0,0,0,0,0,0,0]
  ],
  N: [
    [-50,-40,-30,-30,-30,-30,-40,-50],[-40,-20,0,0,0,0,-20,-40],
    [-30,0,10,15,15,10,0,-30],[-30,5,15,20,20,15,5,-30],
    [-30,0,15,20,20,15,0,-30],[-30,5,10,15,15,10,5,-30],
    [-40,-20,0,5,5,0,-20,-40],[-50,-40,-30,-30,-30,-30,-40,-50]
  ],
  B: [
    [-20,-10,-10,-10,-10,-10,-10,-20],[-10,0,0,0,0,0,0,-10],
    [-10,0,5,10,10,5,0,-10],[-10,5,5,10,10,5,5,-10],
    [-10,0,10,10,10,10,0,-10],[-10,10,10,10,10,10,10,-10],
    [-10,5,0,0,0,0,5,-10],[-20,-10,-10,-10,-10,-10,-10,-20]
  ],
  R: [
    [0,0,0,0,0,0,0,0],[5,10,10,10,10,10,10,5],
    [-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],
    [-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],
    [-5,0,0,0,0,0,0,-5],[0,0,0,5,5,0,0,0]
  ],
  Q: [
    [-20,-10,-10,-5,-5,-10,-10,-20],[-10,0,0,0,0,0,0,-10],
    [-10,0,5,5,5,5,0,-10],[-5,0,5,5,5,5,0,-5],
    [0,0,5,5,5,5,0,-5],[-10,5,5,5,5,5,0,-10],
    [-10,0,5,0,0,0,0,-10],[-20,-10,-10,-5,-5,-10,-10,-20]
  ],
  K: [
    [-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],
    [-20,-30,-30,-40,-40,-30,-30,-20],[-10,-20,-20,-20,-20,-20,-20,-10],
    [20,20,0,0,0,0,20,20],[20,30,10,0,0,10,30,20]
  ],
};

function evalBoard(board) {
  let score = 0;
  for(let r=0;r<8;r++) for(let c=0;c<8;c++){
    const p=board[r][c]; if(!p) continue;
    const color=pc(p), type=p[1];
    const val = PIECE_VALUES[type]*100;
    const pst = PST[type];
    const pstVal = color==="w" ? pst[r][c] : pst[7-r][7-c];
    score += color==="w" ? (val+pstVal) : -(val+pstVal);
  }
  return score;
}

function applyMove(board,r,c,nr,nc,flag,enPassant){
  const nb=cloneBoard(board);
  const moved=nb[r][c];
  if(flag==="castle-k"){nb[pc(moved)==="w"?7:0][5]=pc(moved)+"R";nb[pc(moved)==="w"?7:0][7]=null;}
  else if(flag==="castle-q"){nb[pc(moved)==="w"?7:0][3]=pc(moved)+"R";nb[pc(moved)==="w"?7:0][0]=null;}
  if(moved[1]==="P"&&enPassant&&nr===enPassant[0]&&nc===enPassant[1]){
    nb[pc(moved)==="w"?nr+1:nr-1][nc]=null;
  }
  nb[nr][nc]=moved; nb[r][c]=null;
  // Auto-queen promotion
  if(moved[1]==="P"&&(nr===0||nr===7)) nb[nr][nc]=pc(moved)+"Q";
  return nb;
}

function minimax(board,depth,alpha,beta,isMax,enPassant){
  const color = isMax ? "w" : "b";
  const allMoves = getAllLegalMoves(board,color,enPassant);
  if(depth===0 || allMoves.length===0){
    if(allMoves.length===0){
      if(isInCheck(board,color)) return isMax ? -99999 : 99999;
      return 0; // stalemate
    }
    return evalBoard(board);
  }
  if(isMax){
    let best=-Infinity;
    for(const {r,c,m} of allMoves){
      const [nr,nc,flag]=m;
      const nb=applyMove(board,r,c,nr,nc,flag,enPassant);
      let newEP=null;
      if(board[r][c]&&board[r][c][1]==="P"&&Math.abs(nr-r)===2) newEP=[(r+nr)/2,c];
      const val=minimax(nb,depth-1,alpha,beta,false,newEP);
      best=Math.max(best,val); alpha=Math.max(alpha,best);
      if(beta<=alpha) break;
    }
    return best;
  } else {
    let best=Infinity;
    for(const {r,c,m} of allMoves){
      const [nr,nc,flag]=m;
      const nb=applyMove(board,r,c,nr,nc,flag,enPassant);
      let newEP=null;
      if(board[r][c]&&board[r][c][1]==="P"&&Math.abs(nr-r)===2) newEP=[(r+nr)/2,c];
      const val=minimax(nb,depth-1,alpha,beta,true,newEP);
      best=Math.min(best,val); beta=Math.min(beta,best);
      if(beta<=alpha) break;
    }
    return best;
  }
}

function getBotMove(board,enPassant,bot){
  const {depth,rand}=bot;
  const allMoves=getAllLegalMoves(board,"b",enPassant);
  if(allMoves.length===0) return null;
  // Random move for weak bots
  if(Math.random()<rand) return allMoves[Math.floor(Math.random()*allMoves.length)];
  let best=Infinity, bestMoves=[];
  for(const mv of allMoves){
    const [nr,nc,flag]=mv.m;
    const nb=applyMove(board,mv.r,mv.c,nr,nc,flag,enPassant);
    let newEP=null;
    if(board[mv.r][mv.c]&&board[mv.r][mv.c][1]==="P"&&Math.abs(nr-mv.r)===2) newEP=[(mv.r+nr)/2,mv.c];
    const val=minimax(nb,depth-1,-Infinity,Infinity,true,newEP);
    if(val<best){ best=val; bestMoves=[mv]; }
    else if(val===best) bestMoves.push(mv);
  }
  return bestMoves[Math.floor(Math.random()*bestMoves.length)];
}

/* ─── COMPONENTS ─────────────────────────────────────────── */
function Piece({piece}){
  if(!piece) return null;
  return <img src={PIECE_IMG[piece]} alt={piece} className="chess-piece-img" draggable={false} onError={e=>{e.target.style.display="none";}}/>;
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

/* ─── ELO DISPLAY ────────────────────────────────────────── */
function EloBar({elo,change}){
  const getRank=(e)=>{
    if(e<600)  return {rank:"Beginner",   color:"#94a3b8"};
    if(e<900)  return {rank:"Amateur",    color:"#22c55e"};
    if(e<1200) return {rank:"Intermediate",color:"#3b82f6"};
    if(e<1500) return {rank:"Advanced",   color:"#a855f7"};
    if(e<1800) return {rank:"Expert",     color:"#f59e0b"};
    if(e<2000) return {rank:"Master",     color:"#ef4444"};
    return              {rank:"Grandmaster",color:"#0ea5e9"};
  };
  const {rank,color}=getRank(elo);
  return(
    <div className="elo-bar">
      <div className="elo-crown">👑</div>
      <div className="elo-info">
        <div className="elo-num">{elo}</div>
        <div className="elo-rank" style={{color}}>{rank}</div>
      </div>
      {change!=null&&(
        <div className={`elo-change ${change>=0?"elo-up":"elo-down"}`}>
          {change>=0?"+":""}{change}
        </div>
      )}
    </div>
  );
}

/* ─── MODE SELECTOR ──────────────────────────────────────── */
function ModeSelector({onSelect}){
  return(
    <div className="mode-overlay">
      <div className="mode-box">
        <div className="mode-logo">CUCHCO CHESS</div>
        <div className="mode-title">Choose Game Mode</div>
        <div className="mode-cards">
          <button className="mode-card" onClick={()=>onSelect("2p")}>
            <FiUsers size={32}/>
            <div className="mode-card-name">2 Player</div>
            <div className="mode-card-sub">Play against a friend on the same device</div>
          </button>
          <button className="mode-card mode-card-ai" onClick={()=>onSelect("ai")}>
            <FiCpu size={32}/>
            <div className="mode-card-name">vs AI</div>
            <div className="mode-card-sub">Challenge bots and earn ELO rating</div>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── BOT SELECTOR (full AI mode screen) ─────────────────── */
const RANK_INFO = [
  {min:0,    max:599,  rank:"Beginner",    color:"#94a3b8", next:600},
  {min:600,  max:899,  rank:"Amateur",     color:"#22c55e", next:900},
  {min:900,  max:1199, rank:"Intermediate",color:"#3b82f6", next:1200},
  {min:1200, max:1499, rank:"Advanced",    color:"#a855f7", next:1500},
  {min:1500, max:1799, rank:"Expert",      color:"#f59e0b", next:1800},
  {min:1800, max:1999, rank:"Master",      color:"#ef4444", next:2000},
  {min:2000, max:9999, rank:"Grandmaster", color:"#0ea5e9", next:null},
];
function getRankInfo(elo){
  return RANK_INFO.find(r=>elo>=r.min&&elo<=r.max)||RANK_INFO[0];
}

function BotSelector({playerElo, matchHistory, onSelect, onBack, onResetElo}){
  const ri = getRankInfo(playerElo);
  const progress = ri.next
    ? Math.round(((playerElo - ri.min) / (ri.next - ri.min)) * 100)
    : 100;

  // Win/loss stats from match history
  const wins   = matchHistory.filter(m=>m.result===1).length;
  const losses = matchHistory.filter(m=>m.result===0).length;
  const draws  = matchHistory.filter(m=>m.result===0.5).length;

  const TIERS = [
    { label:"BEGINNER",     bots: BOTS.filter(b=>b.elo<=600)  },
    { label:"INTERMEDIATE", bots: BOTS.filter(b=>b.elo>600&&b.elo<=1200) },
    { label:"ADVANCED",     bots: BOTS.filter(b=>b.elo>1200)  },
  ];

  return(
    <div className="bs-root">
      {/* ── top bar ── */}
      <div className="bs-topbar">
        <button className="bs-back-btn" onClick={onBack}>← Back</button>
        <span className="bs-topbar-logo">CUCHCO <span>CHESS</span></span>
        <div style={{flex:1}}/>
        <span className="bs-mode-label"><FiCpu size={12}/> AI MODE</span>
      </div>

      <div className="bs-body">
        {/* ══ LEFT — ELO PANEL ══ */}
        <div className="bs-elo-panel">
          <div className="bs-panel-eyebrow">YOUR RATING</div>

          {/* Big ELO number */}
          <div className="bs-elo-hero">
            <div className="bs-elo-number" style={{color:ri.color}}>{playerElo}</div>
            <div className="bs-elo-rank-badge" style={{background:ri.color+"22",color:ri.color,border:`1px solid ${ri.color}55`}}>
              {ri.rank}
            </div>
          </div>

          {/* Rank progress bar */}
          {ri.next && (
            <div className="bs-rank-progress">
              <div className="bs-rank-progress-label">
                <span>{ri.rank}</span>
                <span>{ri.next - playerElo} pts to {RANK_INFO[RANK_INFO.indexOf(ri)+1]?.rank}</span>
              </div>
              <div className="bs-rank-track">
                <div className="bs-rank-fill" style={{width:`${progress}%`,background:ri.color}}/>
              </div>
              <div className="bs-rank-endpoints">
                <span>{ri.min}</span><span>{ri.next}</span>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="bs-stats-grid">
            <div className="bs-stat">
              <div className="bs-stat-val" style={{color:"#4ade80"}}>{wins}</div>
              <div className="bs-stat-lbl">WINS</div>
            </div>
            <div className="bs-stat">
              <div className="bs-stat-val" style={{color:"#ef4444"}}>{losses}</div>
              <div className="bs-stat-lbl">LOSSES</div>
            </div>
            <div className="bs-stat">
              <div className="bs-stat-val" style={{color:"#94a3b8"}}>{draws}</div>
              <div className="bs-stat-lbl">DRAWS</div>
            </div>
          </div>

          {/* All ranks ladder */}
          <div className="bs-rank-ladder">
            <div className="bs-panel-eyebrow" style={{marginBottom:8}}>RANK LADDER</div>
            {RANK_INFO.map((r,i)=>(
              <div key={i} className={`bs-rank-row${r.rank===ri.rank?" bs-rank-row-active":""}`}>
                <div className="bs-rank-dot" style={{background:r.color}}/>
                <span className="bs-rank-name" style={r.rank===ri.rank?{color:r.color}:{}}>{r.rank}</span>
                <span className="bs-rank-range">{r.min}{r.next?`–${r.next-1}`:"+"}  ELO</span>
                {r.rank===ri.rank&&<span className="bs-rank-you">YOU</span>}
              </div>
            ))}
          </div>

          {/* Recent match history */}
          {matchHistory.length>0&&(
            <div className="bs-match-history">
              <div className="bs-panel-eyebrow" style={{marginBottom:8}}>RECENT GAMES</div>
              {matchHistory.slice(-6).reverse().map((m,i)=>(
                <div key={i} className="bs-match-row">
                  <span className="bs-match-emoji">{m.botEmoji}</span>
                  <span className="bs-match-bot">{m.botName}</span>
                  <span className={`bs-match-result ${m.result===1?"win":m.result===0?"loss":"draw"}`}>
                    {m.result===1?"W":m.result===0?"L":"D"}
                  </span>
                  <span className={`bs-match-delta ${m.delta>=0?"up":"down"}`}>
                    {m.delta>=0?"+":""}{m.delta}
                  </span>
                </div>
              ))}
            </div>
          )}

          <button className="bs-reset-btn" onClick={onResetElo}>Reset ELO to 800</button>
        </div>

        {/* ══ RIGHT — BOT GRID ══ */}
        <div className="bs-bots-panel">
          <div className="bs-panel-eyebrow" style={{marginBottom:16}}>CHOOSE OPPONENT</div>

          {TIERS.map((tier,ti)=>(
            <div key={ti} className="bs-tier">
              <div className="bs-tier-label">{tier.label}</div>
              <div className="bs-bot-grid">
                {tier.bots.map(bot=>{
                  const diff = bot.elo - playerElo;
                  const tag  = diff > 300 ? "Hard" : diff < -300 ? "Easy" : "Fair";
                  const tagC = diff > 300 ? "#ef4444" : diff < -300 ? "#22c55e" : "#f59e0b";
                  const eloGain = calcElo(playerElo, bot.elo, 1) - playerElo;
                  const eloLoss = calcElo(playerElo, bot.elo, 0) - playerElo;
                  return(
                    <button key={bot.id} className="bs-bot-card" onClick={()=>onSelect(bot)}
                      style={{"--bot-color":bot.color}}>
                      <div className="bs-bot-emoji">{bot.emoji}</div>
                      <div className="bs-bot-name">{bot.name}</div>
                      <div className="bs-bot-elo" style={{color:bot.color}}>ELO {bot.elo}</div>
                      <div className="bs-bot-tag" style={{background:tagC+"22",color:tagC,border:`1px solid ${tagC}44`}}>{tag}</div>
                      <div className="bs-bot-forecast">
                        <span className="bs-forecast-win">Win +{eloGain}</span>
                        <span className="bs-forecast-loss">Loss {eloLoss}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const EDIT_PIECES = ["wK","wQ","wR","wB","wN","wP","bK","bQ","bR","bB","bN","bP"];

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
export default function ChessBoard(){
  useEffect(()=>{
    const t=localStorage.getItem("cuchco-theme")||"dark";
    const r=t==="system"?(window.matchMedia("(prefers-color-scheme:light)").matches?"light":"dark"):t;
    document.documentElement.setAttribute("data-theme",r);
  },[]);

  // ── Mode state ──
  const [appScreen,    setAppScreen]    = useState("mode");
  const [gameMode,     setGameMode]     = useState(null);
  const [activeBot,    setActiveBot]    = useState(null);
  const [playerElo,    setPlayerElo]    = useState(()=>Number(localStorage.getItem("cuchco-chess-elo")||800));
  const [eloChange,    setEloChange]    = useState(null);
  const [aiThinking,   setAiThinking]   = useState(false);
  const [matchHistory, setMatchHistory] = useState(()=>{
    try{ return JSON.parse(localStorage.getItem("cuchco-chess-history")||"[]"); }
    catch(e){ return []; }
  });

  // ── Chess state ──
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
  const boardRef=useRef({board,enPassant,turn});
  boardRef.current={board,enPassant,turn};

  useEffect(()=>{if(logRef.current) logRef.current.scrollTop=logRef.current.scrollHeight;},[moveHistory]);

  useEffect(()=>{
    localStorage.setItem("cuchco-chess-elo",String(playerElo));
  },[playerElo]);
  useEffect(()=>{
    localStorage.setItem("cuchco-chess-history",JSON.stringify(matchHistory));
  },[matchHistory]);

  // ── AI move trigger ──
  useEffect(()=>{
    if(gameMode!=="ai"||!activeBot||turn!=="b"||(gameState!=="playing"&&gameState!=="check")||promotion) return;
    setAiThinking(true);
    const {board:b,enPassant:ep}=boardRef.current;
    setTimeout(()=>{
      const mv=getBotMove(b,ep,activeBot);
      if(!mv){setAiThinking(false);return;}
      const{r,c,m}=mv;
      const[nr,nc,flag]=m;
      executeMove(b,r,c,nr,nc,flag,ep,"b");
      setAiThinking(false);
    },400);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[turn,gameState,gameMode,activeBot,promotion]);

  // ── Apply a move (shared by human + AI) ──
  function executeMove(brd,sr,sc,nr,nc,flag,ep,movingTurn){
    const nb=cloneBoard(brd);
    const moved=nb[sr][sc];
    const cap=nb[nr][nc];
    let newEP=null;
    let newCR={...castleRights};

    if(moved[1]==="P"&&ep&&nr===ep[0]&&nc===ep[1]){
      const capRow=movingTurn==="w"?nr+1:nr-1;
      setCaptured(prev=>({...prev,[movingTurn==="w"?"b":"w"]:[...prev[movingTurn==="w"?"b":"w"],nb[capRow][nc]]}));
      nb[capRow][nc]=null;
    }
    if(flag==="castle-k"){const row=movingTurn==="w"?7:0;nb[row][5]=movingTurn+"R";nb[row][7]=null;}
    if(flag==="castle-q"){const row=movingTurn==="w"?7:0;nb[row][3]=movingTurn+"R";nb[row][0]=null;}
    if(moved[1]==="P"&&Math.abs(nr-sr)===2) newEP=[(sr+nr)/2,sc];
    if(moved==="wK") newCR={...newCR,wK:false,wQ:false};
    if(moved==="bK") newCR={...newCR,bK:false,bQ:false};
    if(moved==="wR"&&sc===7) newCR.wK=false;
    if(moved==="wR"&&sc===0) newCR.wQ=false;
    if(moved==="bR"&&sc===7) newCR.bK=false;
    if(moved==="bR"&&sc===0) newCR.bQ=false;
    if(cap) setCaptured(prev=>({...prev,[movingTurn]:[...prev[movingTurn],cap]}));
    nb[nr][nc]=moved; nb[sr][sc]=null;
    setLastMove([[sr,sc],[nr,nc]]);
    const an=toAN(moved,[sr,sc],[nr,nc],!!cap,flag);

    if(moved[1]==="P"&&(nr===0||nr===7)){
      setBoard(nb); setPromotion({r:nr,c:nc,an,movingTurn}); setSelected(null); setHighlights([]);
      setEnPassant(newEP); setCastleRights(newCR); return;
    }
    const opp=movingTurn==="w"?"b":"w";
    const inChk=isInCheck(nb,opp);
    let hasLegal=false;
    outer: for(let br=0;br<8;br++) for(let bc=0;bc<8;bc++){
      if(pc(nb[br][bc])===opp) if(getLegalMoves(nb,br,bc,newEP).length>0){hasLegal=true;break outer;}
    }
    let newGS="playing";
    if(!hasLegal) newGS=inChk?"checkmate":"stalemate";
    else if(inChk) newGS="check";

    setBoard(nb); setTurn(opp); setEnPassant(newEP); setCastleRights(newCR);
    setGameState(newGS);
    setMoveHistory(h=>[...h,{an,color:movingTurn}]);
    setSelected(null); setHighlights([]);

    // ELO update on game end (AI mode)
    if(gameMode==="ai"&&activeBot&&(newGS==="checkmate"||newGS==="stalemate")){
      let result;
      if(newGS==="stalemate") result=0.5;
      else result = (opp==="b") ? 0 : 1;
      const newElo=calcElo(playerElo,activeBot.elo,result);
      const change=newElo-playerElo;
      setPlayerElo(newElo);
      setEloChange(change);
      setMatchHistory(h=>[...h,{
        botName:activeBot.name,
        botEmoji:activeBot.emoji,
        botElo:activeBot.elo,
        result,
        delta:change,
        date:Date.now()
      }]);
    }
  }

  function handlePromotion(type){
    const{r,c,an,movingTurn}=promotion;
    const nb=cloneBoard(board);
    nb[r][c]=movingTurn+type;
    const opp=movingTurn==="w"?"b":"w";
    const inChk=isInCheck(nb,opp);
    let hasLegal=false;
    outer: for(let br=0;br<8;br++) for(let bc=0;bc<8;bc++){
      if(pc(nb[br][bc])===opp) if(getLegalMoves(nb,br,bc,enPassant).length>0){hasLegal=true;break outer;}
    }
    let newGS="playing";
    if(!hasLegal) newGS=inChk?"checkmate":"stalemate";
    else if(inChk) newGS="check";
    setBoard(nb); setTurn(opp); setGameState(newGS);
    setMoveHistory(h=>[...h,{an:an+"="+type,color:movingTurn}]);
    setPromotion(null);
  }

  function handleSquare(r,c){
    if(gameState==="checkmate"||gameState==="stalemate") return;
    if(aiThinking) return;
    if(gameMode==="ai"&&turn==="b") return; // AI's turn

    if(editMode){
      const nb=cloneBoard(board);
      if(editPiece==="erase") nb[r][c]=null; else nb[r][c]=editPiece;
      setBoard(nb); return;
    }
    const piece=board[r][c];
    if(selected){
      const[sr,sc]=selected;
      const move=highlights.find(([mr,mc])=>mr===r&&mc===c);
      if(move){
        const[,, flag]=move;
        executeMove(board,sr,sc,r,c,flag,enPassant,turn);
      } else if(piece&&pc(piece)===turn){
        setSelected([r,c]); setHighlights(getLegalMoves(board,r,c,enPassant));
      } else {
        setSelected(null); setHighlights([]);
      }
    } else if(piece&&pc(piece)===turn){
      setSelected([r,c]); setHighlights(getLegalMoves(board,r,c,enPassant));
    }
  }

  function resetGame(){
    setBoard(initBoard()); setSelected(null); setHighlights([]);
    setTurn("w"); setEnPassant(null);
    setCastleRights({wK:true,wQ:true,bK:true,bQ:true});
    setPromotion(null); setGameState("playing");
    setMoveHistory([]); setCaptured({w:[],b:[]}); setLastMove(null);
    setEditMode(false); setEloChange(null); setAiThinking(false);
  }

  function backToMenu(){
    resetGame();
    setGameMode(null); setActiveBot(null); setAppScreen("mode");
  }

  function resetElo(){
    setPlayerElo(800);
    setMatchHistory([]);
    localStorage.removeItem("cuchco-chess-elo");
    localStorage.removeItem("cuchco-chess-history");
  }

  function startBotGame(bot){
    resetGame();
    setActiveBot(bot); setGameMode("ai"); setAppScreen("game");
  }

  function start2P(){
    resetGame();
    setGameMode("2p"); setAppScreen("game"); setActiveBot(null);
  }

  const matScore=(b,color)=>{let s=0;for(let r=0;r<8;r++)for(let c=0;c<8;c++){const p=b[r][c];if(p&&pc(p)===color) s+=(PIECE_VALUES[p[1]]||0);}return s;};
  const mat={w:matScore(board,"w"),b:matScore(board,"b"),diff:matScore(board,"w")-matScore(board,"b")};
  const rows=flipped?[0,1,2,3,4,5,6,7]:[7,6,5,4,3,2,1,0];
  const cols=flipped?[7,6,5,4,3,2,1,0]:[0,1,2,3,4,5,6,7];
  function isSel(r,c){return selected&&selected[0]===r&&selected[1]===c;}
  function isHi(r,c){return highlights.some(([hr,hc])=>hr===r&&hc===c);}
  function isLast(r,c){return lastMove&&((lastMove[0][0]===r&&lastMove[0][1]===c)||(lastMove[1][0]===r&&lastMove[1][1]===c));}
  function isKingCheck(r,c){return board[r][c]&&board[r][c][1]==="K"&&pc(board[r][c])===turn&&gameState==="check";}

  /* ── RENDER ── */
  return(
    <div className="chess-root">
      <header className="chess-topbar">
        <a href="/" className="chess-tb-home" title="Home"><FiHome size={17}/></a>
        <div className="chess-tb-divider"/>
        <span className="chess-tb-brand">CUCHCO</span>
        <span className="chess-tb-slash">/</span>
        <span className="chess-tb-title">CHESS</span>
        <div style={{flex:1}}/>
        {appScreen==="game"&&<>
          <div className="chess-mode-badge">
            {gameMode==="ai"?<><FiCpu size={13}/> vs {activeBot?.name}</>:<><FiUsers size={13}/> 2 Player</>}
          </div>
          <button className={`chess-tb-btn${editMode?" chess-tb-btn-on":""}`} onClick={()=>setEditMode(m=>!m)}>
            <FiEdit2 size={14}/><span>Edit</span>
          </button>
          <button className="chess-tb-btn" onClick={()=>setFlipped(f=>!f)}>
            <FiRotateCcw size={14}/><span>Flip</span>
          </button>
          <button className="chess-tb-btn chess-tb-danger" onClick={resetGame}>
            <FiRotateCw size={14}/><span>New</span>
          </button>
          <button className="chess-tb-btn" onClick={backToMenu}>
            <FiFlag size={14}/><span>Menu</span>
          </button>
        </>}
        <a href="/chess" className="chess-tb-back">← Chess</a>
      </header>

      {/* ── MODE / BOT SELECT SCREENS ── */}
      {appScreen==="mode"&&<ModeSelector onSelect={(m)=>{if(m==="2p") start2P(); else setAppScreen("botSelect");}}/>}
      {appScreen==="botSelect"&&<BotSelector playerElo={playerElo} matchHistory={matchHistory} onSelect={startBotGame} onBack={()=>setAppScreen("mode")} onResetElo={resetElo}/>}

      {/* ── GAME ── */}
      {appScreen==="game"&&(
        <div className="chess-body">

          {/* LEFT SIDEBAR */}
          <div className="chess-sidebar chess-sidebar-left">

            {/* AI info */}
            {gameMode==="ai"&&activeBot&&(
              <div className="ai-info-panel">
                <div className="ai-bot-row">
                  <span className="ai-bot-emoji">{activeBot.emoji}</span>
                  <div>
                    <div className="ai-bot-name">{activeBot.name}</div>
                    <div className="ai-bot-elo" style={{color:activeBot.color}}>ELO {activeBot.elo}</div>
                  </div>
                  {aiThinking&&<div className="ai-thinking-dots"><span/><span/><span/></div>}
                </div>
                <EloBar elo={playerElo} change={eloChange}/>
              </div>
            )}

            {/* Edit mode */}
            {editMode&&(
              <div className="edit-panel">
                <div className="edit-label">PLACE PIECE</div>
                <div className="edit-pieces-grid">
                  {EDIT_PIECES.map(p=>(
                    <button key={p} className={`edit-piece-btn${editPiece===p?" on":""}`} onClick={()=>setEditPiece(p)}>
                      <img src={PIECE_IMG[p]} alt={p} draggable={false}/>
                    </button>
                  ))}
                  <button className={`edit-piece-btn edit-erase${editPiece==="erase"?" on":""}`} onClick={()=>setEditPiece("erase")}>✕</button>
                </div>
              </div>
            )}

            {/* Material */}
            <div className="chess-material">
              <div className="chess-player chess-player-top">
                <div className="chess-player-dot chess-dot-black"/>
                <span className="chess-player-name">{gameMode==="ai"?activeBot?.name||"Black":"Black"}</span>
                {mat.diff<0&&<span className="chess-mat-adv">+{Math.abs(mat.diff)}</span>}
              </div>
              <div className="chess-mat-bar-wrap">
                <div className="chess-mat-bar" style={{width:`${Math.min(100,50+mat.diff*3)}%`}}/>
              </div>
              <div className="chess-player chess-player-bottom">
                <div className="chess-player-dot chess-dot-white"/>
                <span className="chess-player-name">{gameMode==="ai"?"You (White)":"White"}</span>
                {mat.diff>0&&<span className="chess-mat-adv">+{mat.diff}</span>}
              </div>
            </div>

            {/* Turn */}
            <div className={`chess-turn-badge chess-turn-${turn}`}>
              <div className={`chess-turn-dot chess-turn-dot-${turn}`}/>
              {gameState==="check"
                ? <span style={{color:"#ef4444"}}>{turn==="w"?"White":"Black"} in CHECK</span>
                : aiThinking
                  ? <span style={{color:"#888"}}>AI thinking…</span>
                  : <span>{turn==="w"?"White":"Black"}'s turn</span>
              }
            </div>

            {/* Move log */}
            <div className="chess-history-label">MOVES</div>
            <div className="chess-move-log" ref={logRef}>
              {moveHistory.length===0
                ? <div className="chess-log-empty">No moves yet</div>
                : moveHistory.reduce((acc,mv,i)=>{
                    if(i%2===0) acc.push([mv]); else acc[acc.length-1].push(mv);
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

          {/* BOARD */}
          <div className="chess-board-wrap">
            <div className="chess-board-outer">
              <div className="chess-labels-col">
                {rows.map(r=><div key={r} className="chess-rank-lbl">{8-r}</div>)}
              </div>
              <div>
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
                <div className="chess-labels-row">
                  {cols.map(c=><div key={c} className="chess-file-lbl">{FILES[c]}</div>)}
                </div>
              </div>
              <div className="chess-labels-col">
                {rows.map(r=><div key={r} className="chess-rank-lbl">{8-r}</div>)}
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="chess-sidebar chess-sidebar-right">
            {/* Captured pieces */}
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

            {/* Bot list in AI mode */}
            {gameMode==="ai"&&(
              <div className="chess-bot-list">
                <div className="chess-history-label">BOTS</div>
                {BOTS.map(bot=>(
                  <button key={bot.id} className={`chess-bot-row-btn${activeBot?.id===bot.id?" active":""}`}
                    onClick={()=>{if(activeBot?.id!==bot.id){startBotGame(bot);}}}>
                    <span className="chess-bot-emoji">{bot.emoji}</span>
                    <span className="chess-bot-label">{bot.name}</span>
                    <span className="chess-bot-elo" style={{color:bot.color}}>{bot.elo}</span>
                  </button>
                ))}
              </div>
            )}

            <div className="chess-legend">
              <div className="chess-legend-title">LEGEND</div>
              <div className="chess-legend-row"><div className="chess-dot-demo"/><span>Legal move</span></div>
              <div className="chess-legend-row"><div className="chess-cap-demo"/><span>Capture</span></div>
              <div className="chess-legend-row"><div className="chess-sel-demo"/><span>Selected</span></div>
            </div>
          </div>
        </div>
      )}

      {/* Overlays */}
      {promotion&&<PromotionPicker color={promotion.movingTurn||turn} onChoose={handlePromotion}/>}
      {appScreen==="game"&&gameState==="checkmate"&&(
        <GameOverlay
          title="CHECKMATE"
          sub={`${turn==="w"?"Black":"White"} wins!${gameMode==="ai"&&eloChange!=null?` ELO ${eloChange>=0?"+":""}${eloChange}`:""}`}
          onNew={resetGame}
        />
      )}
      {appScreen==="game"&&gameState==="stalemate"&&(
        <GameOverlay title="STALEMATE" sub={`Draw${gameMode==="ai"&&eloChange!=null?` · ELO ${eloChange>=0?"+":""}${eloChange}`:""}`} onNew={resetGame}/>
      )}
    </div>
  );
}
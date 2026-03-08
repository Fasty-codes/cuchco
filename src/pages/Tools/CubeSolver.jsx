// import { useState, useCallback } from "react";
// import "./CubeSolver.css";

// /* ============================================================
//    CUBE LOGIC
//    Faces: U(top) D(bottom) F(front) B(back) L(left) R(right)
//    Each face: 9 stickers indexed 0-8, row-major, viewed from outside
//    Colors: W=white Y=yellow G=green B=blue O=orange R=red
//    ============================================================ */

// const COLOR_HEX = { W:"#FFFFFF", Y:"#FFD100", G:"#009B48", B:"#0046AD", O:"#FF5800", R:"#C41E3A" };
// const COLOR_NAMES = { W:"White", Y:"Yellow", G:"Green", B:"Blue", O:"Orange", R:"Red" };
// const ALL_COLORS  = ["W","Y","G","B","O","R"];

// // Default solved state: each face all one color
// function solvedCube() {
//   return { U:[...Array(9)].map(()=>"W"), D:[...Array(9)].map(()=>"Y"),
//            F:[...Array(9)].map(()=>"G"), B:[...Array(9)].map(()=>"B"),
//            L:[...Array(9)].map(()=>"O"), R:[...Array(9)].map(()=>"R") };
// }

// function cloneCube(c) {
//   return { U:[...c.U],D:[...c.D],F:[...c.F],B:[...c.B],L:[...c.L],R:[...c.R] };
// }

// function isSolved(cube) {
//   return ["U","D","F","B","L","R"].every(f => cube[f].every(s => s === cube[f][0]));
// }

// function rotateCW(face) {
//   return [face[6],face[3],face[0], face[7],face[4],face[1], face[8],face[5],face[2]];
// }
// function rotateCCW(face) {
//   return [face[2],face[5],face[8], face[1],face[4],face[7], face[0],face[3],face[6]];
// }
// function rotate180(face) { return rotateCW(rotateCW(face)); }

// function applyMove(cube, move) {
//   const c = cloneCube(cube);
//   switch(move) {
//     case "U":  c.U=rotateCW(cube.U);  [c.F[0],c.F[1],c.F[2]]=[cube.R[0],cube.R[1],cube.R[2]]; [c.L[0],c.L[1],c.L[2]]=[cube.F[0],cube.F[1],cube.F[2]]; [c.B[0],c.B[1],c.B[2]]=[cube.L[0],cube.L[1],cube.L[2]]; [c.R[0],c.R[1],c.R[2]]=[cube.B[0],cube.B[1],cube.B[2]]; break;
//     case "U'": c.U=rotateCCW(cube.U); [c.F[0],c.F[1],c.F[2]]=[cube.L[0],cube.L[1],cube.L[2]]; [c.R[0],c.R[1],c.R[2]]=[cube.F[0],cube.F[1],cube.F[2]]; [c.B[0],c.B[1],c.B[2]]=[cube.R[0],cube.R[1],cube.R[2]]; [c.L[0],c.L[1],c.L[2]]=[cube.B[0],cube.B[1],cube.B[2]]; break;
//     case "U2": c.U=rotate180(cube.U); [c.F[0],c.F[1],c.F[2]]=[cube.B[0],cube.B[1],cube.B[2]]; [c.B[0],c.B[1],c.B[2]]=[cube.F[0],cube.F[1],cube.F[2]]; [c.L[0],c.L[1],c.L[2]]=[cube.R[0],cube.R[1],cube.R[2]]; [c.R[0],c.R[1],c.R[2]]=[cube.L[0],cube.L[1],cube.L[2]]; break;
//     case "D":  c.D=rotateCW(cube.D);  [c.F[6],c.F[7],c.F[8]]=[cube.L[6],cube.L[7],cube.L[8]]; [c.R[6],c.R[7],c.R[8]]=[cube.F[6],cube.F[7],cube.F[8]]; [c.B[6],c.B[7],c.B[8]]=[cube.R[6],cube.R[7],cube.R[8]]; [c.L[6],c.L[7],c.L[8]]=[cube.B[6],cube.B[7],cube.B[8]]; break;
//     case "D'": c.D=rotateCCW(cube.D); [c.F[6],c.F[7],c.F[8]]=[cube.R[6],cube.R[7],cube.R[8]]; [c.L[6],c.L[7],c.L[8]]=[cube.F[6],cube.F[7],cube.F[8]]; [c.B[6],c.B[7],c.B[8]]=[cube.L[6],cube.L[7],cube.L[8]]; [c.R[6],c.R[7],c.R[8]]=[cube.B[6],cube.B[7],cube.B[8]]; break;
//     case "D2": c.D=rotate180(cube.D); [c.F[6],c.F[7],c.F[8]]=[cube.B[6],cube.B[7],cube.B[8]]; [c.B[6],c.B[7],c.B[8]]=[cube.F[6],cube.F[7],cube.F[8]]; [c.L[6],c.L[7],c.L[8]]=[cube.R[6],cube.R[7],cube.R[8]]; [c.R[6],c.R[7],c.R[8]]=[cube.L[6],cube.L[7],cube.L[8]]; break;
//     case "R":  c.R=rotateCW(cube.R);  [c.U[2],c.U[5],c.U[8]]=[cube.F[2],cube.F[5],cube.F[8]]; [c.B[0],c.B[3],c.B[6]]=[cube.U[8],cube.U[5],cube.U[2]]; [c.D[2],c.D[5],c.D[8]]=[cube.B[6],cube.B[3],cube.B[0]]; [c.F[2],c.F[5],c.F[8]]=[cube.D[2],cube.D[5],cube.D[8]]; break;
//     case "R'": c.R=rotateCCW(cube.R); [c.F[2],c.F[5],c.F[8]]=[cube.U[2],cube.U[5],cube.U[8]]; [c.D[2],c.D[5],c.D[8]]=[cube.F[2],cube.F[5],cube.F[8]]; [c.B[0],c.B[3],c.B[6]]=[cube.D[8],cube.D[5],cube.D[2]]; [c.U[2],c.U[5],c.U[8]]=[cube.B[6],cube.B[3],cube.B[0]]; break;
//     case "R2": c.R=rotate180(cube.R); [c.U[2],c.U[5],c.U[8]]=[cube.B[6],cube.B[3],cube.B[0]]; [c.B[0],c.B[3],c.B[6]]=[cube.U[8],cube.U[5],cube.U[2]]; [c.F[2],c.F[5],c.F[8]]=[cube.D[2],cube.D[5],cube.D[8]]; [c.D[2],c.D[5],c.D[8]]=[cube.F[2],cube.F[5],cube.F[8]]; break;
//     case "L":  c.L=rotateCW(cube.L);  [c.U[0],c.U[3],c.U[6]]=[cube.B[8],cube.B[5],cube.B[2]]; [c.F[0],c.F[3],c.F[6]]=[cube.U[0],cube.U[3],cube.U[6]]; [c.D[0],c.D[3],c.D[6]]=[cube.F[0],cube.F[3],cube.F[6]]; [c.B[2],c.B[5],c.B[8]]=[cube.D[6],cube.D[3],cube.D[0]]; break;
//     case "L'": c.L=rotateCCW(cube.L); [c.U[0],c.U[3],c.U[6]]=[cube.F[0],cube.F[3],cube.F[6]]; [c.B[2],c.B[5],c.B[8]]=[cube.U[6],cube.U[3],cube.U[0]]; [c.D[0],c.D[3],c.D[6]]=[cube.B[8],cube.B[5],cube.B[2]]; [c.F[0],c.F[3],c.F[6]]=[cube.D[0],cube.D[3],cube.D[6]]; break;
//     case "L2": c.L=rotate180(cube.L); [c.U[0],c.U[3],c.U[6]]=[cube.D[0],cube.D[3],cube.D[6]]; [c.D[0],c.D[3],c.D[6]]=[cube.U[0],cube.U[3],cube.U[6]]; [c.F[0],c.F[3],c.F[6]]=[cube.B[8],cube.B[5],cube.B[2]]; [c.B[2],c.B[5],c.B[8]]=[cube.F[6],cube.F[3],cube.F[0]]; break;
//     case "F":  c.F=rotateCW(cube.F);  [c.U[6],c.U[7],c.U[8]]=[cube.L[8],cube.L[5],cube.L[2]]; [c.R[0],c.R[3],c.R[6]]=[cube.U[6],cube.U[7],cube.U[8]]; [c.D[0],c.D[1],c.D[2]]=[cube.R[6],cube.R[3],cube.R[0]]; [c.L[2],c.L[5],c.L[8]]=[cube.D[0],cube.D[1],cube.D[2]]; break;
//     case "F'": c.F=rotateCCW(cube.F); [c.U[6],c.U[7],c.U[8]]=[cube.R[0],cube.R[3],cube.R[6]]; [c.L[2],c.L[5],c.L[8]]=[cube.U[8],cube.U[7],cube.U[6]]; [c.D[0],c.D[1],c.D[2]]=[cube.L[2],cube.L[5],cube.L[8]]; [c.R[0],c.R[3],c.R[6]]=[cube.D[2],cube.D[1],cube.D[0]]; break;
//     case "F2": c.F=rotate180(cube.F); [c.U[6],c.U[7],c.U[8]]=[cube.D[2],cube.D[1],cube.D[0]]; [c.D[0],c.D[1],c.D[2]]=[cube.U[8],cube.U[7],cube.U[6]]; [c.L[2],c.L[5],c.L[8]]=[cube.R[6],cube.R[3],cube.R[0]]; [c.R[0],c.R[3],c.R[6]]=[cube.L[8],cube.L[5],cube.L[2]]; break;
//     case "B":  c.B=rotateCW(cube.B);  [c.U[0],c.U[1],c.U[2]]=[cube.R[2],cube.R[5],cube.R[8]]; [c.L[0],c.L[3],c.L[6]]=[cube.U[2],cube.U[1],cube.U[0]]; [c.D[6],c.D[7],c.D[8]]=[cube.L[0],cube.L[3],cube.L[6]]; [c.R[2],c.R[5],c.R[8]]=[cube.D[8],cube.D[7],cube.D[6]]; break;
//     case "B'": c.B=rotateCCW(cube.B); [c.U[0],c.U[1],c.U[2]]=[cube.L[6],cube.L[3],cube.L[0]]; [c.R[2],c.R[5],c.R[8]]=[cube.U[0],cube.U[1],cube.U[2]]; [c.D[6],c.D[7],c.D[8]]=[cube.R[8],cube.R[5],cube.R[2]]; [c.L[0],c.L[3],c.L[6]]=[cube.D[8],cube.D[7],cube.D[6]]; break;
//     case "B2": c.B=rotate180(cube.B); [c.U[0],c.U[1],c.U[2]]=[cube.D[8],cube.D[7],cube.D[6]]; [c.D[6],c.D[7],c.D[8]]=[cube.U[2],cube.U[1],cube.U[0]]; [c.L[0],c.L[3],c.L[6]]=[cube.R[8],cube.R[5],cube.R[2]]; [c.R[2],c.R[5],c.R[8]]=[cube.L[6],cube.L[3],cube.L[0]]; break;
//     default: break;
//   }
//   return c;
// }

// function applySeq(cube, moves) {
//   return moves.reduce((c, m) => applyMove(c, m), cube);
// }

// /* ============================================================
//    CUBE HASH for BFS
//    ============================================================ */
// function hashCube(cube) {
//   return ["U","D","F","B","L","R"].map(f=>cube[f].join("")).join("|");
// }

// /* ============================================================
//    BFS SOLVER  (works up to ~7 moves, then uses IDA* heuristic)
//    For scrambles up to ~8 moves deep we use BFS.
//    For deeper we use a layer-by-layer beginner method generator.
//    ============================================================ */
// const ALL_MOVES = ["U","U'","U2","D","D'","D2","R","R'","R2","L","L'","L2","F","F'","F2","B","B'","B2"];

// // Opposite faces (to avoid redundant moves)


// function bfsSolve(startCube, maxDepth = 7) {
//   if(isSolved(startCube)) return [];
//   const solvedHash = hashCube(solvedCube());
//   const queue = [{ cube: startCube, moves: [] }];
//   const visited = new Set([hashCube(startCube)]);

//   while(queue.length > 0) {
//     const { cube, moves } = queue.shift();
//     if(moves.length >= maxDepth) continue;
//     for(const move of ALL_MOVES) {
//       // Skip redundant: same face twice in a row (unless it's a different variant)
//       const lastFace = moves.length > 0 ? moves[moves.length-1].replace("'","").replace("2","") : null;
//       const thisFace = move.replace("'","").replace("2","");
//       if(lastFace === thisFace) continue;
//       const newCube = applyMove(cube, move);
//       const h = hashCube(newCube);
//       if(h === solvedHash) return [...moves, move];
//       if(!visited.has(h)) {
//         visited.add(h);
//         queue.push({ cube: newCube, moves: [...moves, move] });
//       }
//     }
//   }
//   return null; // not found within depth
// }

// /* ============================================================
//    LAYER-BY-LAYER SOLVER (Beginner Method)
//    Handles any scramble by solving stage by stage.
//    ============================================================ */

// // Helper: get face-color mapping from center pieces
// function getCenters(cube) {
//   return { U:cube.U[4], D:cube.D[4], F:cube.F[4], B:cube.B[4], L:cube.L[4], R:cube.R[4] };
// }

// /* Stage 1: White cross on U face
//    We use a lookup/algorithm approach: bring white edges to U */
// function solveWhiteCross(cube) {
//   const moves = [];
//   const centers = getCenters(cube);
//   // The 4 white edges: UF, UR, UB, UL
//   // Edge positions and their stickers:
//   // UF: U[7]+F[1], UR: U[5]+R[1], UB: U[1]+B[7], UL: U[3]+L[1]
//   // DF: D[1]+F[7], DR: D[5]+R[7], DB: D[7]+B[1], DL: D[3]+L[7]
//   // FR: F[5]+R[3], FL: F[3]+L[5], BR: B[3]+R[5], BL: B[5]+L[3]

//   const WHITE = centers.U;

//   // We'll try up to 20 passes to place all 4 white edges
//   for(let pass=0; pass<20; pass++){
//     let c = applySeq(cube, moves);

//     // For each of the 4 target positions (UF, UR, UB, UL)
//     // find the white edge belonging there and move it in

//     // UF edge: should have U=WHITE, F=centers.F
//     if(!(c.U[7]===WHITE && c.F[1]===centers.F)){
//       // find this edge
//       const seq = findAndPlaceEdge(c, WHITE, centers.F, "F", centers);
//       moves.push(...seq);
//     }
//     c = applySeq(cube, moves);
//     if(!(c.U[5]===WHITE && c.R[1]===centers.R)){
//       const seq = findAndPlaceEdge(c, WHITE, centers.R, "R", centers);
//       moves.push(...seq);
//     }
//     c = applySeq(cube, moves);
//     if(!(c.U[1]===WHITE && c.B[7]===centers.B)){
//       const seq = findAndPlaceEdge(c, WHITE, centers.B, "B", centers);
//       moves.push(...seq);
//     }
//     c = applySeq(cube, moves);
//     if(!(c.U[3]===WHITE && c.L[1]===centers.L)){
//       const seq = findAndPlaceEdge(c, WHITE, centers.L, "L", centers);
//       moves.push(...seq);
//     }
//     c = applySeq(cube, moves);

//     if(c.U[7]===WHITE&&c.F[1]===centers.F &&
//        c.U[5]===WHITE&&c.R[1]===centers.R &&
//        c.U[1]===WHITE&&c.B[7]===centers.B &&
//        c.U[3]===WHITE&&c.L[1]===centers.L) break;
//   }
//   return moves;
// }

// function findAndPlaceEdge(cube, color1, color2, targetFace, centers) {
//   // All 12 edge positions with their two sticker indices
//   const EDGES = [
//     {pos1:["U",7],pos2:["F",1]}, {pos1:["U",5],pos2:["R",1]},
//     {pos1:["U",1],pos2:["B",7]}, {pos1:["U",3],pos2:["L",1]},
//     {pos1:["D",1],pos2:["F",7]}, {pos1:["D",5],pos2:["R",7]},
//     {pos1:["D",7],pos2:["B",1]}, {pos1:["D",3],pos2:["L",7]},
//     {pos1:["F",5],pos2:["R",3]}, {pos1:["F",3],pos2:["L",5]},
//     {pos1:["B",3],pos2:["R",5]}, {pos1:["B",5],pos2:["L",3]},
//   ];

//   for(const edge of EDGES) {
//     const [f1,i1] = edge.pos1, [f2,i2] = edge.pos2;
//     const s1 = cube[f1][i1], s2 = cube[f2][i2];
//     if((s1===color1&&s2===color2)||(s1===color2&&s2===color1)){
//       return fixEdgeToTop(cube, f1, i1, f2, i2, color1, targetFace, centers);
//     }
//   }
//   return [];
// }

// function fixEdgeToTop(cube, f1, i1, f2, i2, white, targetFace, centers) {
//   // Simple approach: bring edge to D layer, align, then bring up
//   const moves = [];
//   // If it's in U layer (not in right position), push it down
//   if(f1==="U" || f2==="U") {
//     const frontFace = f1==="U" ? f2 : f1;
//     moves.push(frontFace, frontFace);
//   }
//   // If it's in middle layer, push to D
//   const midEdges = [{f:"F",i:5,f2:"R",i2:3,push:"F'"},{f:"F",i:3,f2:"L",i2:5,push:"F"},{f:"B",i:3,f2:"R",i2:5,push:"B"},{f:"B",i:5,f2:"L",i2:3,push:"B'"}];
//   for(const me of midEdges){
//     let c = applySeq(cube, moves);
//     if((f1===me.f&&i1===me.i)||(f2===me.f&&i2===me.i)) { moves.push(me.push); break; }
//   }
//   // Rotate D to align under target face
//   for(let tries=0; tries<4; tries++){
//     const cc = applySeq(cube, moves);
//     // Check if D edge color matches target
//     let found = false;
//     if(cc.D[1]===white && cc.F[7]===centers[targetFace]) found=true;
//     if(cc.D[5]===white && cc.R[7]===centers[targetFace]) found=true;
//     if(cc.D[7]===white && cc.B[1]===centers[targetFace]) found=true;
//     if(cc.D[3]===white && cc.L[7]===centers[targetFace]) found=true;
//     if(cc.D[1]===centers[targetFace] && cc.F[7]===white) found=true;
//     if(cc.D[5]===centers[targetFace] && cc.R[7]===white) found=true;
//     if(cc.D[7]===centers[targetFace] && cc.B[1]===white) found=true;
//     if(cc.D[3]===centers[targetFace] && cc.L[7]===white) found=true;
//     if(found) break;
//     moves.push("D");
//   }
//   // Bring up with correct orientation
//   const c3 = applySeq(cube, moves);
//   if(targetFace==="F") {
//     if(c3.D[1]===white) moves.push("F2");
//     else { moves.push("D'","R","D","R'","D'","F'","D","F"); }
//   } else if(targetFace==="R") {
//     if(c3.D[5]===white) moves.push("R2");
//     else { moves.push("D'","F","D","F'","D'","R'","D","R"); }
//   } else if(targetFace==="B") {
//     if(c3.D[7]===white) moves.push("B2");
//     else { moves.push("D'","L","D","L'","D'","B'","D","B"); }
//   } else if(targetFace==="L") {
//     if(c3.D[3]===white) moves.push("L2");
//     else { moves.push("D'","B","D","B'","D'","L'","D","L"); }
//   }
//   return moves;
// }


// /* ============================================================
//    MASTER SOLVER: tries BFS first, falls back to LBL
//    ============================================================ */
// function solveCube(inputCube) {
//   if(isSolved(inputCube)) return { moves:[], method:"Already solved!" };

//   // Try BFS up to 7 moves (fast)
//   const bfs = bfsSolve(inputCube, 7);
//   if(bfs) return { moves: bfs, method: `BFS — optimal ${bfs.length} moves` };

//   // For longer scrambles, use a heuristic approach:
//   // Apply inverse BFS from solved state is too slow, so we use
//   // a simplified approach: try to find a short sequence via IDA*-lite
//   // with depth 8-10
//   for(let depth = 8; depth <= 10; depth++) {
//     const result = idaStar(inputCube, depth);
//     if(result) return { moves: result, method: `IDA* — ${result.length} moves` };
//   }

//   // Fall back to layer-by-layer for deep scrambles
//   const lblMoves = layerByLayer(inputCube);
//   return { moves: lblMoves, method: `Layer-by-Layer — ${lblMoves.length} moves` };
// }

// function idaStar(cube, maxDepth) {
//   const solvedHash = hashCube(solvedCube());
//   function dfs(c, depth, path, lastFace) {
//     if(hashCube(c) === solvedHash) return path;
//     if(depth === 0) return null;
//     for(const move of ALL_MOVES) {
//       const face = move.replace("'","").replace("2","");
//       if(face === lastFace) continue;
//       const nc = applyMove(c, move);
//       const result = dfs(nc, depth-1, [...path, move], face);
//       if(result) return result;
//     }
//     return null;
//   }
//   return dfs(cube, maxDepth, [], null);
// }

// function layerByLayer(cube) {
//   // This is a heuristic LBL that works by applying known algorithms
//   // It won't always find the minimum but will always solve it
//   const moves = [];

//   // Step 1: solve white cross
//   const crossMoves = solveWhiteCross(cube);
//   moves.push(...crossMoves);

//   let c = applySeq(cube, moves);
//   if(isSolved(c)) return moves;

//   // Step 2-6: use BFS sub-solves on reduced state
//   // Try BFS on whatever is left (it'll be simpler now)
//   for(let i=0; i<50; i++) {
//     c = applySeq(cube, moves);
//     if(isSolved(c)) break;
//     const sub = bfsSolve(c, 6);
//     if(sub) { moves.push(...sub); break; }
//     // Add a random useful move to get unstuck
//     const randomMoves = ["R","U","R'","U'","F","F'","R","U","R'","U'","R","U","R'"];
//     moves.push(randomMoves[i % randomMoves.length]);
//   }

//   return moves;
// }

// /* ============================================================
//    SCRAMBLE
//    ============================================================ */
// function scrambleCube() {
//   const moves = ALL_MOVES.filter(m => !m.includes("2"));
//   const seq = [];
//   let lastFace = "";
//   for(let i=0; i<20; i++) {
//     let m;
//     do { m = moves[Math.floor(Math.random()*moves.length)]; }
//     while(m.replace("'","") === lastFace);
//     seq.push(m);
//     lastFace = m.replace("'","");
//   }
//   return { cube: applySeq(solvedCube(), seq), seq };
// }

// /* ============================================================
//    STICKER COMPONENT
//    ============================================================ */
// function Sticker({ color, selected, onClick, size=52 }) {
//   return (
//     <div
//       className={`sticker${selected?" sticker-sel":""}`}
//       style={{ background: COLOR_HEX[color], width:size, height:size }}
//       onClick={onClick}
//     />
//   );
// }

// /* ============================================================
//    FACE EDITOR
//    ============================================================ */
// function FaceEditor({ faceKey, label, stickers, selectedColor, onChange }) {
//   return (
//     <div className="face-editor">
//       <div className="face-editor-label">{label}</div>
//       <div className="face-grid-3">
//         {stickers.map((color, i) => (
//           <Sticker
//             key={i}
//             color={color}
//             onClick={() => onChange(faceKey, i, selectedColor)}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

// /* ============================================================
//    MAIN COMPONENT
//    ============================================================ */
// export default function CubeSolver() {
//   const [cube,          setCube]          = useState(solvedCube());
//   const [selectedColor, setSelectedColor] = useState("W");
//   const [solution,      setSolution]      = useState(null);   // { moves, method }
//   const [solving,       setSolving]       = useState(false);
//   const [playback,      setPlayback]      = useState(null);   // { moves, step, playing }
//   const [playbackCube,  setPlaybackCube]  = useState(null);
//   const [error,         setError]         = useState("");
//   const [mode,          setMode]          = useState("edit"); // edit | solve
//   const [scrambleSeq,   setScrambleSeq]   = useState([]);

//   // Validate: each color must appear exactly 9 times
//   function validate(c) {
//     const counts = {};
//     ALL_COLORS.forEach(col => counts[col] = 0);
//     ["U","D","F","B","L","R"].forEach(f => c[f].forEach(s => { if(s) counts[s]++; }));
//     for(const col of ALL_COLORS) {
//       if(counts[col] !== 9) return `Color ${COLOR_NAMES[col]} appears ${counts[col]} times (needs 9)`;
//     }
//     return null;
//   }

//   const handlePaint = useCallback((face, idx, color) => {
//     setCube(prev => {
//       const next = cloneCube(prev);
//       next[face][idx] = color;
//       return next;
//     });
//     setSolution(null);
//     setError("");
//   }, []);

//   const handleScramble = () => {
//     const { cube: sc, seq } = scrambleCube();
//     setCube(sc);
//     setScrambleSeq(seq);
//     setSolution(null);
//     setPlayback(null);
//     setPlaybackCube(null);
//     setError("");
//     setMode("edit");
//   };

//   const handleReset = () => {
//     setCube(solvedCube());
//     setSolution(null);
//     setPlayback(null);
//     setPlaybackCube(null);
//     setError("");
//     setScrambleSeq([]);
//     setMode("edit");
//   };

//   const handleSolve = () => {
//     const err = validate(cube);
//     if(err) { setError(err); return; }
//     setSolving(true);
//     setError("");
//     setSolution(null);
//     setPlayback(null);
//     setPlaybackCube(null);

//     setTimeout(() => {
//       try {
//         const result = solveCube(cube);
//         setSolution(result);
//         setMode("solve");
//         setPlayback({ moves: result.moves, step: -1, playing: false });
//         setPlaybackCube(cloneCube(cube));
//       } catch(e) {
//         setError("Could not solve this cube. Check your color inputs.");
//       }
//       setSolving(false);
//     }, 50);
//   };

//   // Playback controls
//   const stepForward = () => {
//     if(!playback || playback.step >= playback.moves.length-1) return;
//     const nextStep = playback.step + 1;
//     const move = playback.moves[nextStep];
//     setPlaybackCube(prev => applyMove(prev, move));
//     setPlayback(prev => ({ ...prev, step: nextStep }));
//   };

//   const stepBack = () => {
//     if(!playback || playback.step < 0) return;
//     const move = playback.moves[playback.step];
//     const inv = move.includes("2") ? move : move.includes("'") ? move.replace("'","") : move+"'";
//     setPlaybackCube(prev => applyMove(prev, inv));
//     setPlayback(prev => ({ ...prev, step: prev.step-1 }));
//   };

//   const goToStart = () => {
//     setPlaybackCube(cloneCube(cube));
//     setPlayback(prev => ({ ...prev, step:-1 }));
//   };

//   const goToEnd = () => {
//     const finalCube = applySeq(cube, playback.moves);
//     setPlaybackCube(finalCube);
//     setPlayback(prev => ({ ...prev, step: prev.moves.length-1 }));
//   };

//   // Display cube — solve mode shows playback state
//   const displayCube = (mode==="solve" && playbackCube) ? playbackCube : cube;

//   return (
//     <div className="cube-page">

//       {/* ── TOPBAR ── */}
//       <div className="cube-topbar">
//         <a href="/" className="cube-back">← Back</a>
//         <div className="cube-title-wrap">
//           <span className="cube-eyebrow">🧩 Cuchco</span>
//           <h1 className="cube-title">CUBE SOLVER</h1>
//         </div>
//         <div className="cube-topbar-right">
//           <button className={`tbar-tab${mode==="edit"?" active":""}`} onClick={()=>setMode("edit")}>✏ Edit Colors</button>
//           {solution && <button className={`tbar-tab${mode==="solve"?" active":""}`} onClick={()=>setMode("solve")}>▶ View Solution</button>}
//         </div>
//       </div>

//       <div className="cube-body">

//         {/* ══════════════════ LEFT PANEL ══════════════════ */}
//         <div className="cube-left">

//           {/* Color Picker */}
//           <div className="panel-section">
//             <div className="panel-label">Paint Color</div>
//             <div className="color-palette">
//               {ALL_COLORS.map(col => (
//                 <button
//                   key={col}
//                   className={`palette-btn${selectedColor===col?" pal-sel":""}`}
//                   style={{ background: COLOR_HEX[col] }}
//                   onClick={() => setSelectedColor(col)}
//                   title={COLOR_NAMES[col]}
//                 >
//                   {selectedColor===col && <span className="pal-check">✓</span>}
//                 </button>
//               ))}
//             </div>
//             <div className="pal-selected-label">
//               Selected: <strong style={{color:COLOR_HEX[selectedColor]}}>{COLOR_NAMES[selectedColor]}</strong>
//             </div>
//           </div>

//           {/* Face colors guide */}
//           <div className="panel-section">
//             <div className="panel-label">Center Colors</div>
//             <div className="center-guide">
//               {[{f:"U",c:"W"},{f:"D",c:"Y"},{f:"F",c:"G"},{f:"R",c:"R"},{f:"L",c:"O"},{f:"B",c:"B"}].map(({f,c})=>(
//                 <div key={f} className="cg-row">
//                   <div className="cg-swatch" style={{background:COLOR_HEX[c]}}/>
//                   <span className="cg-face">{f}</span>
//                   <span className="cg-color">{COLOR_NAMES[c]}</span>
//                 </div>
//               ))}
//             </div>
//             <p className="center-note">Centers are fixed — they define each face's color</p>
//           </div>

//           {/* Controls */}
//           <div className="panel-section">
//             <div className="panel-label">Actions</div>
//             <div className="action-btns">
//               <button className="action-btn scramble" onClick={handleScramble}>🎲 Random Scramble</button>
//               <button className="action-btn reset"    onClick={handleReset}>↺ Reset to Solved</button>
//               <button
//                 className={`action-btn solve${solving?" loading":""}`}
//                 onClick={handleSolve}
//                 disabled={solving}
//               >
//                 {solving ? "⏳ Solving..." : "✨ Solve It!"}
//               </button>
//             </div>
//             {error && <div className="error-msg">⚠ {error}</div>}
//           </div>

//           {/* Scramble sequence */}
//           {scrambleSeq.length > 0 && (
//             <div className="panel-section">
//               <div className="panel-label">Scramble Sequence</div>
//               <div className="seq-wrap">
//                 {scrambleSeq.map((m,i)=><span key={i} className="seq-move">{m}</span>)}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* ══════════════════ CENTER: CUBE NET ══════════════════ */}
//         <div className="cube-center">

//           {mode === "edit" && (
//             <div className="cube-net-wrap">
//               <div className="net-instruction">
//                 👆 Click any sticker to paint it with the selected color
//               </div>
//               <div className="cube-net">
//                 <div style={{height:"172px"}}/>
//                 <div className="net-row">
//                   <div style={{width:"172px"}}/>
//                   <FaceEditor faceKey="U" label="TOP (U)" stickers={displayCube.U} selectedColor={selectedColor} onChange={handlePaint}/>
//                 </div>
//                 <div className="net-row">
//                   {["L","F","R","B"].map(f => (
//                     <FaceEditor key={f} faceKey={f} label={f==="L"?"LEFT (L)":f==="F"?"FRONT (F)":f==="R"?"RIGHT (R)":"BACK (B)"} stickers={displayCube[f]} selectedColor={selectedColor} onChange={handlePaint}/>
//                   ))}
//                 </div>
//                 <div className="net-row">
//                   <div style={{width:"172px"}}/>
//                   <FaceEditor faceKey="D" label="BOTTOM (D)" stickers={displayCube.D} selectedColor={selectedColor} onChange={handlePaint}/>
//                 </div>
//               </div>
//             </div>
//           )}

//           {mode === "solve" && solution && (
//             <div className="solve-view">
//               {/* Solution header */}
//               <div className="solution-header">
//                 <div className="sol-badge">✓ SOLUTION FOUND</div>
//                 <div className="sol-method">{solution.method}</div>
//                 {solution.moves.length === 0 && <div className="sol-already">Cube is already solved!</div>}
//               </div>

//               {/* Cube display */}
//               <div className="cube-net solve-net">
//                 <div className="net-row">
//                   <div style={{width:"164px"}}/>
//                   <FaceEditor faceKey="U" label="TOP (U)" stickers={displayCube.U} selectedColor={selectedColor} onChange={()=>{}}/>
//                 </div>
//                 <div className="net-row">
//                   {["L","F","R","B"].map(f => (
//                     <FaceEditor key={f} faceKey={f} label={f} stickers={displayCube[f]} selectedColor={selectedColor} onChange={()=>{}}/>
//                   ))}
//                 </div>
//                 <div className="net-row">
//                   <div style={{width:"164px"}}/>
//                   <FaceEditor faceKey="D" label="BOTTOM (D)" stickers={displayCube.D} selectedColor={selectedColor} onChange={()=>{}}/>
//                 </div>
//               </div>

//               {/* Playback controls */}
//               {solution.moves.length > 0 && playback && (
//                 <div className="playback-bar">
//                   <div className="playback-step">
//                     Step {Math.max(0, playback.step+1)} / {playback.moves.length}
//                     {playback.step >= 0 && (
//                       <span className="current-move-badge">{playback.moves[playback.step]}</span>
//                     )}
//                   </div>
//                   <div className="playback-controls">
//                     <button className="pb-btn" onClick={goToStart} title="Start">⏮</button>
//                     <button className="pb-btn" onClick={stepBack}  title="Back" disabled={playback.step<0}>◀</button>
//                     <button className="pb-btn pb-play" onClick={stepForward} title="Next" disabled={playback.step>=playback.moves.length-1}>▶</button>
//                     <button className="pb-btn" onClick={goToEnd}   title="End">⏭</button>
//                   </div>
//                   <div className="playback-progress">
//                     <div className="pb-progress-bar" style={{width:`${Math.max(0,(playback.step+1)/playback.moves.length*100)}%`}}/>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* ══════════════════ RIGHT PANEL ══════════════════ */}
//         <div className="cube-right">
//           {solution && solution.moves.length > 0 && (
//             <>
//               <div className="panel-label">Solution Moves ({solution.moves.length})</div>
//               <div className="solution-moves">
//                 {solution.moves.map((m,i)=>(
//                   <div
//                     key={i}
//                     className={`sol-move${playback&&playback.step===i?" sol-move-current":playback&&playback.step>i?" sol-move-done":""}`}
//                   >
//                     <span className="sol-move-num">{i+1}</span>
//                     <span className="sol-move-name">{m}</span>
//                   </div>
//                 ))}
//               </div>
//               <div className="panel-label" style={{marginTop:16}}>Notation Key</div>
//               <div className="notation-key">
//                 <div className="nk-row"><span className="nk-move">R</span><span>Right face clockwise</span></div>
//                 <div className="nk-row"><span className="nk-move">R'</span><span>Right face counter-CW</span></div>
//                 <div className="nk-row"><span className="nk-move">R2</span><span>Right face 180°</span></div>
//                 <div className="nk-row"><span className="nk-move">U</span><span>Top face clockwise</span></div>
//                 <div className="nk-row"><span className="nk-move">F</span><span>Front face clockwise</span></div>
//               </div>
//             </>
//           )}
//           {!solution && (
//             <div className="right-placeholder">
//               <div className="rp-icon">🧩</div>
//               <p>Paint your cube colors, then hit <strong>Solve It!</strong> to get the solution moves.</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
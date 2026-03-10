import { useState, useEffect } from "react";
import { FiHome, FiSun, FiMoon, FiMonitor, FiCopy, FiCheck } from "react-icons/fi";
import "./CoursePages.css";

// OLL images from algdb.net (public CDN)
const OLL_IMG = (n) => `https://algdb.net/img/oll/oll${n}.png`;
const PLL_IMG = (n) => `https://algdb.net/img/pll/pll${n}.png`;
const F2L_IMG = (n) => `https://algdb.net/img/f2l/f2l${n}.png`;

// ── BEGINNER ALGORITHMS ────────────────────────────────────
const BEGINNER = [
  // White Cross
  {id:"Cross 1", name:"Edge Flip in Place",    moves:"F R U R' U' F'",            group:"White Cross", img:"", level:"beginner"},
  {id:"Cross 2", name:"Edge Flip Front",       moves:"F U R U' R' F'",            group:"White Cross", img:"", level:"beginner"},
  // White Corners
  {id:"WC 1",    name:"Sexy Move (R Insert)", moves:"R U R' U'",                  group:"White Corners", img:"", level:"beginner"},
  {id:"WC 2",    name:"Corner from Bottom",   moves:"R U' R'",                    group:"White Corners", img:"", level:"beginner"},
  // F2L Beginner
  {id:"F2L B1",  name:"Right Slot Insert",    moves:"U R U' R'",                  group:"Middle Layer", img:"", level:"beginner"},
  {id:"F2L B2",  name:"Left Slot Insert",     moves:"U' L' U L",                  group:"Middle Layer", img:"", level:"beginner"},
  {id:"F2L B3",  name:"Right Insert (full)",  moves:"U R U' R' U' F' U F",        group:"Middle Layer", img:"", level:"beginner"},
  {id:"F2L B4",  name:"Left Insert (full)",   moves:"U' L' U L U F U' F'",        group:"Middle Layer", img:"", level:"beginner"},
  // 2-Look OLL
  {id:"OLL B1",  name:"OLL Cross (T edge)",   moves:"F R U R' U' F'",             group:"Yellow Cross", img:OLL_IMG(3), level:"beginner"},
  {id:"OLL B2",  name:"OLL Cross (L edge)",   moves:"f R U R' U' f'",             group:"Yellow Cross", img:OLL_IMG(4), level:"beginner"},
  {id:"OLL B3",  name:"Sune",                 moves:"R U R' U R U2 R'",           group:"Yellow Corners", img:OLL_IMG(27), level:"beginner"},
  {id:"OLL B4",  name:"Anti-Sune",            moves:"L' U' L U' L' U2 L",         group:"Yellow Corners", img:OLL_IMG(26), level:"beginner"},
  // 2-Look PLL
  {id:"PLL B1",  name:"Corner 3-Cycle",       moves:"U R U' L' U R' U' L",        group:"Permute Corners", img:"", level:"beginner"},
  {id:"PLL B2",  name:"U-perm a (CCW edges)", moves:"R U' R U R U R U' R' U' R2", group:"Permute Edges", img:"", level:"beginner"},
  {id:"PLL B3",  name:"U-perm b (CW edges)",  moves:"R2 U R U R' U' R' U' R' U R'",group:"Permute Edges", img:"", level:"beginner"},
  {id:"PLL B4",  name:"H-perm (opp edges)",   moves:"M2 U M2 U2 M2 U M2",         group:"Permute Edges", img:"", level:"beginner"},
];

// ── PRO ALGORITHMS (F2L + full OLL subset) ────────────────
const PRO = [
  // Core F2L
  {id:"F2L 1",  name:"Both in U, basic",      moves:"U R U' R'",                              group:"F2L Basic", img:F2L_IMG(1), level:"pro"},
  {id:"F2L 2",  name:"Both in U, left",       moves:"U' L' U L",                              group:"F2L Basic", img:F2L_IMG(2), level:"pro"},
  {id:"F2L 3",  name:"Corner up, edge right", moves:"U R U2' R' U R U' R'",                   group:"F2L Corner Up", img:F2L_IMG(3), level:"pro"},
  {id:"F2L 4",  name:"Corner up, edge front", moves:"U' F' U2 F U' F' U F",                   group:"F2L Corner Up", img:F2L_IMG(4), level:"pro"},
  {id:"F2L 5",  name:"Corner in slot (CW)",   moves:"R U' R' U R U' R'",                      group:"F2L Corner In", img:F2L_IMG(5), level:"pro"},
  {id:"F2L 6",  name:"Sexy move (triple)",    moves:"(R U R' U')3",                           group:"F2L Corner In", img:F2L_IMG(6), level:"pro"},
  {id:"F2L 7",  name:"Edge in slot",          moves:"R U R' U2 R U' R'",                      group:"F2L Edge In", img:F2L_IMG(7), level:"pro"},
  {id:"F2L 8",  name:"Both in slot, wrong",   moves:"R U' R' U R U R'",                       group:"F2L Both In", img:F2L_IMG(8), level:"pro"},
  {id:"F2L 9",  name:"Direct pair insert",    moves:"R U R'",                                 group:"F2L Direct", img:F2L_IMG(9), level:"pro"},
  {id:"F2L 10", name:"Back slot right",       moves:"y' R' U R",                              group:"F2L Direct", img:F2L_IMG(10), level:"pro"},
  // OLL Pro set
  {id:"OLL 1",  name:"Dot — all edges wrong", moves:"(R U2)(R2' F R F')(U2)(R' F R F')",      group:"OLL Dot", img:OLL_IMG(1), level:"pro"},
  {id:"OLL 2",  name:"Lightning bolt",        moves:"F R U R' U' F' f R U R' U' f'",          group:"OLL Dot", img:OLL_IMG(2), level:"pro"},
  {id:"OLL 3",  name:"Cross T-shape",         moves:"F R U R' U' F'",                         group:"OLL Cross", img:OLL_IMG(3), level:"pro"},
  {id:"OLL 4",  name:"Cross L-shape",         moves:"f R U R' U' f'",                         group:"OLL Cross", img:OLL_IMG(4), level:"pro"},
  {id:"OLL 21", name:"Sune",                  moves:"R U R' U R U2 R'",                       group:"OLL Corners", img:OLL_IMG(21), level:"pro"},
  {id:"OLL 22", name:"Anti-Sune",             moves:"L' U' L U' L' U2 L",                     group:"OLL Corners", img:OLL_IMG(22), level:"pro"},
  {id:"OLL 23", name:"Headlights + Sune",     moves:"R2 D R' U2 R D' R' U2 R'",              group:"OLL Corners", img:OLL_IMG(23), level:"pro"},
  {id:"OLL 24", name:"Chameleon",             moves:"r U R' U' r' F R F'",                    group:"OLL T-Shape", img:OLL_IMG(24), level:"pro"},
  {id:"OLL 25", name:"Bowtie",                moves:"F' r U R' U' r' F R",                    group:"OLL T-Shape", img:OLL_IMG(25), level:"pro"},
  {id:"OLL 26", name:"Headlights",            moves:"R U2 R' U' R U' R'",                     group:"OLL Corners", img:OLL_IMG(26), level:"pro"},
  {id:"OLL 27", name:"Pi (Bruno)",            moves:"R U2 R2' U' R2 U' R2' U2 R",             group:"OLL Corners", img:OLL_IMG(27), level:"pro"},
  {id:"OLL 29", name:"Knight move",           moves:"M U R U R' U' R' F R F' M'",             group:"OLL P-Shape", img:OLL_IMG(29), level:"pro"},
  {id:"OLL 33", name:"P-shape",               moves:"R U R' U' R' F R F'",                    group:"OLL P-Shape", img:OLL_IMG(33), level:"pro"},
  {id:"OLL 37", name:"Fish salad",            moves:"F R' F' R U R U' R'",                    group:"OLL Fish", img:OLL_IMG(37), level:"pro"},
  {id:"OLL 45", name:"T-case",                moves:"F R U R' U' F'",                         group:"OLL T-Shape", img:OLL_IMG(45), level:"pro"},
  {id:"OLL 57", name:"Skip!",                 moves:"—",                                      group:"OLL Skip", img:"", level:"pro"},
  // Core PLL
  {id:"T-perm",  name:"T Permutation",        moves:"R U R' U' R' F R2 U' R' U' R U R' F'",  group:"PLL Adjacent", img:PLL_IMG(20), level:"pro"},
  {id:"U-perm a",name:"U-perm a",             moves:"R U' R U R U R U' R' U' R2",             group:"PLL Edges", img:PLL_IMG(22), level:"pro"},
  {id:"U-perm b",name:"U-perm b",             moves:"R2 U R U R' U' R' U' R' U R'",          group:"PLL Edges", img:PLL_IMG(23), level:"pro"},
  {id:"J-perm a",name:"J-perm a",             moves:"x' R2 F R F' R U2 r' U r U2 x",         group:"PLL Adjacent", img:PLL_IMG(10), level:"pro"},
  {id:"J-perm b",name:"J-perm b",             moves:"R U R' F' R U R' U' R' F R2 U' R'",     group:"PLL Adjacent", img:PLL_IMG(11), level:"pro"},
];

// ── FULL ALGORITHMS (all 57 OLL + all 21 PLL + full F2L) ──
const FULL = [
  // FULL OLL 1-57
  {id:"OLL 1",  name:"All edges flipped",      moves:"(R U2)(R2' F R F')(U2)(R' F R F')",     group:"OLL Dot",    img:OLL_IMG(1)},
  {id:"OLL 2",  name:"Lightning",              moves:"F R U R' U' F' f R U R' U' f'",         group:"OLL Dot",    img:OLL_IMG(2)},
  {id:"OLL 3",  name:"Cross T",                moves:"F R U R' U' F'",                        group:"OLL Cross",  img:OLL_IMG(3)},
  {id:"OLL 4",  name:"Cross L",                moves:"f R U R' U' f'",                        group:"OLL Cross",  img:OLL_IMG(4)},
  {id:"OLL 5",  name:"Square left",            moves:"r' U2 R U R' U r",                      group:"OLL Square", img:OLL_IMG(5)},
  {id:"OLL 6",  name:"Square right",           moves:"r U2 R' U' R U' r'",                   group:"OLL Square", img:OLL_IMG(6)},
  {id:"OLL 7",  name:"Lightning left",         moves:"r U R' U R U2 r'",                      group:"OLL L-Shape",img:OLL_IMG(7)},
  {id:"OLL 8",  name:"Lightning right",        moves:"r' U' R U' R' U2 r",                   group:"OLL L-Shape",img:OLL_IMG(8)},
  {id:"OLL 9",  name:"Crane",                  moves:"R U R' U' R' F R2 U R' U' F'",         group:"OLL Fish",   img:OLL_IMG(9)},
  {id:"OLL 10", name:"Hardback",               moves:"R U R' U R' F R F' R U2 R'",           group:"OLL Fish",   img:OLL_IMG(10)},
  {id:"OLL 11", name:"Downstairs",             moves:"r' R2 U R' U R U2 R' U M'",            group:"OLL L-Shape",img:OLL_IMG(11)},
  {id:"OLL 12", name:"Frying pan",             moves:"M' R' U' R U' R' U2 R U' M",           group:"OLL L-Shape",img:OLL_IMG(12)},
  {id:"OLL 13", name:"Gun",                    moves:"F U R U' R2 F' R U R U' R'",           group:"OLL Knight", img:OLL_IMG(13)},
  {id:"OLL 14", name:"Gun mirror",             moves:"R' F R U R' F' R F U' F'",             group:"OLL Knight", img:OLL_IMG(14)},
  {id:"OLL 15", name:"Squeegee",               moves:"r' U' r R' U' R U r' U r",             group:"OLL Knight", img:OLL_IMG(15)},
  {id:"OLL 16", name:"Squeegee mirror",        moves:"r U r' R U R' U' r U' r'",             group:"OLL Knight", img:OLL_IMG(16)},
  {id:"OLL 17", name:"Slash",                  moves:"R U R' U R' F R F' U2 R' F R F'",     group:"OLL Cross",  img:OLL_IMG(17)},
  {id:"OLL 18", name:"Crown",                  moves:"r U R' U R U2 r2' U' R U' R' U2 r",   group:"OLL Cross",  img:OLL_IMG(18)},
  {id:"OLL 19", name:"Bunny",                  moves:"M U R U R' U' M' R' F R F'",           group:"OLL Cross",  img:OLL_IMG(19)},
  {id:"OLL 20", name:"X",                      moves:"r U R' U' M2 U R U' R' U' M'",        group:"OLL Dot",    img:OLL_IMG(20)},
  {id:"OLL 21", name:"Sune",                   moves:"R U R' U R U2 R'",                     group:"OLL Sune",   img:OLL_IMG(21)},
  {id:"OLL 22", name:"Anti-Sune",              moves:"L' U' L U' L' U2 L",                   group:"OLL Sune",   img:OLL_IMG(22)},
  {id:"OLL 23", name:"Sune OLL 23",            moves:"R2 D R' U2 R D' R' U2 R'",            group:"OLL Sune",   img:OLL_IMG(23)},
  {id:"OLL 24", name:"Chameleon",              moves:"r U R' U' r' F R F'",                  group:"OLL T-Shape",img:OLL_IMG(24)},
  {id:"OLL 25", name:"Bowtie",                 moves:"F' r U R' U' r' F R",                  group:"OLL T-Shape",img:OLL_IMG(25)},
  {id:"OLL 26", name:"Headlights CW",          moves:"R U2 R' U' R U' R'",                   group:"OLL Corners",img:OLL_IMG(26)},
  {id:"OLL 27", name:"Pi (Bruno)",             moves:"R U2 R2' U' R2 U' R2' U2 R",           group:"OLL Corners",img:OLL_IMG(27)},
  {id:"OLL 28", name:"Fung",                   moves:"r U R' U' r' R U R U' R'",             group:"OLL Corners",img:OLL_IMG(28)},
  {id:"OLL 29", name:"Knight",                 moves:"M U R U R' U' R' F R F' M'",           group:"OLL P-Shape",img:OLL_IMG(29)},
  {id:"OLL 30", name:"Anti-knight",            moves:"M' U' L' U' L U L F' L' F M",          group:"OLL P-Shape",img:OLL_IMG(30)},
  {id:"OLL 31", name:"P case CW",              moves:"R' U' F U R U' R' F' R",               group:"OLL P-Shape",img:OLL_IMG(31)},
  {id:"OLL 32", name:"P case CCW",             moves:"L U F' U' L' U L F L'",                group:"OLL P-Shape",img:OLL_IMG(32)},
  {id:"OLL 33", name:"P-shape",                moves:"R U R' U' R' F R F'",                  group:"OLL P-Shape",img:OLL_IMG(33)},
  {id:"OLL 34", name:"P-shape mirror",         moves:"R U R' U' y' R' F R F'",               group:"OLL P-Shape",img:OLL_IMG(34)},
  {id:"OLL 35", name:"Fish CW",                moves:"R U2 R2' F R F' R U2 R'",              group:"OLL Fish",   img:OLL_IMG(35)},
  {id:"OLL 36", name:"Keyhole",                moves:"R' U' R U' R' U R U l U' R' U x",     group:"OLL Fish",   img:OLL_IMG(36)},
  {id:"OLL 37", name:"Fish salad",             moves:"F R' F' R U R U' R'",                  group:"OLL Fish",   img:OLL_IMG(37)},
  {id:"OLL 38", name:"Fish mouth",             moves:"R U R' U R U' R' U' R' F R F'",       group:"OLL Fish",   img:OLL_IMG(38)},
  {id:"OLL 39", name:"F (big fish)",           moves:"R U R' F' U' F U R U2 R'",             group:"OLL Fish",   img:OLL_IMG(39)},
  {id:"OLL 40", name:"F mirror",               moves:"R' F R F' U' R' U' R U R' U R",       group:"OLL Fish",   img:OLL_IMG(40)},
  {id:"OLL 41", name:"Awkward fish",           moves:"R U R' U R U2 R' F R U R' U' F'",     group:"OLL L-Shape",img:OLL_IMG(41)},
  {id:"OLL 42", name:"Awkward fish mirror",    moves:"R' U' R U' R' U2 R F R U R' U' F'",  group:"OLL L-Shape",img:OLL_IMG(42)},
  {id:"OLL 43", name:"L (outside)",            moves:"R' U' F' U F R",                       group:"OLL L-Shape",img:OLL_IMG(43)},
  {id:"OLL 44", name:"L (inside)",             moves:"F U R U' R' F'",                       group:"OLL L-Shape",img:OLL_IMG(44)},
  {id:"OLL 45", name:"T-case",                 moves:"F R U R' U' F'",                       group:"OLL T-Shape",img:OLL_IMG(45)},
  {id:"OLL 46", name:"T-case left",            moves:"R' U' R' F R F' U R",                  group:"OLL T-Shape",img:OLL_IMG(46)},
  {id:"OLL 47", name:"Hockey stick (CW)",      moves:"F' L' U' L U L' U' L U F",             group:"OLL L-Shape",img:OLL_IMG(47)},
  {id:"OLL 48", name:"Hockey stick (CCW)",     moves:"F R U R' U' R U R' U' F'",             group:"OLL L-Shape",img:OLL_IMG(48)},
  {id:"OLL 49", name:"C case right",           moves:"r U' r2' U r2 U r2' U' r",             group:"OLL Square", img:OLL_IMG(49)},
  {id:"OLL 50", name:"C case left",            moves:"r' U r2 U' r2' U' r2 U r'",            group:"OLL Square", img:OLL_IMG(50)},
  {id:"OLL 51", name:"S-shape right",          moves:"f R U R' U' f' U' F R U R' U' F'",    group:"OLL S-Shape",img:OLL_IMG(51)},
  {id:"OLL 52", name:"S-shape left",           moves:"R U R' U R d' R U' R' F'",             group:"OLL S-Shape",img:OLL_IMG(52)},
  {id:"OLL 53", name:"W right",                moves:"R' F R U R U' R2' F' R2 U' R' U R U R'",group:"OLL W-Shape",img:OLL_IMG(53)},
  {id:"OLL 54", name:"W left",                 moves:"R U R' U R U' R2' F' R U R U' R' F",  group:"OLL W-Shape",img:OLL_IMG(54)},
  {id:"OLL 55", name:"Zipper",                 moves:"R U2 R2' U' R U' R' U2 F R F'",        group:"OLL Corners",img:OLL_IMG(55)},
  {id:"OLL 56", name:"I case",                 moves:"r' U' r U' R' U R U' R' U R r' U r",  group:"OLL Corners",img:OLL_IMG(56)},
  {id:"OLL 57", name:"Skip",                   moves:"—",                                    group:"OLL Skip",   img:""},
  // FULL PLL 1-21
  {id:"Aa-perm",name:"A-perm a",               moves:"x R' U R' D2 R U' R' D2 R2 x'",        group:"PLL Corners",img:PLL_IMG(1)},
  {id:"Ab-perm",name:"A-perm b",               moves:"x R2 D2 R U R' D2 R U' R x'",          group:"PLL Corners",img:PLL_IMG(2)},
  {id:"E-perm", name:"E Permutation",          moves:"x' R U' R' D R U R' D' R U R' D R U' R' D' x",group:"PLL Corners",img:PLL_IMG(3)},
  {id:"F-perm", name:"F Permutation",          moves:"R' U' F' R U R' U' R' F R2 U' R' U' R U R' U R",group:"PLL Adjacent",img:PLL_IMG(4)},
  {id:"Ga-perm",name:"G-perm a",               moves:"R2 U R' U R' U' R U' R2 D U' R' U R D'",group:"PLL G-perm",  img:PLL_IMG(5)},
  {id:"Gb-perm",name:"G-perm b",               moves:"R' U' R y R2 U R' U R U' R U' R2 y'",  group:"PLL G-perm",  img:PLL_IMG(6)},
  {id:"Gc-perm",name:"G-perm c",               moves:"R2 U' R U' R U R' U R2 D' U R U' R' D",group:"PLL G-perm",  img:PLL_IMG(7)},
  {id:"Gd-perm",name:"G-perm d",               moves:"R U R' y' R2 U' R U' R' U R' U R2",    group:"PLL G-perm",  img:PLL_IMG(8)},
  {id:"H-perm", name:"H Permutation",          moves:"M2 U M2 U2 M2 U M2",                    group:"PLL Edges",   img:PLL_IMG(9)},
  {id:"Ja-perm",name:"J-perm a",               moves:"x' R2 F R F' R U2 r' U r U2 x",         group:"PLL Adjacent",img:PLL_IMG(10)},
  {id:"Jb-perm",name:"J-perm b",               moves:"R U R' F' R U R' U' R' F R2 U' R'",     group:"PLL Adjacent",img:PLL_IMG(11)},
  {id:"Na-perm",name:"N-perm a",               moves:"R U R' U R U R' F' R U R' U' R' F R2 U' R' U2 R U' R'",group:"PLL Diagonal",img:PLL_IMG(12)},
  {id:"Nb-perm",name:"N-perm b",               moves:"R' U L' U2 R U' L R' U L' U2 R U' L U2",group:"PLL Diagonal",img:PLL_IMG(13)},
  {id:"Ra-perm",name:"R-perm a",               moves:"R U' R' U' R U R D R' U' R D' R' U2 R' U'",group:"PLL Adjacent",img:PLL_IMG(14)},
  {id:"Rb-perm",name:"R-perm b",               moves:"R' U2 R U2 R' F R U R' U' R' F' R2 U'", group:"PLL Adjacent",img:PLL_IMG(15)},
  {id:"T-perm", name:"T Permutation",          moves:"R U R' U' R' F R2 U' R' U' R U R' F'",  group:"PLL Adjacent",img:PLL_IMG(16)},
  {id:"Ua-perm",name:"U-perm a",               moves:"R U' R U R U R U' R' U' R2",             group:"PLL Edges",   img:PLL_IMG(17)},
  {id:"Ub-perm",name:"U-perm b",               moves:"R2 U R U R' U' R' U' R' U R'",          group:"PLL Edges",   img:PLL_IMG(18)},
  {id:"V-perm", name:"V Permutation",          moves:"R' U R' U' y R' F' R2 U' R' U R' F R F",group:"PLL Diagonal",img:PLL_IMG(19)},
  {id:"Y-perm", name:"Y Permutation",          moves:"F R U' R' U' R U R' F' R U R' U' R' F R F'",group:"PLL Diagonal",img:PLL_IMG(20)},
  {id:"Z-perm", name:"Z Permutation",          moves:"M2 U M2 U M' U2 M2 U2 M' U2",           group:"PLL Edges",   img:PLL_IMG(21)},
  // FULL F2L 1-41
  {id:"F2L 1",  name:"Basic right",            moves:"U R U' R'",                             group:"F2L Basic",   img:F2L_IMG(1)},
  {id:"F2L 2",  name:"Basic left",             moves:"U' L' U L",                             group:"F2L Basic",   img:F2L_IMG(2)},
  {id:"F2L 3",  name:"Corner up edge right",   moves:"U R U2' R' U R U' R'",                  group:"F2L Corner Up",img:F2L_IMG(3)},
  {id:"F2L 4",  name:"Corner up edge front",   moves:"U' F' U2 F U' F' U F",                  group:"F2L Corner Up",img:F2L_IMG(4)},
  {id:"F2L 5",  name:"Corner in slot CW",      moves:"R U' R' U R U' R'",                     group:"F2L Corner In",img:F2L_IMG(5)},
  {id:"F2L 6",  name:"Sexy move triple",       moves:"(R U R' U')3",                          group:"F2L Corner In",img:F2L_IMG(6)},
  {id:"F2L 7",  name:"Edge in slot top",       moves:"R U2 R' U R U' R'",                     group:"F2L Edge In", img:F2L_IMG(7)},
  {id:"F2L 8",  name:"Edge in slot flip",      moves:"U' R U' R' U2 R U' R'",                 group:"F2L Edge In", img:F2L_IMG(8)},
  {id:"F2L 9",  name:"Both in slot CW",        moves:"R U' R' U R U R'",                      group:"F2L Both In", img:F2L_IMG(9)},
  {id:"F2L 10", name:"Both in slot CCW",       moves:"R U R' U' R U' R' U2 R U' R'",          group:"F2L Both In", img:F2L_IMG(10)},
  {id:"F2L 11", name:"Skipped edge",           moves:"R U R' U2 R U R'",                      group:"F2L Edge Skip",img:F2L_IMG(11)},
  {id:"F2L 12", name:"Edge paired above",      moves:"R U2 R'",                               group:"F2L Direct",  img:F2L_IMG(12)},
];

const LEVELS = ["beginner","pro","full"];
const LEVEL_LABELS = {beginner:"BEGINNER", pro:"PRO", full:"FULL"};

function AlgCard({a, onCopy, copied}){
  const isCopied = copied === a.moves;
  return (
    <div className="alg-card">
      <div className="alg-card-top">
        {a.img
          ? <img src={a.img} alt={a.name} className="alg-img" onError={e=>{e.target.style.display="none";}} loading="lazy"/>
          : <div className="alg-img-placeholder"><span style={{fontSize:".55rem",color:"var(--text3)",fontFamily:"Space Mono",letterSpacing:"1px"}}>IMG</span></div>
        }
        <div className="alg-card-info">
          <div className="alg-id" style={{color:"var(--red)"}}>{a.id}</div>
          <span className="alg-group-badge">{a.group}</span>
          <div className="alg-name">{a.name}</div>
        </div>
      </div>
      <div className="alg-moves">{a.moves}</div>
      <div className="alg-card-footer">
        <button
          className={`alg-copy-btn${isCopied?" copied":""}`}
          onClick={(e)=>{e.stopPropagation(); onCopy(a.moves);}}
        >
          {isCopied ? <><FiCheck size={10}/> Copied</> : <><FiCopy size={10}/> Copy</>}
        </button>
      </div>
    </div>
  );
}

const SunIcon     = () => <FiSun size={14}/>;
const MoonIcon    = () => <FiMoon size={14}/>;
const MonitorIcon = () => <FiMonitor size={14}/>;
const TwitterIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L2.25 2.25h6.836l4.265 5.633L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/></svg>;
const InstaIcon   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>;
const YTIcon      = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M23 7s-.3-2-1.2-2.7c-1.1-1.2-2.4-1.2-3-1.3C16.2 2.9 12 2.9 12 2.9s-4.2 0-6.8.2c-.6 0-1.9.1-3 1.3C1.3 5 1 7 1 7S.7 9.3.7 11.5v2.1c0 2.2.3 4.4.3 4.4s.3 2 1.2 2.7c1.1 1.2 2.6 1.1 3.3 1.2C7.4 22 12 22 12 22s4.2 0 6.8-.2c.6 0 1.9-.1 3-1.3.9-.7 1.2-2.7 1.2-2.7s.3-2.2.3-4.4v-2.1C23.3 9.3 23 7 23 7zM9.7 15.5V8.4l6.6 3.6-6.6 3.5z"/></svg>;
const GHIcon      = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>;

export default function AlgLibrary() {
  const [theme,   setTheme]   = useState(() => localStorage.getItem("cuchco-theme") || "dark");
  const [level,   setLevel]   = useState("beginner");
  const [algType, setAlgType] = useState("ALL");
  const [search,  setSearch]  = useState("");
  const [copied,  setCopied]  = useState(null);

  useEffect(() => {
    const t = theme === "system"
      ? (window.matchMedia("(prefers-color-scheme:light)").matches ? "light" : "dark") : theme;
    document.documentElement.setAttribute("data-theme", t);
    localStorage.setItem("cuchco-theme", theme);
  }, [theme]);

  const copy = (moves) => {
    navigator.clipboard?.writeText(moves);
    setCopied(moves);
    setTimeout(() => setCopied(null), 1800);
  };

  const DATA = level === "beginner" ? BEGINNER : level === "pro" ? PRO : FULL;

  // Alg type filter
  const algTypes = ["ALL", ...new Set(DATA.map(a => a.group.split(" ")[0]))];

  const filtered = DATA.filter(a => {
    const q = search.toLowerCase();
    const matchSearch = !q || a.id.toLowerCase().includes(q) || a.name.toLowerCase().includes(q) || a.group.toLowerCase().includes(q) || a.moves.toLowerCase().includes(q);
    const matchType = algType === "ALL" || a.group.startsWith(algType);
    return matchSearch && matchType;
  });

  // Group by section
  const groups = {};
  filtered.forEach(a => {
    const g = a.group;
    if (!groups[g]) groups[g] = [];
    groups[g].push(a);
  });

  const levelColor = level === "beginner" ? "#FF5733" : level === "pro" ? "#FFD100" : "#B882FF";

  return (
    <div className="alg-root">

      {/* ── NAV ── */}
      <nav className="cp-nav">
        <a href="/" className="cp-nav-home" title="Home"><FiHome size={17}/></a>
        <div className="cp-nav-div"/>
        <span className="cp-nav-brand">CUCHCO</span>
        <span className="cp-nav-slash">/</span>
        <span className="cp-nav-title">ALGORITHM LIBRARY</span>
        <div className="cp-nav-gap"/>
        <div className="cp-theme-toggle">
          <button className={`cp-t-btn${theme==="light"?" on":""}`}  onClick={()=>setTheme("light")}><SunIcon/></button>
          <button className={`cp-t-btn${theme==="system"?" on":""}`} onClick={()=>setTheme("system")}><MonitorIcon/></button>
          <button className={`cp-t-btn${theme==="dark"?" on":""}`}   onClick={()=>setTheme("dark")}><MoonIcon/></button>
        </div>
        <a href="/cube" className="cp-nav-back">← Cube</a>
      </nav>

      {/* ── HERO ── */}
      <div className="alg-hero">
        <h1 className="alg-hero-h1">ALGORITHM<br/><span>LIBRARY</span></h1>
        <p className="alg-hero-sub">Beginner basics · Pro set · Full 57 OLL + 21 PLL + 41 F2L. Click any card to copy the notation.</p>
        <div className="alg-hero-chips">
          <span className="alg-hero-chip" style={{borderColor:"#FF5733",color:"#FF5733"}}>BEGINNER — 16 algs</span>
          <span className="alg-hero-chip" style={{borderColor:"#FFD100",color:"#B8860B"}}>PRO — 32 algs</span>
          <span className="alg-hero-chip" style={{borderColor:"#B882FF",color:"#B882FF"}}>FULL — 119 algs</span>
        </div>
      </div>

      {/* ── CONTROLS ── */}
      <div className="alg-controls">
        <div className="alg-level-tabs">
          {LEVELS.map(l => (
            <button
              key={l}
              className={`alg-level-btn${level===l?" active-"+l:""}`}
              onClick={() => { setLevel(l); setAlgType("ALL"); setSearch(""); }}
            >{LEVEL_LABELS[l]}</button>
          ))}
        </div>
        <div className="alg-type-tabs">
          {algTypes.slice(0,6).map(t => (
            <button key={t} className={`alg-type-btn${algType===t?" on":""}`} onClick={()=>setAlgType(t)}>{t}</button>
          ))}
        </div>
        <input
          className="alg-search"
          placeholder="Search algorithms…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* ── COUNT ── */}
      <div className="alg-count-bar">
        {filtered.length} ALGORITHM{filtered.length!==1?"S":""} · <span style={{color:levelColor}}>{LEVEL_LABELS[level]}</span>
      </div>

      {/* ── GRID BY GROUP ── */}
      {Object.keys(groups).map(g => (
        <div key={g}>
          <div className="alg-section-label">{g}</div>
          <div className="alg-grid">
            {groups[g].map(a => (
              <AlgCard key={a.id} a={a} onCopy={copy} copied={copied}/>
            ))}
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <div className="alg-empty">No algorithms match "{search}"</div>
      )}

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
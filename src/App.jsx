import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home        from "./pages/Home/Home";
import Community   from "./pages/Community/Community";
import About       from "./pages/About/About";
import CubeSolver  from "./pages/Tools/CubeSolver";
import ChessBoard  from "./pages/Tools/ChessBoard";
import CodeEditor  from "./pages/Tools/Codeeditor";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"           element={<Home />} />
        <Route path="/community"  element={<Community />} />
        <Route path="/about"      element={<About />} />
        <Route path="/cube"       element={<CubeSolver />} />
        <Route path="/chess"      element={<ChessBoard />} />
        <Route path="/code"       element={<CodeEditor />} />
      </Routes>
    </BrowserRouter>
  );
}

// hello ! bro make the chess board pro looking pls it si noob when checkmate strikes checkmate and when ther eis check show check! liek that pls bro and the cube i need to chosee colro and enter it and then it have to solve it in moves plsss
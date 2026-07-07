import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home          from "./pages/Home/Home";
import Community     from "./pages/Community/Community";
import About         from "./pages/About/About";
import Learn         from "./pages/Learn/Learn";
import Cube          from "./pages/Cube/Cube";
import Chess         from "./pages/Chess/Chess";
import Coding        from "./pages/Coding/Coding";
import CubeSolver    from "./pages/Tools/CubeSolver";
import SpeedTimer    from "./pages/Tools/SpeedTimer";
import AlgLibrary    from "./pages/Tools/AlgLibrary";
import BeginnerCourse from "./pages/Tools/BeginnerCourse";
import CfopCourse    from "./pages/Tools/CfopCourse";
import ChessBoard    from "./pages/Tools/ChessBoard";
import CodeEditor    from "./pages/Tools/CodeEditor";
import Report        from "./pages/Community/Report";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                element={<Home />} />
        <Route path="/learn"           element={<Learn />} />
        <Route path="/community"       element={<Community />} />
        <Route path="/report"          element={<Report />} />
        <Route path="/about"           element={<About />} />
        {/* Hub pages */}
        <Route path="/cube"            element={<Cube />} />
        <Route path="/chess"           element={<Chess />} />
        <Route path="/coding"          element={<Coding />} />
        {/* Cube tools */}
        <Route path="/cube/solver"     element={<CubeSolver />} />
        <Route path="/cube/timer"      element={<SpeedTimer />} />
        <Route path="/cube/algorithms" element={<AlgLibrary />} />
        <Route path="/cube/beginner"   element={<BeginnerCourse />} />
        <Route path="/cube/cfop"       element={<CfopCourse />} />
        {/* Chess tools */}
        <Route path="/chess/board"     element={<ChessBoard />} />
        {/* Code tools */}
        <Route path="/code"            element={<CodeEditor />} />
      </Routes>
    </BrowserRouter>
  );
}
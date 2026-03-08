import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home       from "./pages/Home/Home";
import Community  from "./pages/Community/Community";
import About      from "./pages/About/About";
import CubeSolver from "./pages/Tools/CubeSolver";
import ChessBoard from "./pages/Tools/ChessBoard";
import CodeEditor from "./pages/Tools/CodeEditor";

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
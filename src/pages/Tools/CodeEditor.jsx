import { useState } from "react";
import "./CodeEditor.css";

export default function CodeEditor() {
  const [html, setHtml] = useState("<h1>Hello World!</h1>");
  const [css, setCss] = useState("body { font-family: Arial; }");
  const [js, setJs] = useState("console.log('Hello!');");

  return (
    <div className="code-editor-page">
      <div className="tool-header">
        <h1>💻 CODE PLAYGROUND</h1>
        <p>Live HTML/CSS/JS editor in your browser</p>
      </div>
      
      <div className="tool-content">
        <div className="editor-section">
          <div className="editor-tabs">
            <button className="tab active">HTML</button>
            <button className="tab">CSS</button>
            <button className="tab">JavaScript</button>
          </div>
          
          <div className="editor-panels">
            <div className="editor-panel">
              <textarea
                value={html}
                onChange={(e) => setHtml(e.target.value)}
                className="code-textarea"
                placeholder="Write HTML here..."
              />
            </div>
            
            <div className="editor-panel">
              <textarea
                value={css}
                onChange={(e) => setCss(e.target.value)}
                className="code-textarea"
                placeholder="Write CSS here..."
              />
            </div>
            
            <div className="editor-panel">
              <textarea
                value={js}
                onChange={(e) => setJs(e.target.value)}
                className="code-textarea"
                placeholder="Write JavaScript here..."
              />
            </div>
          </div>
        </div>

        <div className="preview-section">
          <div className="preview-header">
            <h3>Live Preview</h3>
            <button className="run-btn">▶ Run</button>
          </div>
          <div className="preview-frame">
            <iframe
              srcDoc={`
                <!DOCTYPE html>
                <html>
                  <head>
                    <style>${css}</style>
                  </head>
                  <body>
                    ${html}
                    <script>${js}</script>
                  </body>
                </html>
              `}
              className="preview-iframe"
            />
          </div>
        </div>

        <div className="features">
          <h3>Features</h3>
          <ul>
            <li>🌐 Live preview as you type</li>
            <li>📝 Syntax highlighting</li>
            <li>🚀 Auto-save your work</li>
            <li>📤 Share and export projects</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

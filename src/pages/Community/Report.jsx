import { useState, useEffect } from "react";
import "./Report.css";

// ── EmailJS config ────────────────────────────────────────────
// 1. Go to https://www.emailjs.com → free account → Add Service (Gmail)
// 2. Create Email Template with these variables:
//    {{report_type}}  {{reason}}  {{details}}  {{reported_user}}
//    {{reporter_id}}  {{timestamp}}
// 3. Paste your IDs below:
const EMAILJS_SERVICE_ID  = "YOUR_SERVICE_ID";   // e.g. service_abc123
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";  // e.g. template_xyz789
const EMAILJS_PUBLIC_KEY  = "YOUR_PUBLIC_KEY";   // e.g. abcDEFghiJKL

const REPORT_TYPES = [
  { value:"spam",          label:"Spam or fake account" },
  { value:"harassment",    label:"Bullying or harassment" },
  { value:"hate",          label:"Hate speech" },
  { value:"inappropriate", label:"Inappropriate content" },
  { value:"impersonation", label:"Impersonation" },
  { value:"cheating",      label:"Cheating / unfair play" },
  { value:"other",         label:"Something else" },
];

export default function Report() {
  const [theme,setTheme]=useState(()=>localStorage.getItem("cuchco-theme")||"dark");
  useEffect(()=>{const r=theme==="system"?(window.matchMedia("(prefers-color-scheme:light)").matches?"light":"dark"):theme;document.documentElement.setAttribute("data-theme",r);},[theme]);

  // parse ?userId=&username= from URL
  const params      = new URLSearchParams(window.location.search);
  const reportedId  = params.get("userId")   || "";
  const reportedUn  = params.get("username") || "Unknown user";

  const [type,    setType]    = useState("");
  const [details, setDetails] = useState("");
  const [status,  setStatus]  = useState("idle"); // idle | sending | done | error
  const [errMsg,  setErrMsg]  = useState("");

  async function submit(e) {
    e.preventDefault();
    if (!type) { setErrMsg("Please select a report type."); return; }
    setStatus("sending"); setErrMsg("");

    const templateParams = {
      report_type:   REPORT_TYPES.find(r=>r.value===type)?.label || type,
      reason:        type,
      details:       details || "(no additional details)",
      reported_user: `${reportedUn} (ID: ${reportedId})`,
      reporter_id:   localStorage.getItem("cuchco-user")
                       ? JSON.parse(localStorage.getItem("cuchco-user")||"{}").username || "unknown"
                       : "anonymous",
      timestamp:     new Date().toLocaleString(),
    };

    try {
      // Load EmailJS from CDN dynamically
      if (!window.emailjs) {
        await new Promise((res,rej)=>{
          const s=document.createElement("script");
          s.src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
          s.onload=res; s.onerror=rej;
          document.head.appendChild(s);
        });
        window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
      }
      await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
      setStatus("done");
    } catch(err) {
      setStatus("error");
      setErrMsg("Failed to send report: " + (err?.text || err?.message || "Unknown error"));
    }
  }

  if (status === "done") return (
    <div className="rp-page">
      <div className="rp-card">
        <div className="rp-success-icon">✓</div>
        <h2 className="rp-success-title">Report Submitted</h2>
        <p className="rp-success-sub">Thank you. We've received your report about <strong>{reportedUn}</strong> and will review it within 24–48 hours.</p>
        <a href="/community" className="rp-back-btn">← Back to Community</a>
      </div>
    </div>
  );

  return (
    <div className="rp-page">
      <nav className="rp-nav">
        <a href="/community" className="rp-nav-logo">CUCHCO</a>
        <span className="rp-nav-sep">/</span>
        <span className="rp-nav-title">REPORT</span>
      </nav>

      <div className="rp-card">
        <div className="rp-header">
          <div className="rp-flag-icon">🚩</div>
          <h1 className="rp-title">Report User</h1>
          <p className="rp-sub">Reporting <strong className="rp-username">@{reportedUn}</strong></p>
        </div>

        <form className="rp-form" onSubmit={submit}>
          {/* Report type */}
          <div className="rp-field">
            <label className="rp-label">What's the issue? <span className="rp-req">*</span></label>
            <div className="rp-options">
              {REPORT_TYPES.map(r=>(
                <button type="button" key={r.value}
                  className={`rp-option${type===r.value?" rp-option-sel":""}`}
                  onClick={()=>setType(r.value)}>
                  {type===r.value&&<span className="rp-check">✓</span>}
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Additional details */}
          <div className="rp-field">
            <label className="rp-label">Additional details <span className="rp-opt-lbl">(optional)</span></label>
            <textarea
              className="rp-textarea"
              placeholder="Describe what happened, include post links or screenshots if possible…"
              value={details}
              onChange={e=>setDetails(e.target.value)}
              rows={5}
              maxLength={1000}
            />
            <div className="rp-char">{details.length}/1000</div>
          </div>

          {errMsg&&<div className="rp-err">{errMsg}</div>}

          <div className="rp-footer">
            <a href="/community" className="rp-cancel">Cancel</a>
            <button type="submit" className="rp-submit" disabled={status==="sending"}>
              {status==="sending"?"Sending…":"Submit Report"}
            </button>
          </div>
        </form>

        {/* Setup instructions box */}
        <div className="rp-setup-box">
          <div className="rp-setup-title">📧 How to receive reports in your email</div>
          <ol className="rp-setup-steps">
            <li>Go to <a href="https://www.emailjs.com" target="_blank" rel="noreferrer">emailjs.com</a> → create free account</li>
            <li>Add a Gmail (or any) email service → copy <strong>Service ID</strong></li>
            <li>Create an Email Template with these variables:<br/>
              <code>{"{{report_type}} {{details}} {{reported_user}} {{reporter_id}} {{timestamp}}"}</code>
            </li>
            <li>Copy your <strong>Template ID</strong> and <strong>Public Key</strong> (Account → API Keys)</li>
            <li>Paste all three into <code>Report.jsx</code> at the top — replace <code>YOUR_SERVICE_ID</code> etc.</li>
            <li>Every submitted report will land directly in your Gmail inbox ✓</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
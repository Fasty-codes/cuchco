// import { useState, useEffect, useRef, useCallback } from "react";
import { useState, useEffect, useRef } from "react";

import "./Community.css";
import {
  apiRegister, apiLogin, apiUpdateProfile,
  apiCreatePost, apiGetPosts, apiDeletePost, apiToggleLike,
  apiAddComment, apiGetComments, apiDeleteComment,
  uploadImage, saveSession, loadSession, clearSession, timeAgo
} from "../../sheetsApi";

/* ============================================================
   MEGA DROPDOWN DATA  (same as Home)
   ============================================================ */
const MEGA_ITEMS = {
  cube: [
    { icon:"🧩", label:"Cube Solver",      desc:"Interactive 3D solver & visualizer",  locked:false, href:"/cube"  },
    { icon:"⏱️", label:"Speed Timer",       desc:"WCA-style solve timer with stats",    locked:false, href:"/cube"  },
    { icon:"📖", label:"Algorithm Library", desc:"OLL, PLL, F2L algorithm reference",   locked:true,  href:"/cube"  },
    { icon:"🏆", label:"Beginner Course",   desc:"Layer-by-layer full video course",    locked:true,  href:"/cube"  },
    { icon:"🚀", label:"CFOP Full Course",  desc:"Advanced speedcubing method",         locked:true,  href:"/cube"  },
  ],
  code: [
    { icon:"💻", label:"Code Playground",  desc:"Live HTML/CSS/JS editor in browser",  locked:false, href:"/code"  },
    { icon:"🌐", label:"Web Dev Track",    desc:"HTML → CSS → JS → React roadmap",     locked:true,  href:"/code"  },
    { icon:"🐍", label:"Python Basics",    desc:"Beginner-friendly Python course",     locked:true,  href:"/code"  },
    { icon:"⚛️", label:"React Course",     desc:"Component-based UI development",      locked:true,  href:"/code"  },
    { icon:"🛠️", label:"Project Builder",  desc:"Build real apps step by step",        locked:true,  href:"/code"  },
  ],
  chess: [
    { icon:"♟️", label:"Chess Board",      desc:"Play & analyze games interactively",  locked:false, href:"/chess" },
    { icon:"🧩", label:"Puzzle Trainer",   desc:"Daily tactics & pattern recognition", locked:false, href:"/chess" },
    { icon:"📚", label:"Opening Explorer", desc:"Browse and study chess openings",     locked:true,  href:"/chess" },
    { icon:"📊", label:"Game Analysis",    desc:"Review your games with engine hints", locked:true,  href:"/chess" },
    { icon:"🎓", label:"Endgame Studies",  desc:"Master king & pawn endgame theory",   locked:true,  href:"/chess" },
  ],
};

/* ============================================================
   ICONS
   ============================================================ */
const HeartIcon  = ({ filled }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill={filled?"currentColor":"none"} stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
  </svg>
);
const CommentIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
  </svg>
);
const ImageIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21,15 16,10 5,21"/>
  </svg>
);
const VideoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="23,7 16,12 23,17"/><rect x="1" y="5" width="15" height="14" rx="2"/>
  </svg>
);
const TextIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/>
    <line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/>
  </svg>
);
const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3,6 5,6 21,6"/><path d="M19,6v14a2,2,0,01-2,2H7a2,2,0,01-2-2V6m3,0V4a2,2,0,012-2h4a2,2,0,012,2v2"/>
  </svg>
);
const DotsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/>
  </svg>
);
const SunIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);
const MoonIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
  </svg>
);
const MonitorIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
  </svg>
);
const GithubIcon    = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>;
const LinkedinIcon  = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;
const InstagramIcon = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>;
const YoutubeIcon   = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>;
const ChevronDown   = () => (
  <svg className="chevron" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
    <polyline points="2,3 5,7 8,3"/>
  </svg>
);

const SOCIALS = [
  { icon:<GithubIcon />,    href:"https://github.com",    label:"GitHub" },
  { icon:<LinkedinIcon />,  href:"https://linkedin.com",  label:"LinkedIn" },
  { icon:<InstagramIcon />, href:"https://instagram.com", label:"Instagram" },
  { icon:<YoutubeIcon />,   href:"https://youtube.com",   label:"YouTube" },
];

/* ============================================================
   AVATAR HELPER
   ============================================================ */
function AvatarEl({ user, size = "" }) {
  const cls = `avatar${size ? " " + size : ""}`;
  if (user?.avatarUrl) return (
    <div className={cls}><img src={user.avatarUrl} alt={user.username}/></div>
  );
  return <div className={cls}>{(user?.username || "?")[0].toUpperCase()}</div>;
}

/* ============================================================
   NESTED COMMENT COMPONENT
   ============================================================ */
function CommentNode({ comment, allComments, user, onReply, onDelete, depth = 0 }) {
  const replies = allComments.filter(c => c.parentId === comment.id);
  const [showReplyBox, setShowReplyBox] = useState(false);

  return (
    <div className="comment-item">
      <AvatarEl user={{ username: comment.username, avatarUrl: comment.avatarUrl }} size="xs" />
      <div className="comment-content-wrap">
        <div className="comment-bubble">
          <div className="comment-author-row">
            <span className="comment-author">{comment.username}</span>
            <span className="comment-time">{timeAgo(comment.createdAt)}</span>
          </div>
          <p className="comment-text">{comment.content}</p>
        </div>

        <div className="comment-actions-row">
          {user && depth < 3 && (
            <button className="comment-action-btn" onClick={() => setShowReplyBox(v => !v)}>
              {showReplyBox ? "Cancel" : "Reply"}
            </button>
          )}
          {user && user.id === comment.userId && (
            <button className="comment-action-btn danger" onClick={() => onDelete(comment.id)}>
              Delete
            </button>
          )}
        </div>

        {/* Reply composer */}
        {showReplyBox && (
          <div className="reply-composer">
            <CommentInput
              user={user}
              placeholder={`Reply to ${comment.username}...`}
              onSubmit={async (text) => {
                await onReply(comment.id, text);
                setShowReplyBox(false);
              }}
            />
          </div>
        )}

        {/* Nested replies */}
        {replies.length > 0 && (
          <div className="nested-comments">
            {replies.map(reply => (
              <CommentNode
                key={reply.id}
                comment={reply}
                allComments={allComments}
                user={user}
                onReply={onReply}
                onDelete={onDelete}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   COMMENT INPUT
   ============================================================ */
function CommentInput({ user, placeholder = "Write a comment…", onSubmit }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!text.trim() || loading) return;
    setLoading(true);
    await onSubmit(text.trim());
    setText("");
    setLoading(false);
  };

  return (
    <div>
      <textarea
        className="comment-input"
        placeholder={placeholder}
        value={text}
        rows={2}
        onChange={e => setText(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } }}
      />
      <div className="comment-input-actions">
        <button className="btn-comment-submit" onClick={submit} disabled={!text.trim() || loading}>
          {loading ? "…" : "Post"}
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   POST CARD COMPONENT
   ============================================================ */
function PostCard({ post, user, likedPostIds, onLike, onDelete, onAuthRequired }) {
  const [showComments, setShowComments]   = useState(false);
  const [comments,     setComments]       = useState([]);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [menuOpen,     setMenuOpen]       = useState(false);
  const [lightbox,     setLightbox]       = useState(false);
  const menuRef = useRef(null);

  // Close menu on outside click
  useEffect(() => {
    const fn = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const loadComments = async () => {
    if (commentsLoaded) return;
    setLoadingComments(true);
    try {
      const res = await apiGetComments(post.id);
      setComments(res.comments || []);
      setCommentsLoaded(true);
    } catch {}
    setLoadingComments(false);
  };

  const toggleComments = async () => {
    if (!showComments && !commentsLoaded) await loadComments();
    setShowComments(v => !v);
  };

  const handleAddComment = async (parentId, content) => {
    if (!user) { onAuthRequired(); return; }
    try {
      const res = await apiAddComment(post.id, parentId, user.id, user.username, user.avatarUrl || "", content);
      setComments(prev => [...prev, res.comment]);
    } catch (err) { alert(err.message); }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await apiDeleteComment(commentId, user.id);
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch (err) { alert(err.message); }
  };

  const isLiked    = likedPostIds.has(post.id);
  const isOwner    = user && user.id === post.userId;
  const rootComments = comments.filter(c => !c.parentId);

  return (
    <>
      <div className="post-card">
        {/* Header */}
        <div className="post-header">
          <div className="post-author">
            <AvatarEl user={{ username: post.username, avatarUrl: post.avatarUrl }} />
            <div className="post-author-info">
              <strong>
                {post.username}
                <span className={`post-type-badge badge-${post.type}`}>{post.type}</span>
              </strong>
              <span>{timeAgo(post.createdAt)}</span>
            </div>
          </div>

          {/* Menu */}
          {isOwner && (
            <div ref={menuRef} style={{ position: "relative" }}>
              <button className="post-menu-btn" onClick={() => setMenuOpen(v => !v)}>
                <DotsIcon />
              </button>
              {menuOpen && (
                <div className="post-dropdown">
                  <button className="danger" onClick={() => { setMenuOpen(false); onDelete(post.id); }}>
                    <TrashIcon /> &nbsp;Delete Post
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Text content */}
        {post.content && <p className="post-text">{post.content}</p>}

        {/* Media */}
        {post.mediaUrl && post.type === "image" && (
          <img
            className="post-media"
            src={post.mediaUrl}
            alt="post"
            onClick={() => setLightbox(true)}
          />
        )}
        {post.mediaUrl && post.type === "video" && (
          <video className="post-video" src={post.mediaUrl} controls/>
        )}

        {/* Actions */}
        <div className="post-actions">
          <button
            className={`action-btn${isLiked ? " liked" : ""}`}
            onClick={() => user ? onLike(post.id) : onAuthRequired()}
          >
            <HeartIcon filled={isLiked} />
            {post.likes > 0 ? post.likes : ""} {isLiked ? "Liked" : "Like"}
          </button>

          <button className="action-btn" onClick={toggleComments}>
            <CommentIcon />
            {comments.length > 0 ? comments.length : ""} Comment{comments.length !== 1 ? "s" : ""}
          </button>
        </div>

        {/* Comments */}
        {showComments && (
          <div className="comments-section">
            <div className="comments-body">
              {/* New comment input */}
              {user ? (
                <div className="comment-input-row">
                  <AvatarEl user={user} size="xs" />
                  <div className="comment-input-wrap">
                    <CommentInput
                      user={user}
                      onSubmit={(text) => handleAddComment("", text)}
                    />
                  </div>
                </div>
              ) : (
                <p style={{ fontSize: "0.82rem", color: "var(--text2)", marginBottom: "16px" }}>
                  <span
                    style={{ color: "var(--yellow)", cursor: "pointer" }}
                    onClick={onAuthRequired}
                  >
                    Log in
                  </span>{" "}
                  to leave a comment.
                </p>
              )}

              {/* Comments list */}
              {loadingComments && <div className="spinner" />}
              <div className="comments-list">
                {rootComments.map(c => (
                  <CommentNode
                    key={c.id}
                    comment={c}
                    allComments={comments}
                    user={user}
                    onReply={(parentId, text) => handleAddComment(parentId, text)}
                    onDelete={handleDeleteComment}
                  />
                ))}
              </div>

              {commentsLoaded && rootComments.length === 0 && !loadingComments && (
                <p style={{ fontSize: "0.8rem", color: "var(--text3)", textAlign: "center", padding: "12px 0" }}>
                  No comments yet. Be the first!
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="lightbox-overlay" onClick={() => setLightbox(false)}>
          <button className="lightbox-close" onClick={() => setLightbox(false)}>✕</button>
          <img src={post.mediaUrl} alt="full" onClick={e => e.stopPropagation()} />
        </div>
      )}
    </>
  );
}

/* ============================================================
   PROFILE SETTINGS MODAL
   ============================================================ */
function SettingsModal({ user, onClose, onSave }) {
  const [username,  setUsername]  = useState(user.username || "");
  const [email,     setEmail]     = useState(user.email    || "");
  const [bio,       setBio]       = useState(user.bio      || "");
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl|| "");
  const [newPass,   setNewPass]   = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [saved,     setSaved]     = useState(false);
  const [error,     setError]     = useState("");

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setAvatarUrl(url);
    } catch { setError("Image upload failed. Check your imgbb API key."); }
    setUploading(false);
  };

  const handleSave = async () => {
    setSaving(true); setError(""); setSaved(false);
    try {
      const res = await apiUpdateProfile(user.id, { username, email, avatarUrl, bio });
      saveSession(res.user);
      onSave(res.user);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) { setError(err.message); }
    setSaving(false);
  };

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-box" onClick={e => e.stopPropagation()}>
        <div className="settings-header">
          <h2>SETTINGS</h2>
          <button className="settings-close" onClick={onClose}>✕</button>
        </div>

        <div className="settings-body">
          {/* Avatar */}
          <div className="avatar-upload-section">
            <div className="avatar-large">
              {avatarUrl
                ? <img src={avatarUrl} alt="avatar"/>
                : username[0]?.toUpperCase()
              }
            </div>
            <div className="avatar-upload-info">
              <h4>Profile Photo</h4>
              <p>JPG, PNG or GIF · Max 5MB</p>
              <label className="btn-upload-avatar">
                {uploading ? "Uploading…" : "Upload Photo"}
                <input type="file" accept="image/*" onChange={handleAvatarUpload} disabled={uploading}/>
              </label>
            </div>
          </div>

          {/* Profile info */}
          <div className="settings-section-title">Profile</div>

          <div className="settings-row">
            <div className="settings-field">
              <label>Username</label>
              <input value={username} onChange={e => setUsername(e.target.value)} placeholder="username"/>
            </div>
            <div className="settings-field">
              <label>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com"/>
            </div>
          </div>

          <div className="settings-field">
            <label>Bio</label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Tell the community about yourself…"
            />
          </div>

          {/* Password */}
          <div className="settings-section-title">Security</div>
          <div className="settings-field">
            <label>New Password (leave blank to keep current)</label>
            <input
              type="password"
              value={newPass}
              onChange={e => setNewPass(e.target.value)}
              placeholder="New password"
            />
          </div>

          {error && (
            <p style={{ color: "#ff4444", fontSize: "0.8rem", marginTop: "8px" }}>{error}</p>
          )}
        </div>

        <div className="settings-footer">
          {saved && <span className="settings-save-msg">✓ Saved successfully</span>}
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-post" onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save Changes →"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   AUTH MODAL
   ============================================================ */
function AuthModal({ onClose, onLogin, defaultTab = "login" }) {
  const [tab,      setTab]      = useState(defaultTab);
  const [username, setUsername] = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const handle = async () => {
    if (!email || !password || (tab === "signup" && !username)) {
      setError("Please fill in all fields."); return;
    }
    setLoading(true); setError("");
    try {
      let res;
      if (tab === "login") {
        res = await apiLogin(email, password);
      } else {
        res = await apiRegister(username, email, password);
      }
      saveSession(res.user);
      onLogin(res.user);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-box" onClick={e => e.stopPropagation()}>
        <button className="auth-close" onClick={onClose}>✕</button>
        <div className="auth-logo">CUCHCO</div>
        <p className="auth-subtitle">Your brain's favorite training ground.</p>
        <div className="auth-tabs">
          <button className={`auth-tab${tab === "login"  ? " active" : ""}`} onClick={() => { setTab("login");  setError(""); }}>Log In</button>
          <button className={`auth-tab${tab === "signup" ? " active" : ""}`} onClick={() => { setTab("signup"); setError(""); }}>Sign Up</button>
        </div>
        {tab === "signup" && (
          <div className="auth-field">
            <label>Username</label>
            <input value={username} onChange={e => setUsername(e.target.value)} placeholder="e.g. speedcuber99" autoFocus/>
          </div>
        )}
        <div className="auth-field">
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" autoFocus={tab === "login"}/>
        </div>
        <div className="auth-field">
          <label>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            onKeyDown={e => e.key === "Enter" && handle()}
          />
        </div>
        {error && <p style={{ color: "#ff4444", fontSize: "0.8rem", margin: "4px 0" }}>{error}</p>}
        <button className="auth-submit" onClick={handle} disabled={loading}>
          {loading ? "Please wait…" : tab === "login" ? "Log In →" : "Create Account →"}
        </button>
        <p className="auth-divider">
          {tab === "login"
            ? <> No account?{" "}<span style={{ color:"var(--yellow)", cursor:"pointer" }} onClick={() => { setTab("signup"); setError(""); }}>Sign up free</span></>
            : <> Already have one?{" "}<span style={{ color:"var(--yellow)", cursor:"pointer" }} onClick={() => { setTab("login"); setError(""); }}>Log in</span></>
          }
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   CREATE POST COMPOSER
   ============================================================ */
function CreatePost({ user, onPost }) {
  const [open,     setOpen]     = useState(false);
  const [type,     setType]     = useState("text");
  const [content,  setContent]  = useState("");
  const [file,     setFile]     = useState(null);
  const [preview,  setPreview]  = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const removeMedia = () => { setFile(null); setPreview(null); };

  const submit = async () => {
    if (!content.trim() && !file) { setError("Write something or add media."); return; }
    setLoading(true); setError("");
    try {
      let mediaUrl = "";
      if (file) mediaUrl = await uploadImage(file);
      const res = await apiCreatePost(
        user.id, user.username, user.avatarUrl || "",
        type, content.trim(), mediaUrl
      );
      onPost(res.post);
      setContent(""); setFile(null); setPreview(null); setOpen(false);
    } catch (err) { setError(err.message); }
    setLoading(false);
  };

  return (
    <div className="create-post-card">
      <div className="create-post-top">
        <AvatarEl user={user} />
        <input
          className="create-post-input"
          placeholder={`What's on your mind, ${user.username}?`}
          onClick={() => setOpen(true)}
          readOnly
        />
      </div>

      <div className={`composer${open ? " open" : ""}`}>
        {/* Type tabs */}
        <div className="post-type-tabs">
          {[["text","Text",<TextIcon/>],["image","Image",<ImageIcon/>],["video","Video",<VideoIcon/>]].map(([v,l,ico])=>(
            <button
              key={v}
              className={`post-type-btn${type===v?" active":""}`}
              onClick={() => { setType(v); setFile(null); setPreview(null); }}
            >
              {ico} {l}
            </button>
          ))}
        </div>

        <textarea
          className="composer-textarea"
          placeholder="Share something with the community…"
          value={content}
          onChange={e => setContent(e.target.value)}
        />

        {/* Media upload */}
        {(type === "image" || type === "video") && (
          <div className="composer-media">
            {!preview ? (
              <label className="media-upload-btn">
                {type === "image" ? <ImageIcon/> : <VideoIcon/>}
                {type === "image" ? "Add Image" : "Add Video"}
                <input
                  type="file"
                  accept={type === "image" ? "image/*" : "video/*"}
                  onChange={handleFile}
                />
              </label>
            ) : (
              <div className="media-preview">
                {type === "image"
                  ? <img src={preview} alt="preview"/>
                  : <video src={preview} style={{ maxWidth:200, maxHeight:140 }}/>
                }
                <button className="media-remove" onClick={removeMedia}>✕</button>
              </div>
            )}
          </div>
        )}

        {error && <p style={{ color:"#ff4444", fontSize:"0.78rem", marginBottom:"8px" }}>{error}</p>}

        <div className="composer-actions">
          <button className="btn-cancel" onClick={() => { setOpen(false); setContent(""); setFile(null); setPreview(null); setError(""); }}>
            Cancel
          </button>
          <button className="btn-post" onClick={submit} disabled={loading}>
            {loading ? "Posting…" : "Post →"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   MAIN COMMUNITY PAGE
   ============================================================ */
export default function Community() {
  const [user,         setUser]         = useState(() => loadSession());
  const [posts,        setPosts]        = useState([]);
  const [likedIds,     setLikedIds]     = useState(new Set());
  const [loading,      setLoading]      = useState(true);
  const [authOpen,     setAuthOpen]     = useState(false);
  const [authTab,      setAuthTab]      = useState("login");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [dropdown,     setDropdown]     = useState(null);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const navRef = useRef(null);

  // ── Theme ─────────────────────────────────────────────
  const [themeMode, setThemeMode] = useState(() => {
    try { return localStorage.getItem("cuchco-theme") || "system"; } catch { return "system"; }
  });
  const [sysDark, setSysDark] = useState(
    () => typeof window !== "undefined" ? window.matchMedia("(prefers-color-scheme: dark)").matches : true
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const fn = (e) => setSysDark(e.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);
  useEffect(() => { try { localStorage.setItem("cuchco-theme", themeMode); } catch {} }, [themeMode]);
  const isDark = themeMode === "dark" || (themeMode === "system" && sysDark);
  useEffect(() => { document.documentElement.classList.toggle("light", !isDark); }, [isDark]);

  // Close dropdown on outside click
  useEffect(() => {
    const fn = (e) => { if (navRef.current && !navRef.current.contains(e.target)) setDropdown(null); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  // Escape closes menus
  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") { setDropdown(null); setMobileOpen(false); setAuthOpen(false); } };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  // ── Load posts ────────────────────────────────────────
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await apiGetPosts();
        setPosts(res.posts || []);
      } catch {}
      setLoading(false);
    })();
  }, []);

  const handleLogin = (u) => { setUser(u); setAuthOpen(false); };
  const handleLogout = () => { clearSession(); setUser(null); };

  const handlePost = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await apiDeletePost(postId, user.id);
      setPosts(prev => prev.filter(p => p.id !== postId));
    } catch (err) { alert(err.message); }
  };

  const handleLike = async (postId) => {
    try {
      const res = await apiToggleLike(postId, user.id);
      setLikedIds(prev => {
        const next = new Set(prev);
        if (res.liked) next.add(postId); else next.delete(postId);
        return next;
      });
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: res.likes } : p));
    } catch (err) { alert(err.message); }
  };

  const openAuth = (tab = "login") => { setAuthTab(tab); setAuthOpen(true); };

  /* ── RENDER ─────────────────────────────────────────── */
  return (
    <div className="community-page">

      {/* ══════════ NAVBAR ══════════ */}
      <nav className="nav" ref={navRef}>
        <a href="/" className="nav-logo" style={{ textDecoration:"none" }}>CUCHCO</a>

        <div className="nav-center">
          <div className="nav-item" onMouseLeave={() => setDropdown(null)}>
            <a href="/learn" className="nav-link"
              onMouseEnter={() => setDropdown("learn")}
              onClick={() => setDropdown(null)}
            >Learn <ChevronDown /></a>
          </div>
          <div className="nav-item">
            <a href="/#lessons" className="nav-link">Lessons</a>
          </div>
          <div className="nav-item">
            <a href="/community" className="nav-link" style={{color:"var(--yellow)"}}>Community</a>
          </div>
          <div className="nav-item">
            <a href="/about" className="nav-link">About</a>
          </div>
        </div>

        {/* Right side */}
        <div className="nav-right">
          {/* Theme toggle */}
          <div className="theme-toggle">
            <button className={`t-btn${themeMode==="light"  ? " on" : ""}`} onClick={() => setThemeMode("light")}  title="Light"><SunIcon/></button>
            <button className={`t-btn${themeMode==="system" ? " on" : ""}`} onClick={() => setThemeMode("system")} title="System"><MonitorIcon/></button>
            <button className={`t-btn${themeMode==="dark"   ? " on" : ""}`} onClick={() => setThemeMode("dark")}   title="Dark"><MoonIcon/></button>
          </div>

          {user ? (
            <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
              <div className="user-chip" onClick={() => setSettingsOpen(true)} title="Settings">
                <div className="avatar xs">
                  {user.avatarUrl
                    ? <img src={user.avatarUrl} alt="" style={{width:"100%",height:"100%",borderRadius:"50%",objectFit:"cover"}}/>
                    : user.username[0].toUpperCase()
                  }
                </div>
                {user.username}
              </div>
              <button className="btn-login" onClick={() => setSettingsOpen(true)}>⚙ Settings</button>
              <button className="btn-login" onClick={handleLogout}>Log Out</button>
            </div>
          ) : (
            <>
              <button className="btn-login"  onClick={() => openAuth("login")}>Log In</button>
              <button className="btn-signup" onClick={() => openAuth("signup")}>Sign Up</button>
            </>
          )}

          {/* Hamburger */}
          <button className="hamburger" onClick={() => setMobileOpen(o => !o)} aria-label="Menu">
            <span/><span/><span/>
          </button>
        </div>
      </nav>

      {/* ══════════ MEGA DROPDOWN ══════════ */}
      <div
        className={`mega-dropdown${dropdown === "learn" ? " open" : ""}`}
        onMouseLeave={() => setDropdown(null)}
      >
        <div className="mega-inner">
          <div className="mega-left">
            <h2>MASTER<br/>YOUR MIND</h2>
            <p>Explore Cubing, Coding, and Chess — three disciplines that sharpen your brain in different ways.</p>
            {!user && (
              <button className="btn-signup" onClick={() => { setDropdown(null); openAuth("signup"); }}>
                Get Started Free →
              </button>
            )}
          </div>
          <div className="mega-cols">
            {["cube","code","chess"].map(cat => (
              <div className="mega-col" key={cat}>
                <div className={`mega-col-head ${cat}`}>
                  <span>{cat==="cube"?"🧩":cat==="code"?"💻":"♟️"}</span>
                  <h3>{cat.toUpperCase()}</h3>
                </div>
                <div className="mega-links">
                  {MEGA_ITEMS[cat].map(item => (
                    <a
                      key={item.label}
                      href={item.locked && !user ? undefined : item.href}
                      className="mega-link"
                      onClick={(e) => {
                        setDropdown(null);
                        if (item.locked && !user) { e.preventDefault(); openAuth("login"); }
                      }}
                    >
                      <span className="mega-link-icon">{item.icon}</span>
                      <div className="mega-link-text">
                        <strong>{item.label}</strong>
                        <span>{item.desc}</span>
                      </div>
                      {item.locked && !user && <span className="mega-lock">🔒</span>}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════ MOBILE MENU ══════════ */}
      <div className={`mobile-menu${mobileOpen ? " open" : ""}`}>
        <a href="/learn"      className="mobile-menu-link" onClick={() => setMobileOpen(false)}>Learn</a>
        <a href="/#lessons"   className="mobile-menu-link" onClick={() => setMobileOpen(false)}>Lessons</a>
        <a href="/community"  className="mobile-menu-link" onClick={() => setMobileOpen(false)}>Community</a>
        <a href="/about"      className="mobile-menu-link" onClick={() => setMobileOpen(false)}>About</a>
        <div className="mobile-theme-row">
          <span className="mobile-theme-label">THEME</span>
          <div className="theme-toggle">
            <button className={`t-btn${themeMode==="light"  ? " on" : ""}`} onClick={() => setThemeMode("light")}><SunIcon/></button>
            <button className={`t-btn${themeMode==="system" ? " on" : ""}`} onClick={() => setThemeMode("system")}><MonitorIcon/></button>
            <button className={`t-btn${themeMode==="dark"   ? " on" : ""}`} onClick={() => setThemeMode("dark")}><MoonIcon/></button>
          </div>
        </div>
        <div className="mobile-auth-row">
          {user ? (
            <>
              <span className="mobile-username">👤 {user.username}</span>
              <button className="btn-login" onClick={() => { setMobileOpen(false); setSettingsOpen(true); }}>Settings</button>
            </>
          ) : (
            <>
              <button className="btn-login"  onClick={() => { setMobileOpen(false); openAuth("login"); }}>Log In</button>
              <button className="btn-signup" onClick={() => { setMobileOpen(false); openAuth("signup"); }}>Sign Up</button>
            </>
          )}
        </div>
      </div>

      {/* ── HERO ── */}
      <div className="community-hero">
        <h1>THE <span>COMMUNITY</span></h1>
        <p>Share your solves, projects, games, and thoughts with fellow cubers, coders, and chess players.</p>
      </div>

      {/* ── BODY ── */}
      <div className="community-body">

        {/* Gate if not logged in */}
        {!user && (
          <div className="gate-banner">
            <p><strong>🔒 Login to post</strong> — You can view posts, but log in to like, comment, and share.</p>
            <button onClick={() => openAuth("signup")}>Join Free →</button>
          </div>
        )}

        {/* Create post */}
        {user && <CreatePost user={user} onPost={handlePost} />}

        {/* Posts feed */}
        {loading ? (
          <div className="spinner" />
        ) : posts.length === 0 ? (
          <div className="empty-feed">
            <div className="empty-icon">🧩</div>
            <h3>NO POSTS YET</h3>
            <p>Be the first to share something with the community!</p>
          </div>
        ) : (
          <div className="posts-feed">
            {posts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                user={user}
                likedPostIds={likedIds}
                onLike={handleLike}
                onDelete={handleDelete}
                onAuthRequired={() => openAuth("login")}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── FOOTER ── */}
      <footer>
        <div className="footer-brand">
          <div className="nav-logo">CUCHCO</div>
          <p>Your brain deserves a workout. Master Cubing, Coding, and Chess.</p>
          <div className="footer-social">
            {SOCIALS.map(s=>(
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="social-icon" title={s.label}>{s.icon}</a>
            ))}
          </div>
        </div>
        <div className="footer-links">
          <div className="footer-col">
            <h4>Navigate</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/#lessons">Lessons</a></li>
              <li><a href="/community">Community</a></li>
              <li><a href="/about">About</a></li>
            </ul>
          </div>
        </div>
      </footer>
      <div className="footer-bottom">
        <p>© 2025 Cuchco. Built with ❤️ and ☕</p>
        <p>React + CSS3 · Google Sheets Backend</p>
      </div>

      {/* ── AUTH MODAL ── */}
      {authOpen && (
        <AuthModal
          defaultTab={authTab}
          onClose={() => setAuthOpen(false)}
          onLogin={handleLogin}
        />
      )}

      {/* ── SETTINGS MODAL ── */}
      {settingsOpen && user && (
        <SettingsModal
          user={user}
          onClose={() => setSettingsOpen(false)}
          onSave={(updated) => { setUser(updated); setSettingsOpen(false); }}
        />
      )}
    </div>
  );
}

// eslint-disable-next-line
// eslint-disable-next-line
// import { useState, useEffect, useRef, useCallback } from "react";
// import "./Community.css";
// import {
//   apiRegister, apiLogin, apiGetUser, apiGetAllUsers,
//   apiCreatePost, apiGetPosts, apiDeletePost, apiToggleLike,
//   apiAddComment, apiGetComments, apiDeleteComment,
//   apiSendFollowReq, apiAcceptFollow, apiRejectFollow, apiUnfollow,
//   apiGetFollowState, apiGetFollowers, apiGetFollowing, apiGetPendingReqs,
//   apiSendMessage, apiGetMessages, apiDeleteMessage, apiGetConversations, apiMarkRead,
//   uploadImage, saveSession, loadSession, clearSession, timeAgo,
// } from "../../sheetsApi";

// // ── ICONS ─────────────────────────────────────────────────────
// const HeartIcon     = ({filled}) => <svg width="16" height="16" viewBox="0 0 24 24" fill={filled?"currentColor":"none"} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>;
// const CommentIcon   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>;
// const SendIcon      = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22,2 15,22 11,13 2,9"/></svg>;
// const TrashIcon     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3,6 5,6 21,6"/><path d="M19,6v14a2,2,0,01-2,2H7a2,2,0,01-2-2V6m3,0V4a2,2,0,012-2h4a2,2,0,012,2v2"/></svg>;
// const ImageIcon     = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg>;
// const VideoIcon     = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23,7 16,12 23,17"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>;
// const LinkIcon      = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>;
// const MsgIcon       = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>;
// const CheckIcon     = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>;
// const CloseIcon     = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
// const BellIcon      = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>;
// const SearchIcon    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
// const HashIcon      = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>;
// const BackIcon      = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>;
// const UserPlusIcon  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>;
// const UserCheckIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>;
// const SunIcon       = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>;
// const MoonIcon      = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>;
// const MonitorIcon   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>;
// const PlusIcon      = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
// const XIcon         = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
// const HomeIcon      = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>;
// const PlayIcon      = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>;

// // ── AVATAR ────────────────────────────────────────────────────
// function Avatar({ url, name, size = 38 }) {
//   const initials = (name||"?").split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2);
//   const colors = ["#FF5733","#FFD100","#B882FF","#00C4D4","#4ade80","#f59e0b","#3b82f6"];
//   const bg = colors[(name||"").charCodeAt(0) % colors.length];
//   if (url) return <img src={url} alt={name} className="cm-avatar" style={{width:size,height:size}} onError={e=>{e.target.style.display="none";}}/>;
//   return <div className="cm-avatar cm-avatar-text" style={{width:size,height:size,background:bg,fontSize:size*0.38}}>{initials}</div>;
// }

// // ── RICH TEXT ─────────────────────────────────────────────────
// function RichText({ text, onTagClick }) {
//   if (!text) return null;
//   return (
//     <span>
//       {text.split(/(#\w+)/g).map((p,i) =>
//         p.startsWith("#")
//           ? <button key={i} className="cm-tag-inline" onClick={()=>onTagClick(p.slice(1))}>{p}</button>
//           : p
//       )}
//     </span>
//   );
// }

// // ── IMAGE GALLERY ─────────────────────────────────────────────
// function ImageGallery({ images }) {
//   const [cur, setCur] = useState(0);
//   if (!images || images.length === 0) return null;
//   if (images.length === 1) return (
//     <div className="cm-media-wrap">
//       <img src={images[0]} alt="" className="cm-media-img" onError={e=>{e.target.style.display="none";}}/>
//     </div>
//   );
//   return (
//     <div className="cm-gallery">
//       <img src={images[cur]} alt="" className="cm-gallery-img" onError={e=>{e.target.style.display="none";}}/>
//       <button className="cm-gallery-arrow left" onClick={()=>setCur(c=>(c-1+images.length)%images.length)}>‹</button>
//       <button className="cm-gallery-arrow right" onClick={()=>setCur(c=>(c+1)%images.length)}>›</button>
//       <div className="cm-gallery-dots">
//         {images.map((_,i)=><span key={i} className={`cm-gdot${i===cur?" on":""}`} onClick={()=>setCur(i)}/>)}
//       </div>
//       <div className="cm-gallery-count">{cur+1}/{images.length}</div>
//     </div>
//   );
// }

// // ── VIDEO PLAYER ──────────────────────────────────────────────
// function VideoPlayer({ url }) {
//   const [playing, setPlaying] = useState(false);
//   const ref = useRef(null);
//   if (!url) return null;

//   // YouTube embed detection
//   const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
//   if (ytMatch) {
//     const id = ytMatch[1];
//     return (
//       <div className="cm-media-wrap cm-video-wrap">
//         <iframe
//           src={`https://www.youtube.com/embed/${id}`}
//           title="video" frameBorder="0"
//           allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture"
//           allowFullScreen className="cm-video-iframe"
//         />
//       </div>
//     );
//   }

//   return (
//     <div className="cm-media-wrap cm-video-wrap" onClick={()=>{
//       if(playing){ ref.current?.pause(); setPlaying(false); }
//       else { ref.current?.play(); setPlaying(true); }
//     }}>
//       <video ref={ref} src={url} className="cm-media-img" onEnded={()=>setPlaying(false)} preload="metadata"/>
//       {!playing && <div className="cm-play-overlay"><PlayIcon/></div>}
//     </div>
//   );
// }

// // ── SHARE BTN ─────────────────────────────────────────────────
// function ShareBtn({ post }) {
//   const [copied, setCopied] = useState(false);
//   const url = post.shareUrl || `${window.location.origin}/post/${post.id}`;
//   function copy() { navigator.clipboard?.writeText(url); setCopied(true); setTimeout(()=>setCopied(false),2000); }
//   return (
//     <button className={`cm-act-btn${copied?" cm-copied":""}`} onClick={copy}>
//       {copied ? <><CheckIcon/><span>Copied!</span></> : <><LinkIcon/><span>Share</span></>}
//     </button>
//   );
// }

// // ── FOLLOW BUTTON ─────────────────────────────────────────────
// function FollowBtn({ myId, targetId, compact }) {
//   const [status, setStatus] = useState("loading");
//   const [busy,   setBusy]   = useState(false);
//   useEffect(()=>{
//     if(!myId||!targetId||myId===targetId) return;
//     apiGetFollowState(myId,targetId).then(r=>setStatus(r.status||"none")).catch(()=>setStatus("none"));
//   },[myId,targetId]);
//   if(!myId||myId===targetId) return null;
//   async function handle(){
//     setBusy(true);
//     try{
//       if(status==="none"){ await apiSendFollowReq(myId,targetId); setStatus("pending"); }
//       else if(status==="accepted"){ await apiUnfollow(myId,targetId); setStatus("none"); }
//     }catch(e){alert(e.message);}finally{setBusy(false);}
//   }
//   const labels={loading:"…",none:"Follow",pending:"Requested",accepted:"Following"};
//   return (
//     <button
//       className={`follow-btn follow-btn-${status}${compact?" follow-btn-sm":""}`}
//       onClick={handle}
//       disabled={busy||status==="pending"||status==="loading"}
//     >
//       {status==="none"&&<UserPlusIcon/>}
//       {status==="accepted"&&<UserCheckIcon/>}
//       {labels[status]}
//     </button>
//   );
// }

// // ── PROFILE MODAL ─────────────────────────────────────────────
// function ProfileModal({ user, meId, onClose, onChat }) {
//   const [followers,setFollowers]=useState(0);
//   const [following,setFollowing]=useState(0);
//   const [status,   setStatus]   =useState("loading");
//   useEffect(()=>{
//     Promise.all([
//       apiGetFollowers(user.id), apiGetFollowing(user.id),
//       meId&&meId!==user.id ? apiGetFollowState(meId,user.id) : Promise.resolve({status:"none"})
//     ]).then(([fr,fg,fs])=>{
//       setFollowers(fr.followers?.length||0); setFollowing(fg.following?.length||0); setStatus(fs.status||"none");
//     }).catch(()=>{});
//   },[user.id,meId]);
//   const isMutual = status==="accepted";
//   return (
//     <div className="modal-overlay" onClick={onClose}>
//       <div className="profile-modal" onClick={e=>e.stopPropagation()}>
//         <button className="modal-close" onClick={onClose}><CloseIcon/></button>
//         <div className="pm-top">
//           <Avatar url={user.avatarUrl} name={user.username} size={68}/>
//           <div>
//             <div className="pm-name">{user.username}</div>
//             <div className="pm-stats">
//               <span><strong>{followers}</strong> followers</span>
//               <span><strong>{following}</strong> following</span>
//             </div>
//           </div>
//         </div>
//         {isMutual&&user.bio
//           ? <div className="pm-bio">{user.bio}</div>
//           : isMutual
//           ? <div className="pm-bio pm-bio-empty">No bio yet.</div>
//           : meId!==user.id
//           ? <div className="pm-locked"><span>🔒</span> Follow each other to unlock full profile &amp; bio</div>
//           : null
//         }
//         <div className="pm-actions">
//           {meId!==user.id&&<>
//             <FollowBtn myId={meId} targetId={user.id}/>
//             {isMutual&&<button className="pm-msg-btn" onClick={()=>{onChat(user);onClose();}}><MsgIcon/> Message</button>}
//           </>}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── DM PANEL ─────────────────────────────────────────────────
// function DMPanel({ me, partner, onClose }) {
//   const [messages,setMessages]=useState([]);
//   const [text,    setText]    =useState("");
//   const [sending, setSending] =useState(false);
//   const [hovered, setHovered] =useState(null);
//   const bottomRef=useRef(null),inputRef=useRef(null);
//   const load=useCallback(async()=>{
//     try{const r=await apiGetMessages(me.id,partner.id);setMessages(r.messages||[]);await apiMarkRead(me.id,partner.id);}catch{}
//   },[me.id,partner.id]);
//   useEffect(()=>{load();const t=setInterval(load,5000);inputRef.current?.focus();return()=>clearInterval(t);},[load]);
//   useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[messages]);
//   async function send(e){e.preventDefault();if(!text.trim()||sending)return;setSending(true);
//     try{const r=await apiSendMessage(me.id,partner.id,text.trim());setMessages(m=>[...m,r.message]);setText("");}
//     catch(err){alert(err.message);}finally{setSending(false);}
//   }
//   async function del(id){try{await apiDeleteMessage(id,me.id);setMessages(m=>m.filter(x=>x.id!==id));}catch(err){alert(err.message);}}
//   const dateLabel=(iso)=>{const d=new Date(iso),t=new Date();if(d.toDateString()===t.toDateString())return"Today";const y=new Date(t);y.setDate(t.getDate()-1);return d.toDateString()===y.toDateString()?"Yesterday":d.toLocaleDateString(undefined,{month:"short",day:"numeric"});};
//   const grouped=[];let lastDate=null;
//   messages.forEach(m=>{const dl=dateLabel(m.createdAt);if(dl!==lastDate){grouped.push({type:"date",label:dl});lastDate=dl;}grouped.push({type:"msg",...m});});
//   return (
//     <div className="dm-panel">
//       <div className="dm-header">
//         <button className="dm-back" onClick={onClose}><BackIcon/></button>
//         <Avatar url={partner.avatarUrl} name={partner.username} size={34}/>
//         <div><div className="dm-pname">{partner.username}</div><div className="dm-psub">Direct message</div></div>
//       </div>
//       <div className="dm-messages">
//         {grouped.length===0&&<div className="dm-empty"><MsgIcon/><p>Start a conversation with {partner.username}</p></div>}
//         {grouped.map((item,idx)=>item.type==="date"
//           ? <div key={`d${idx}`} className="dm-date-sep"><span>{item.label}</span></div>
//           : <div key={item.id} className={`dm-row ${item.fromId===me.id?"dm-mine":"dm-theirs"}`}
//               onMouseEnter={()=>setHovered(item.id)} onMouseLeave={()=>setHovered(null)}>
//               {item.fromId!==me.id&&<Avatar url={partner.avatarUrl} name={partner.username} size={28}/>}
//               <div className="dm-bwrap">
//                 <div className={`dm-bubble${item.fromId===me.id?" dm-bmine":" dm-btheirs"}`}>{item.content}</div>
//                 <div className="dm-time">{timeAgo(item.createdAt)}</div>
//               </div>
//               {item.fromId===me.id&&hovered===item.id&&<button className="dm-del" onClick={()=>del(item.id)}><TrashIcon/></button>}
//             </div>
//         )}
//         <div ref={bottomRef}/>
//       </div>
//       <form className="dm-input-row" onSubmit={send}>
//         <textarea ref={inputRef} className="dm-input" placeholder={`Message ${partner.username}…`} value={text}
//           onChange={e=>setText(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send(e);}}} rows={1}/>
//         <button className="dm-send" type="submit" disabled={!text.trim()||sending}><SendIcon/></button>
//       </form>
//     </div>
//   );
// }

// // ── CONVERSATIONS SIDEBAR ─────────────────────────────────────
// function ConvSidebar({ me, onSelect, activeId, allUsers }) {
//   const [convs,setConvs]=useState([]);
//   useEffect(()=>{
//     async function load(){
//       try{const r=await apiGetConversations(me.id);
//         const en=await Promise.all((r.conversations||[]).map(async cv=>{
//           const k=allUsers.find(u=>u.id===cv.partnerId);if(k)return{...cv,partner:k};
//           try{const ur=await apiGetUser(cv.partnerId);return{...cv,partner:ur.user||{id:cv.partnerId,username:"Unknown"}};}
//           catch{return{...cv,partner:{id:cv.partnerId,username:"Unknown"}};}
//         }));setConvs(en);}catch{}
//     }
//     load();const t=setInterval(load,8000);return()=>clearInterval(t);
//   },[me.id,allUsers]);
//   return(
//     <div className="conv-sidebar">
//       <div className="conv-title">MESSAGES</div>
//       {convs.length===0&&<div className="conv-empty">No conversations yet</div>}
//       {convs.map(cv=>(
//         <button key={cv.partnerId} className={`conv-row${activeId===cv.partnerId?" active":""}`} onClick={()=>onSelect(cv.partner)}>
//           <div className="conv-av"><Avatar url={cv.partner?.avatarUrl} name={cv.partner?.username||"?"} size={42}/>{cv.unread&&<div className="conv-dot"/>}</div>
//           <div className="conv-info">
//             <div className="conv-name">{cv.partner?.username||"Unknown"}</div>
//             <div className="conv-last">{(cv.lastMsg||"").slice(0,34)}{(cv.lastMsg||"").length>34?"…":""}</div>
//           </div>
//         </button>
//       ))}
//     </div>
//   );
// }

// // ── NOTIFICATION BELL (follow requests) ───────────────────────
// function NotifBell({ me, allUsers, onDone }) {
//   const [pending,setPending]=useState([]);
//   const [open,   setOpen]   =useState(false);
//   const ref = useRef(null);

//   useEffect(()=>{
//     async function load(){
//       try{const r=await apiGetPendingReqs(me.id);
//         const en=await Promise.all((r.pending||[]).map(async p=>{
//           const k=allUsers.find(u=>u.id===p.fromId);if(k)return{...p,user:k};
//           try{const ur=await apiGetUser(p.fromId);return{...p,user:ur.user||{id:p.fromId,username:"Unknown"}};}
//           catch{return{...p,user:{id:p.fromId,username:"Unknown"}};}
//         }));setPending(en);}catch{}
//     }
//     load();const t=setInterval(load,12000);return()=>clearInterval(t);
//   },[me.id,allUsers]);

//   // close on outside click
//   useEffect(()=>{
//     function handler(e){if(ref.current&&!ref.current.contains(e.target))setOpen(false);}
//     document.addEventListener("mousedown",handler);return()=>document.removeEventListener("mousedown",handler);
//   },[]);

//   async function accept(fromId){await apiAcceptFollow(fromId,me.id);setPending(p=>p.filter(x=>x.fromId!==fromId));onDone?.();}
//   async function reject(fromId){await apiRejectFollow(fromId,me.id);setPending(p=>p.filter(x=>x.fromId!==fromId));}

//   return(
//     <div className="notif-wrap" ref={ref}>
//       <button className={`notif-bell${open?" notif-bell-open":""}`} onClick={()=>setOpen(o=>!o)}>
//         <BellIcon/>
//         {pending.length>0&&<span className="notif-badge">{pending.length}</span>}
//       </button>
//       {open&&(
//         <div className="notif-dropdown">
//           <div className="notif-title">Follow Requests {pending.length>0&&<span className="notif-count">{pending.length}</span>}</div>
//           {pending.length===0
//             ? <div className="notif-empty">No pending requests</div>
//             : pending.map(p=>(
//               <div key={p.fromId} className="notif-row">
//                 <Avatar url={p.user?.avatarUrl} name={p.user?.username||"?"} size={36}/>
//                 <div className="notif-info">
//                   <div className="notif-uname">{p.user?.username||"Unknown"}</div>
//                   <div className="notif-sub">wants to follow you</div>
//                 </div>
//                 <div className="notif-btns">
//                   <button className="notif-accept" onClick={()=>accept(p.fromId)}><CheckIcon/></button>
//                   <button className="notif-reject" onClick={()=>reject(p.fromId)}><CloseIcon/></button>
//                 </div>
//               </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// // ── TRENDING TAGS ─────────────────────────────────────────────
// function TrendingTags({ posts, onTagClick }) {
//   const counts={};
//   posts.forEach(p=>(p.hashtags||[]).forEach(t=>{counts[t]=(counts[t]||0)+1;}));
//   const sorted=Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,12);
//   if(!sorted.length) return null;
//   return(
//     <div className="cm-trending">
//       <div className="cm-slabel"><HashIcon/> TRENDING</div>
//       {sorted.map(([tag,cnt])=>(
//         <button key={tag} className="cm-trend-btn" onClick={()=>onTagClick(tag)}>
//           <span className="cm-trend-hash">#</span>{tag}
//           <span className="cm-trend-cnt">{cnt}</span>
//         </button>
//       ))}
//     </div>
//   );
// }

// // ═══════════════════════════════════════════════════════════════
// // MAIN PAGE
// // ═══════════════════════════════════════════════════════════════
// export default function Community() {
//   const [theme,setTheme]=useState(()=>localStorage.getItem("cuchco-theme")||"dark");
//   useEffect(()=>{
//     const r=theme==="system"?(window.matchMedia("(prefers-color-scheme:light)").matches?"light":"dark"):theme;
//     document.documentElement.setAttribute("data-theme",r);localStorage.setItem("cuchco-theme",theme);
//   },[theme]);

//   const [me,        setMe]        =useState(()=>loadSession());
//   const [allUsers,  setAllUsers]  =useState([]);
//   const [posts,     setPosts]     =useState([]);
//   const [loading,   setLoading]   =useState(false);
//   const [error,     setError]     =useState("");

//   // Auth
//   const [authMode,setAuthMode]=useState("login");
//   const [authForm,setAuthForm]=useState({username:"",email:"",password:""});
//   const [authErr, setAuthErr] =useState("");

//   // Create post
//   const [postContent,       setPostContent]       =useState("");
//   const [postImages,        setPostImages]        =useState([]);
//   const [postImagePreviews, setPostImagePreviews] =useState([]);
//   const [postVideoUrl,      setPostVideoUrl]      =useState("");
//   const [showVideoInput,    setShowVideoInput]    =useState(false);
//   const [postHashtags,      setPostHashtags]      =useState([]);
//   const [hashtagInput,      setHashtagInput]      =useState("");
//   const [posting,           setPosting]           =useState(false);
//   const fileInputRef=useRef(null);

//   // Search + filter
//   const [searchQuery,setSearchQuery]=useState("");
//   const [activeTag,  setActiveTag]  =useState("");

//   // Comments
//   const [openComments,setOpenComments]=useState({});
//   const [commentText, setCommentText] =useState({});
//   const [comments,    setComments]    =useState({});

//   // Profile + DM
//   const [profileUser,setProfileUser]=useState(null);
//   const [liked,      setLiked]      =useState({});
//   const [dmView,     setDmView]     =useState(false);
//   const [chatPartner,setChatPartner]=useState(null);

//   useEffect(()=>{loadPosts();loadAllUsers();},[]);// eslint-disable-line

//   async function loadPosts(){setLoading(true);try{const r=await apiGetPosts();setPosts(r.posts||[]);}catch(e){setError(e.message);}finally{setLoading(false);}}
//   async function loadAllUsers(){try{const r=await apiGetAllUsers();setAllUsers(r.users||[]);}catch{}}

//   // AUTH
//   async function handleAuth(e){
//     e.preventDefault();setAuthErr("");
//     try{
//       let r;
//       if(authMode==="register") r=await apiRegister(authForm.username,authForm.email,authForm.password);
//       else r=await apiLogin(authForm.email,authForm.password);
//       saveSession(r.user);setMe(r.user);
//       setAuthForm({username:"",email:"",password:""});
//     }catch(e){setAuthErr(e.message);}
//   }

//   // IMAGES
//   function handleImagePick(e){
//     const files=Array.from(e.target.files||[]).slice(0,6);
//     const merged=[...postImages,...files].slice(0,6);
//     setPostImages(merged);
//     Promise.all(merged.map(f=>new Promise(res=>{const r=new FileReader();r.onload=ev=>res(ev.target.result);r.readAsDataURL(f);}))).then(setPostImagePreviews);
//     e.target.value="";
//   }
//   function removeImage(idx){
//     const ni=[...postImages];ni.splice(idx,1);setPostImages(ni);
//     const np=[...postImagePreviews];np.splice(idx,1);setPostImagePreviews(np);
//   }

//   // HASHTAGS
//   function addHashtag(raw){
//     const tag=raw.replace(/^#+/,"").trim().toLowerCase().replace(/\s+/g,"_");
//     if(!tag)return;if(!postHashtags.includes(tag))setPostHashtags(h=>[...h,tag]);setHashtagInput("");
//   }
//   function removeHashtag(tag){setPostHashtags(h=>h.filter(x=>x!==tag));}
//   function handleHashtagKey(e){if(e.key==="Enter"||e.key===" "||e.key===","){e.preventDefault();addHashtag(hashtagInput);}}

//   // SUBMIT POST
//   async function handlePost(){
//     if(!postContent.trim()&&postImages.length===0&&!postVideoUrl.trim())return;
//     setPosting(true);
//     try{
//       let urls=[];
//       for(const f of postImages){try{urls.push(await uploadImage(f));}catch{}}
//       const inlineTags=(postContent.match(/#(\w+)/g)||[]).map(t=>t.slice(1).toLowerCase());
//       const allTags=[...new Set([...postHashtags,...inlineTags])];
//       const type = postVideoUrl.trim() ? "video" : urls.length>0 ? "image" : "text";
//       const r=await apiCreatePost(me.id,me.username,me.avatarUrl||"",type,postContent,urls,allTags,postVideoUrl.trim());
//       setPosts(p=>[r.post,...p]);
//       setPostContent("");setPostImages([]);setPostImagePreviews([]);setPostHashtags([]);setHashtagInput("");setPostVideoUrl("");setShowVideoInput(false);
//     }catch(e){alert(e.message);}finally{setPosting(false);}
//   }

//   async function handleLike(postId){
//     if(!me)return;
//     try{const r=await apiToggleLike(postId,me.id);setLiked(l=>({...l,[postId]:r.liked}));setPosts(p=>p.map(x=>x.id===postId?{...x,likes:r.likes}:x));}catch{}
//   }
//   async function handleDelete(postId){
//     if(!me||!window.confirm("Delete this post?"))return;
//     try{await apiDeletePost(postId,me.id);setPosts(p=>p.filter(x=>x.id!==postId));}catch(e){alert(e.message);}
//   }

//   async function loadComments(postId){try{const r=await apiGetComments(postId);setComments(c=>({...c,[postId]:r.comments}));}catch{}}
//   function toggleComments(postId){setOpenComments(o=>{const n={...o,[postId]:!o[postId]};if(n[postId])loadComments(postId);return n;});}
//   async function submitComment(postId){
//     const text=commentText[postId];if(!text?.trim()||!me)return;
//     try{const r=await apiAddComment(postId,"",me.id,me.username,me.avatarUrl||"",text);setComments(c=>({...c,[postId]:[...(c[postId]||[]),r.comment]}));setCommentText(t=>({...t,[postId]:""}));}
//     catch(e){alert(e.message);}
//   }
//   async function deleteComment(postId,cid){
//     try{await apiDeleteComment(cid,me.id);setComments(c=>({...c,[postId]:c[postId].filter(x=>x.id!==cid)}));}catch(e){alert(e.message);}
//   }

//   function openProfile(user){if(user.id===me?.id)return;apiGetUser(user.id).then(r=>setProfileUser(r.user||user)).catch(()=>setProfileUser(user));}
//   function openChat(partner){setChatPartner(partner);setDmView(true);}

//   // FILTER
//   const filteredPosts=posts.filter(p=>{
//     const q=searchQuery.trim().toLowerCase(),tag=activeTag.toLowerCase();
//     const matchTag=!tag||(p.hashtags||[]).map(t=>t.toLowerCase()).includes(tag);
//     if(!matchTag)return false;
//     if(!q)return true;
//     return p.content?.toLowerCase().includes(q)||p.username?.toLowerCase().includes(q)||(p.hashtags||[]).some(t=>t.toLowerCase().includes(q));
//   });

//   // ── AUTH WALL ──────────────────────────────────────────────
//   if(!me) return(
//     <div className="cm-page cm-auth-page">
//       <nav className="cm-nav">
//         <a href="/" className="cm-nav-logo">CUCHCO</a>
//         <div className="cm-nav-gap"/>
//         <div className="cm-theme-toggle">
//           <button className={`cm-t-btn${theme==="light"?" on":""}`} onClick={()=>setTheme("light")}><SunIcon/></button>
//           <button className={`cm-t-btn${theme==="system"?" on":""}`} onClick={()=>setTheme("system")}><MonitorIcon/></button>
//           <button className={`cm-t-btn${theme==="dark"?" on":""}`} onClick={()=>setTheme("dark")}><MoonIcon/></button>
//         </div>
//       </nav>
//       <div className="cm-auth-box">
//         <div className="cm-auth-logo">CUCHCO</div>
//         <div className="cm-auth-title">{authMode==="login"?"Welcome back":"Join Cuchco"}</div>
//         <form className="cm-auth-form" onSubmit={handleAuth}>
//           {authMode==="register"&&<input className="cm-input" placeholder="Username" value={authForm.username} onChange={e=>setAuthForm(f=>({...f,username:e.target.value}))} required/>}
//           <input className="cm-input" type="email" placeholder="Email" value={authForm.email} onChange={e=>setAuthForm(f=>({...f,email:e.target.value}))} required/>
//           <input className="cm-input" type="password" placeholder="Password" value={authForm.password} onChange={e=>setAuthForm(f=>({...f,password:e.target.value}))} required/>
//           {authErr&&<div className="cm-auth-err">{authErr}</div>}
//           <button className="cm-auth-btn" type="submit">{authMode==="login"?"Sign In":"Create Account"}</button>
//         </form>
//         <div className="cm-auth-switch">{authMode==="login"?"No account?":"Already have one?"}
//           <button onClick={()=>setAuthMode(m=>m==="login"?"register":"login")}>{authMode==="login"?"Register":"Login"}</button>
//         </div>
//       </div>
//     </div>
//   );

//   // ── DM VIEW ──────────────────────────────────────────────
//   if(dmView&&chatPartner) return(
//     <div className="cm-page">
//       <nav className="cm-nav">
//         <a href="/" className="cm-nav-logo">CUCHCO</a>
//         <span className="cm-nav-sep">/</span>
//         <span className="cm-nav-sub">MESSAGES</span>
//         <div className="cm-nav-gap"/>
//         <button className="cm-nav-pill" onClick={()=>setDmView(false)}>← Feed</button>
//         <div className="cm-theme-toggle">
//           <button className={`cm-t-btn${theme==="light"?" on":""}`} onClick={()=>setTheme("light")}><SunIcon/></button>
//           <button className={`cm-t-btn${theme==="system"?" on":""}`} onClick={()=>setTheme("system")}><MonitorIcon/></button>
//           <button className={`cm-t-btn${theme==="dark"?" on":""}`} onClick={()=>setTheme("dark")}><MoonIcon/></button>
//         </div>
//       </nav>
//       <div className="dm-layout">
//         <ConvSidebar me={me} onSelect={setChatPartner} activeId={chatPartner.id} allUsers={allUsers}/>
//         <DMPanel me={me} partner={chatPartner} onClose={()=>setDmView(false)}/>
//       </div>
//     </div>
//   );

//   // ── MAIN FEED ─────────────────────────────────────────────
//   return(
//     <div className="cm-page">

//       {/* ── NAV ── */}
//       <nav className="cm-nav">
//         {/* LEFT: logo + home + community label */}
//         <div className="cm-nav-left">
//           <a href="/" className="cm-nav-logo">CUCHCO</a>
//           <a href="/" className="cm-nav-home-btn" title="Home"><HomeIcon/></a>
//           <span className="cm-nav-sep">/</span>
//           <span className="cm-nav-sub">COMMUNITY</span>
//         </div>

//         {/* CENTER: search bar */}
//         <div className="cm-nav-center">
//           <div className="cm-search-wrap">
//             <SearchIcon/>
//             <input
//               className="cm-search-input"
//               placeholder="Search posts, #tags, people…"
//               value={searchQuery}
//               onChange={e=>{setSearchQuery(e.target.value);setActiveTag("");}}
//             />
//             {searchQuery&&<button className="cm-search-clear" onClick={()=>setSearchQuery("")}><XIcon/></button>}
//           </div>
//         </div>

//         {/* RIGHT: notifications + messages + theme + user */}
//         <div className="cm-nav-right">
//           <NotifBell me={me} allUsers={allUsers} onDone={loadAllUsers}/>
//           <button className="cm-nav-pill" onClick={()=>setDmView(true)}><MsgIcon/><span>Messages</span></button>
//           <div className="cm-theme-toggle">
//             <button className={`cm-t-btn${theme==="light"?" on":""}`} onClick={()=>setTheme("light")}><SunIcon/></button>
//             <button className={`cm-t-btn${theme==="system"?" on":""}`} onClick={()=>setTheme("system")}><MonitorIcon/></button>
//             <button className={`cm-t-btn${theme==="dark"?" on":""}`} onClick={()=>setTheme("dark")}><MoonIcon/></button>
//           </div>
//           <button className="cm-nav-user" onClick={()=>{clearSession();setMe(null);}}>
//             <Avatar url={me.avatarUrl} name={me.username} size={30}/>
//             <span>{me.username}</span>
//           </button>
//         </div>
//       </nav>

//       {/* ── BODY ── */}
//       <div className="cm-body">

//         {/* LEFT SIDEBAR */}
//         <aside className="cm-sidebar-left">
//           <div className="cm-slabel">PEOPLE</div>
//           {allUsers.filter(u=>u.id!==me.id).slice(0,20).map(u=>(
//             <div key={u.id} className="cm-people-row">
//               <button className="cm-pav-btn" onClick={()=>openProfile(u)}>
//                 <Avatar url={u.avatarUrl} name={u.username} size={36}/>
//               </button>
//               <button className="cm-pname-btn" onClick={()=>openProfile(u)}>{u.username}</button>
//               <FollowBtn myId={me.id} targetId={u.id} compact/>
//             </div>
//           ))}
//         </aside>

//         {/* FEED */}
//         <main className="cm-feed">

//           {/* Active filter */}
//           {(activeTag||searchQuery)&&(
//             <div className="cm-filter-bar">
//               {activeTag&&<><HashIcon/><strong>#{activeTag}</strong></>}
//               {searchQuery&&!activeTag&&<><SearchIcon/><strong>"{searchQuery}"</strong></>}
//               <span className="cm-filter-cnt">{filteredPosts.length} post{filteredPosts.length!==1?"s":""}</span>
//               <button className="cm-filter-x" onClick={()=>{setActiveTag("");setSearchQuery("");}}>Clear <XIcon/></button>
//             </div>
//           )}

//           {/* CREATE POST */}
//           <div className="cm-create">
//             <Avatar url={me.avatarUrl} name={me.username} size={42}/>
//             <div className="cm-create-body">
//               <textarea
//                 className="cm-create-ta"
//                 placeholder="Share a solve, tip, video… use #tags inline"
//                 value={postContent}
//                 onChange={e=>setPostContent(e.target.value)}
//                 rows={3}
//               />

//               {/* Image previews */}
//               {postImagePreviews.length>0&&(
//                 <div className="cm-prev-row">
//                   {postImagePreviews.map((src,i)=>(
//                     <div key={i} className="cm-prev-item">
//                       <img src={src} alt="preview"/>
//                       <button className="cm-prev-x" onClick={()=>removeImage(i)}><XIcon/></button>
//                     </div>
//                   ))}
//                   {postImages.length<6&&<button className="cm-prev-add" onClick={()=>fileInputRef.current?.click()}><PlusIcon/></button>}
//                 </div>
//               )}

//               {/* Video URL input */}
//               {showVideoInput&&(
//                 <div className="cm-video-input-wrap">
//                   <VideoIcon/>
//                   <input
//                     className="cm-video-input"
//                     placeholder="Paste YouTube link or direct video URL…"
//                     value={postVideoUrl}
//                     onChange={e=>setPostVideoUrl(e.target.value)}
//                   />
//                   {postVideoUrl&&<button className="cm-video-clear" onClick={()=>setPostVideoUrl("")}><XIcon/></button>}
//                 </div>
//               )}

//               {/* Hashtag section */}
//               <div className="cm-ht-section">
//                 <div className="cm-ht-label"><HashIcon/> Hashtags <span className="cm-ht-opt">(optional)</span></div>
//                 <div className="cm-ht-row">
//                   {postHashtags.map(tag=>(
//                     <span key={tag} className="cm-ht-chip">#{tag}<button onClick={()=>removeHashtag(tag)}><XIcon/></button></span>
//                   ))}
//                   <input
//                     className="cm-ht-input"
//                     placeholder="Type + Enter…"
//                     value={hashtagInput}
//                     onChange={e=>setHashtagInput(e.target.value.replace(/[^a-zA-Z0-9_]/g,""))}
//                     onKeyDown={handleHashtagKey}
//                     onBlur={()=>{if(hashtagInput.trim())addHashtag(hashtagInput);}}
//                   />
//                 </div>
//               </div>

//               {/* Footer */}
//               <div className="cm-create-footer">
//                 <input ref={fileInputRef} type="file" accept="image/*" multiple style={{display:"none"}} onChange={handleImagePick}/>
//                 <button className="cm-create-tool" onClick={()=>fileInputRef.current?.click()}>
//                   <ImageIcon/>{postImages.length>0?` ${postImages.length} img`:""}
//                 </button>
//                 <button className={`cm-create-tool${showVideoInput?" cm-tool-on":""}`} onClick={()=>setShowVideoInput(v=>!v)}>
//                   <VideoIcon/> Video
//                 </button>
//                 <span className="cm-char">{postContent.length}/500</span>
//                 <button className="cm-post-btn" onClick={handlePost}
//                   disabled={(!postContent.trim()&&postImages.length===0&&!postVideoUrl.trim())||posting}>
//                   {posting?"Posting…":"Post"}
//                 </button>
//               </div>
//             </div>
//           </div>

//           {error&&<div className="cm-error">{error}</div>}
//           {loading&&<div className="cm-loading">Loading…</div>}
//           {!loading&&filteredPosts.length===0&&(searchQuery||activeTag)&&(
//             <div className="cm-no-results"><HashIcon/><p>No posts match {activeTag?`#${activeTag}`:`"${searchQuery}"`}</p></div>
//           )}

//           {/* POSTS */}
//           {filteredPosts.map(post=>(
//             <div key={post.id} className="cm-post">
//               {/* Header */}
//               <div className="cm-post-hd">
//                 <button className="cm-post-av" onClick={()=>openProfile({id:post.userId,username:post.username,avatarUrl:post.avatarUrl})}>
//                   <Avatar url={post.avatarUrl} name={post.username} size={42}/>
//                 </button>
//                 <div className="cm-post-meta">
//                   <button className="cm-post-uname" onClick={()=>openProfile({id:post.userId,username:post.username,avatarUrl:post.avatarUrl})}>{post.username}</button>
//                   <div className="cm-post-time">{timeAgo(post.createdAt)}</div>
//                 </div>
//                 <div className="cm-post-hd-right">
//                   <FollowBtn myId={me.id} targetId={post.userId} compact/>
//                   {post.userId===me.id&&<button className="cm-del-btn" onClick={()=>handleDelete(post.id)}><TrashIcon/></button>}
//                 </div>
//               </div>

//               {/* Content */}
//               {post.content&&(
//                 <div className="cm-post-content">
//                   <RichText text={post.content} onTagClick={tag=>{setActiveTag(tag);setSearchQuery("");}}/>
//                 </div>
//               )}

//               {/* Media */}
//               <ImageGallery images={post.images||[]}/>
//               {post.videoUrl&&<VideoPlayer url={post.videoUrl}/>}

//               {/* Hashtag chips */}
//               {(post.hashtags||[]).length>0&&(
//                 <div className="cm-post-tags">
//                   {(post.hashtags||[]).map(tag=>(
//                     <button key={tag} className="cm-post-tag" onClick={()=>{setActiveTag(tag);setSearchQuery("");}}>#{tag}</button>
//                   ))}
//                 </div>
//               )}

//               {/* Actions */}
//               <div className="cm-post-actions">
//                 <button className={`cm-act-btn${liked[post.id]?" cm-liked":""}`} onClick={()=>handleLike(post.id)}>
//                   <HeartIcon filled={!!liked[post.id]}/><span>{post.likes||0}</span>
//                 </button>
//                 <button className="cm-act-btn" onClick={()=>toggleComments(post.id)}>
//                   <CommentIcon/><span>{(comments[post.id]||[]).length||""}</span>
//                 </button>
//                 <ShareBtn post={post}/>
//               </div>

//               {/* Comments */}
//               {openComments[post.id]&&(
//                 <div className="cm-comments">
//                   {(comments[post.id]||[]).map(c=>(
//                     <div key={c.id} className="cm-comment">
//                       <Avatar url={c.avatarUrl} name={c.username} size={28}/>
//                       <div className="cm-cmt-body">
//                         <span className="cm-cmt-user">{c.username}</span>
//                         <span className="cm-cmt-text"> {c.content}</span>
//                         <span className="cm-cmt-time">{timeAgo(c.createdAt)}</span>
//                       </div>
//                       {c.userId===me.id&&<button className="cm-cmt-del" onClick={()=>deleteComment(post.id,c.id)}><TrashIcon/></button>}
//                     </div>
//                   ))}
//                   <div className="cm-cmt-input-row">
//                     <Avatar url={me.avatarUrl} name={me.username} size={28}/>
//                     <input className="cm-cmt-input" placeholder="Add a comment…"
//                       value={commentText[post.id]||""}
//                       onChange={e=>setCommentText(t=>({...t,[post.id]:e.target.value}))}
//                       onKeyDown={e=>e.key==="Enter"&&submitComment(post.id)}/>
//                     <button className="cm-cmt-send" onClick={()=>submitComment(post.id)}><SendIcon/></button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))}
//         </main>

//         {/* RIGHT SIDEBAR */}
//         <aside className="cm-sidebar-right">
//           <TrendingTags posts={posts} onTagClick={tag=>{setActiveTag(tag);setSearchQuery("");}}/>
//           <div className="cm-slabel" style={{marginTop:20}}>SUGGESTED</div>
//           {allUsers.filter(u=>u.id!==me.id).slice(0,8).map(u=>(
//             <div key={u.id} className="cm-sugg-row">
//               <button className="cm-sugg-av" onClick={()=>openProfile(u)}>
//                 <Avatar url={u.avatarUrl} name={u.username} size={32}/>
//                 <div className="cm-online-dot"/>
//               </button>
//               <button className="cm-sugg-name" onClick={()=>openProfile(u)}>{u.username}</button>
//             </div>
//           ))}
//         </aside>
//       </div>

//       {profileUser&&(
//         <ProfileModal user={profileUser} meId={me.id} onClose={()=>setProfileUser(null)} onChat={openChat}/>
//       )}
//     </div>
//   );
// }

// eslint-disable-next-line
// import { useState, useEffect, useRef, useCallback } from "react";
// import "./Community.css";
// import {
//   apiRegister, apiLogin, apiGetUser, apiGetAllUsers,
//   apiCreatePost, apiGetPosts, apiDeletePost, apiEditPost, apiToggleLike,
//   apiAddComment, apiGetComments, apiDeleteComment, apiEditComment,
//   apiSendFollowReq, apiAcceptFollow, apiRejectFollow, apiUnfollow,
//   apiGetFollowState, apiGetFollowers, apiGetFollowing, apiGetPendingReqs,
//   apiSendMessage, apiGetMessages, apiDeleteMessage, apiGetConversations, apiMarkRead,
//   uploadImage, saveSession, loadSession, clearSession, timeAgo,
// } from "../../sheetsApi";

// /* ── ICONS ── */
// const HeartIcon     = ({f}) => <svg width="16" height="16" viewBox="0 0 24 24" fill={f?"currentColor":"none"} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>;
// const CmtIcon       = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>;
// const SendIcon      = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22,2 15,22 11,13 2,9"/></svg>;
// const TrashIcon     = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3,6 5,6 21,6"/><path d="M19,6v14a2,2,0,01-2,2H7a2,2,0,01-2-2V6m3,0V4a2,2,0,012-2h4a2,2,0,012,2v2"/></svg>;
// const EditIcon      = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
// const ImgIcon       = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg>;
// const VideoIcon     = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23,7 16,12 23,17"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>;
// const LinkIcon      = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>;
// const MsgIcon       = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>;
// const CheckIcon     = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>;
// const XIcon         = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
// const BellIcon      = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>;
// const SearchIcon    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
// const HashIcon      = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>;
// const BackIcon      = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>;
// const DotsIcon      = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>;
// const FlagIcon      = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>;
// const UserPlusIcon  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>;
// const UserCheckIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>;
// const SunIcon       = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>;
// const MoonIcon      = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>;
// const MonIcon       = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>;
// const PlusIcon      = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
// const PlayIcon      = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>;
// const HomeIcon      = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>;
// const ReplyIcon     = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 00-4-4H4"/></svg>;

// /* ── AVATAR ── */
// function Avatar({ url, name, size = 36 }) {
//   const i = (name||"?").split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2);
//   const c = ["#FF5733","#FFD100","#B882FF","#00C4D4","#4ade80","#f59e0b","#3b82f6"][(name||"").charCodeAt(0)%7];
//   if (url) return <img src={url} alt={name} className="cm-av" style={{width:size,height:size}} onError={e=>{e.target.style.display="none";}}/>;
//   return <div className="cm-av cm-av-txt" style={{width:size,height:size,background:c,fontSize:size*.38}}>{i}</div>;
// }

// /* ── RICH TEXT (clickable #tags) ── */
// function RichText({ text, onTag }) {
//   if (!text) return null;
//   return <span>{text.split(/(#\w+)/g).map((p,i)=>p.startsWith("#")?<button key={i} className="cm-htag" onClick={()=>onTag(p.slice(1))}>{p}</button>:p)}</span>;
// }

// /* ── MULTI-IMAGE GALLERY ── */
// function Gallery({ images }) {
//   const [cur,setCur]=useState(0);
//   if (!images?.length) return null;
//   if (images.length===1) return <div className="cm-media"><img src={images[0]} alt="" className="cm-media-img" onError={e=>{e.target.style.display="none";}}/></div>;
//   return (
//     <div className="cm-gallery">
//       <img src={images[cur]} alt="" className="cm-gallery-img" onError={e=>{e.target.style.display="none";}}/>
//       <button className="cm-garr left" onClick={()=>setCur(c=>(c-1+images.length)%images.length)}>‹</button>
//       <button className="cm-garr right" onClick={()=>setCur(c=>(c+1)%images.length)}>›</button>
//       <div className="cm-gdots">{images.map((_,i)=><span key={i} className={`cm-gdot${i===cur?" on":""}`} onClick={()=>setCur(i)}/>)}</div>
//       <div className="cm-gcnt">{cur+1}/{images.length}</div>
//     </div>
//   );
// }

// /* ── VIDEO PLAYER ── */
// function VideoPlayer({ url }) {
//   const [play,setPlay]=useState(false); const vr=useRef(null);
//   if (!url) return null;
//   const yt=url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
//   if (yt) return <div className="cm-media cm-vid"><iframe src={`https://www.youtube.com/embed/${yt[1]}`} title="yt" frameBorder="0" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowFullScreen className="cm-media-img"/></div>;
//   return (
//     <div className="cm-media cm-vid" onClick={()=>{play?vr.current?.pause():vr.current?.play();setPlay(p=>!p);}}>
//       <video ref={vr} src={url} className="cm-media-img" onEnded={()=>setPlay(false)} preload="metadata"/>
//       {!play&&<div className="cm-play"><PlayIcon/></div>}
//     </div>
//   );
// }

// /* ── SHARE BTN ── */
// function ShareBtn({ post }) {
//   const [c,setC]=useState(false);
//   const url=post.shareUrl||`${window.location.origin}/post/${post.id}`;
//   return <button className={`cm-act-btn${c?" cm-copied":""}`} onClick={()=>{navigator.clipboard?.writeText(url);setC(true);setTimeout(()=>setC(false),2000);}}><LinkIcon/><span>{c?"Copied!":"Share"}</span></button>;
// }

// /* ── FOLLOW BUTTON ── */
// function FollowBtn({ myId, targetId, sm }) {
//   const [st,setSt]=useState("loading"); const [busy,setBusy]=useState(false);
//   useEffect(()=>{
//     if (!myId||!targetId||myId===targetId) return;
//     apiGetFollowState(myId,targetId).then(r=>setSt(r.status||"none")).catch(()=>setSt("none"));
//   },[myId,targetId]);
//   if (!myId||myId===targetId) return null;
//   async function go(){ setBusy(true); try{ if(st==="none"){await apiSendFollowReq(myId,targetId);setSt("pending");} else if(st==="accepted"){await apiUnfollow(myId,targetId);setSt("none");} }catch(e){alert(e.message);}finally{setBusy(false);} }
//   const lbl={loading:"…",none:"Follow",pending:"Requested",accepted:"Following"};
//   return <button className={`follow-btn follow-${st}${sm?" follow-sm":""}`} onClick={go} disabled={busy||st==="pending"||st==="loading"}>{st==="none"&&<UserPlusIcon/>}{st==="accepted"&&<UserCheckIcon/>}{lbl[st]}</button>;
// }

// /* ── THREE-DOT MENU ── */
// function DotsMenu({ items }) {
//   const [open,setOpen]=useState(false); const ref=useRef(null);
//   useEffect(()=>{ function h(e){if(ref.current&&!ref.current.contains(e.target))setOpen(false);} document.addEventListener("mousedown",h); return()=>document.removeEventListener("mousedown",h); },[]);
//   return (
//     <div className="dots-wrap" ref={ref}>
//       <button className="dots-btn" onClick={()=>setOpen(o=>!o)}><DotsIcon/></button>
//       {open&&<div className="dots-menu">{items.map((it,i)=><button key={i} className={`dots-item${it.danger?" dots-danger":""}`} onClick={()=>{it.onClick();setOpen(false);}}>{it.icon&&<span className="dots-icon">{it.icon}</span>}{it.label}</button>)}</div>}
//     </div>
//   );
// }

// /* ── USER POPUP (on avatar click) ── */
// function UserPopup({ user, meId, anchorRef, onClose, onChat, onReport }) {
//   const [fl,setFl]=useState(0); const [fg,setFg]=useState(0); const [st,setSt]=useState("loading");
//   const ref=useRef(null);
//   useEffect(()=>{
//     Promise.all([apiGetFollowers(user.id),apiGetFollowing(user.id),meId&&meId!==user.id?apiGetFollowState(meId,user.id):Promise.resolve({status:"none"})]).then(([fr,fg,fs])=>{setFl(fr.followers?.length||0);setFg(fg.following?.length||0);setSt(fs.status||"none");}).catch(()=>{});
//     function h(e){if(ref.current&&!ref.current.contains(e.target)&&anchorRef.current&&!anchorRef.current.contains(e.target))onClose();} document.addEventListener("mousedown",h); return()=>document.removeEventListener("mousedown",h);
//   },[user.id,meId,anchorRef,onClose]);
//   const isMutual=st==="accepted";
//   return (
//     <div className="upopup" ref={ref}>
//       <div className="upopup-top">
//         <Avatar url={user.avatarUrl} name={user.username} size={52}/>
//         <div>
//           <div className="upopup-name">{user.username}</div>
//           <div className="upopup-stats"><span><b>{fl}</b> followers</span><span><b>{fg}</b> following</span></div>
//         </div>
//       </div>
//       {isMutual&&user.bio&&<div className="upopup-bio">{user.bio}</div>}
//       {!isMutual&&meId!==user.id&&<div className="upopup-lock">🔒 Follow each other to see bio</div>}
//       <div className="upopup-actions">
//         {meId!==user.id&&<><FollowBtn myId={meId} targetId={user.id} sm/>{isMutual&&<button className="upopup-msg" onClick={()=>{onChat(user);onClose();}}><MsgIcon/> Message</button>}</>}
//         {meId!==user.id&&<button className="upopup-report" onClick={()=>{onReport(user);onClose();}}><FlagIcon/> Report</button>}
//       </div>
//     </div>
//   );
// }

// /* ── NOTIFICATION BELL ── */
// function NotifBell({ me, allUsers, onDone }) {
//   const [pd,setPd]=useState([]); const [open,setOpen]=useState(false); const ref=useRef(null);
//   useEffect(()=>{
//     async function load(){try{const r=await apiGetPendingReqs(me.id);const en=await Promise.all((r.pending||[]).map(async p=>{const k=allUsers.find(u=>u.id===p.fromId);if(k)return{...p,user:k};try{const ur=await apiGetUser(p.fromId);return{...p,user:ur.user||{id:p.fromId,username:"?"}};}catch{return{...p,user:{id:p.fromId,username:"?"}};}}) );setPd(en);}catch{}}
//     load();const t=setInterval(load,15000);return()=>clearInterval(t);
//   },[me.id,allUsers]);
//   useEffect(()=>{ function h(e){if(ref.current&&!ref.current.contains(e.target))setOpen(false);} document.addEventListener("mousedown",h);return()=>document.removeEventListener("mousedown",h); },[]);
//   async function accept(fid){await apiAcceptFollow(fid,me.id);setPd(p=>p.filter(x=>x.fromId!==fid));onDone?.();}
//   async function reject(fid){await apiRejectFollow(fid,me.id);setPd(p=>p.filter(x=>x.fromId!==fid));}
//   return (
//     <div className="notif-wrap" ref={ref}>
//       <button className={`notif-bell${open?" open":""}`} onClick={()=>setOpen(o=>!o)}><BellIcon/>{pd.length>0&&<span className="notif-badge">{pd.length}</span>}</button>
//       {open&&<div className="notif-drop">
//         <div className="notif-ttl">Follow Requests {pd.length>0&&<span className="notif-cnt">{pd.length}</span>}</div>
//         {pd.length===0&&<div className="notif-empty">No pending requests</div>}
//         {pd.map(p=>(
//           <div key={p.fromId} className="notif-row">
//             <Avatar url={p.user?.avatarUrl} name={p.user?.username||"?"} size={34}/>
//             <div className="notif-info"><div className="notif-un">{p.user?.username||"?"}</div><div className="notif-sub">wants to follow you</div></div>
//             <div className="notif-btns">
//               <button className="notif-ok" onClick={()=>accept(p.fromId)}><CheckIcon/></button>
//               <button className="notif-no" onClick={()=>reject(p.fromId)}><XIcon/></button>
//             </div>
//           </div>
//         ))}
//       </div>}
//     </div>
//   );
// }

// /* ── NESTED COMMENTS ── */
// function CommentTree({ comments, postId, me, depth=0 }) {
//   const [replyTo, setReplyTo]=useState(null);
//   const [replyText, setReplyText]=useState("");
//   const [editId, setEditId]=useState(null);
//   const [editText, setEditText]=useState("");
//   const [localCmts, setLocalCmts]=useState(comments);

//   useEffect(()=>setLocalCmts(comments),[comments]);

//   // top-level or children
//   const mine = localCmts.filter(c=>c.parentId===(depth===0?"":undefined)||c.parentId==="");
//   const roots = depth===0 ? localCmts.filter(c=>!c.parentId||c.parentId==="") : localCmts;
//   const children = (parentId)=>localCmts.filter(c=>c.parentId===parentId);

//   async function submitReply(parentId){
//     if(!replyText.trim()) return;
//     try{const r=await apiAddComment(postId,parentId,me.id,me.username,me.avatarUrl||"",replyText);setLocalCmts(prev=>[...prev,r.comment]);setReplyTo(null);setReplyText("");}catch(e){alert(e.message);}
//   }
//   async function delCmt(id){try{await apiDeleteComment(id,me.id);setLocalCmts(prev=>prev.filter(c=>c.id!==id));}catch(e){alert(e.message);}}
//   async function saveEdit(id){try{await apiEditComment(id,me.id,editText);setLocalCmts(prev=>prev.map(c=>c.id===id?{...c,content:editText}:c));setEditId(null);}catch(e){alert(e.message);}}

//   function CmtNode({c, lvl}){
//     const kids=children(c.id);
//     return (
//       <div className={`cmt-node${lvl>0?" cmt-reply":""}`}>
//         <div className="cmt-row">
//           <Avatar url={c.avatarUrl} name={c.username} size={28}/>
//           <div className="cmt-body">
//             {editId===c.id
//               ? <div className="cmt-edit-row">
//                   <input className="cmt-edit-inp" value={editText} onChange={e=>setEditText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&saveEdit(c.id)} autoFocus/>
//                   <button className="cmt-edit-ok" onClick={()=>saveEdit(c.id)}><CheckIcon/></button>
//                   <button className="cmt-edit-x" onClick={()=>setEditId(null)}><XIcon/></button>
//                 </div>
//               : <><span className="cmt-user">{c.username}</span><span className="cmt-text"> {c.content}</span></>
//             }
//             <div className="cmt-meta">
//               <span className="cmt-time">{timeAgo(c.createdAt)}</span>
//               {lvl<2&&<button className="cmt-reply-btn" onClick={()=>{setReplyTo(replyTo===c.id?null:c.id);setReplyText("")}}><ReplyIcon/> Reply</button>}
//             </div>
//             {replyTo===c.id&&(
//               <div className="cmt-reply-input">
//                 <Avatar url={me.avatarUrl} name={me.username} size={22}/>
//                 <input className="cmt-inp" placeholder={`Reply to ${c.username}…`} value={replyText} onChange={e=>setReplyText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submitReply(c.id)} autoFocus/>
//                 <button className="cmt-send" onClick={()=>submitReply(c.id)}><SendIcon/></button>
//               </div>
//             )}
//           </div>
//           {c.userId===me.id&&(
//             <DotsMenu items={[
//               {icon:<EditIcon/>,  label:"Edit",   onClick:()=>{setEditId(c.id);setEditText(c.content);}},
//               {icon:<TrashIcon/>, label:"Delete", danger:true, onClick:()=>delCmt(c.id)},
//             ]}/>
//           )}
//         </div>
//         {kids.length>0&&<div className="cmt-children">{kids.map(k=><CmtNode key={k.id} c={k} lvl={lvl+1}/>)}</div>}
//       </div>
//     );
//   }

//   return <div className="cmt-tree">{roots.map(c=><CmtNode key={c.id} c={c} lvl={0}/>)}</div>;
// }

// /* ── TRENDING TAGS ── */
// function Trending({ posts, onTag }) {
//   const cnt={};
//   posts.forEach(p=>(p.hashtags||[]).forEach(t=>{cnt[t]=(cnt[t]||0)+1;}));
//   const sorted=Object.entries(cnt).sort((a,b)=>b[1]-a[1]).slice(0,12);
//   if(!sorted.length) return null;
//   return <div className="cm-trending"><div className="cm-slabel"><HashIcon/> TRENDING</div>{sorted.map(([t,n])=><button key={t} className="cm-trend" onClick={()=>onTag(t)}><span className="cm-th">#</span>{t}<span className="cm-tn">{n}</span></button>)}</div>;
// }

// /* ── DM PANEL ── */
// function DMPanel({ me, partner, onClose }) {
//   const [msgs,setMsgs]=useState([]); const [txt,setTxt]=useState(""); const [sending,setSending]=useState(false); const [hov,setHov]=useState(null);
//   const br=useRef(null); const ir=useRef(null);
//   const load=useCallback(async()=>{try{const r=await apiGetMessages(me.id,partner.id);setMsgs(r.messages||[]);await apiMarkRead(me.id,partner.id);}catch{}},[me.id,partner.id]);
//   useEffect(()=>{load();const t=setInterval(load,5000);ir.current?.focus();return()=>clearInterval(t);},[load]);
//   useEffect(()=>{br.current?.scrollIntoView({behavior:"smooth"});},[msgs]);
//   async function send(e){e.preventDefault();if(!txt.trim()||sending)return;setSending(true);try{const r=await apiSendMessage(me.id,partner.id,txt.trim());setMsgs(m=>[...m,r.message]);setTxt("");}catch(err){alert(err.message);}finally{setSending(false);}}
//   async function del(id){try{await apiDeleteMessage(id,me.id);setMsgs(m=>m.filter(x=>x.id!==id));}catch(e){alert(e.message);}}
//   function dl(iso){const d=new Date(iso),t=new Date();if(d.toDateString()===t.toDateString())return"Today";const y=new Date(t);y.setDate(t.getDate()-1);return d.toDateString()===y.toDateString()?"Yesterday":d.toLocaleDateString(undefined,{month:"short",day:"numeric"});}
//   const grouped=[];let ld=null;msgs.forEach(m=>{const dl2=dl(m.createdAt);if(dl2!==ld){grouped.push({type:"date",label:dl2});ld=dl2;}grouped.push({type:"msg",...m});});
//   return (
//     <div className="dm-panel">
//       <div className="dm-hd"><button className="dm-back" onClick={onClose}><BackIcon/></button><Avatar url={partner.avatarUrl} name={partner.username} size={34}/><div><div className="dm-pname">{partner.username}</div><div className="dm-psub">Direct message</div></div></div>
//       <div className="dm-msgs">
//         {grouped.length===0&&<div className="dm-empty"><MsgIcon/><p>Start the conversation</p></div>}
//         {grouped.map((it,i)=>it.type==="date"?<div key={`d${i}`} className="dm-datesep"><span>{it.label}</span></div>:
//           <div key={it.id} className={`dm-row${it.fromId===me.id?" dm-mine":" dm-theirs"}`} onMouseEnter={()=>setHov(it.id)} onMouseLeave={()=>setHov(null)}>
//             {it.fromId!==me.id&&<Avatar url={partner.avatarUrl} name={partner.username} size={26}/>}
//             <div className="dm-bwrap"><div className={`dm-bub${it.fromId===me.id?" bmine":" btheirs"}`}>{it.content}</div><div className="dm-t">{timeAgo(it.createdAt)}</div></div>
//             {it.fromId===me.id&&hov===it.id&&<button className="dm-del" onClick={()=>del(it.id)}><TrashIcon/></button>}
//           </div>
//         )}
//         <div ref={br}/>
//       </div>
//       <form className="dm-inp-row" onSubmit={send}>
//         <textarea ref={ir} className="dm-inp" placeholder={`Message ${partner.username}…`} value={txt} onChange={e=>setTxt(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send(e);}}} rows={1}/>
//         <button className="dm-send" type="submit" disabled={!txt.trim()||sending}><SendIcon/></button>
//       </form>
//     </div>
//   );
// }

// /* ── CONV SIDEBAR ── */
// function ConvSidebar({ me, onSelect, activeId, allUsers }) {
//   const [convs,setConvs]=useState([]);
//   useEffect(()=>{
//     async function load(){try{const r=await apiGetConversations(me.id);const en=await Promise.all((r.conversations||[]).map(async cv=>{const k=allUsers.find(u=>u.id===cv.partnerId);if(k)return{...cv,partner:k};try{const ur=await apiGetUser(cv.partnerId);return{...cv,partner:ur.user||{id:cv.partnerId,username:"?"}};}catch{return{...cv,partner:{id:cv.partnerId,username:"?"}};}}));setConvs(en);}catch{}}
//     load();const t=setInterval(load,8000);return()=>clearInterval(t);
//   },[me.id,allUsers]);
//   return <div className="conv-sb"><div className="conv-ttl">MESSAGES</div>{convs.length===0&&<div className="conv-empty">No conversations</div>}{convs.map(cv=><button key={cv.partnerId} className={`conv-row${activeId===cv.partnerId?" active":""}`} onClick={()=>onSelect(cv.partner)}><div className="conv-av-wrap"><Avatar url={cv.partner?.avatarUrl} name={cv.partner?.username||"?"} size={40}/>{cv.unread&&<div className="conv-dot"/>}</div><div className="conv-info"><div className="conv-name">{cv.partner?.username||"?"}</div><div className="conv-last">{(cv.lastMsg||"").slice(0,34)}{(cv.lastMsg||"").length>34?"…":""}</div></div></button>)}</div>;
// }


// /* ── PEOPLE ROW (sidebar) — needs own useRef ── */
// function PeopleRow({ u, me, popup, setPopup, openPopup, openChat, goReport }) {
//   const aRef = useRef(null);
//   const isOpen = popup?.user?.id === u.id;
//   return (
//     <div className="cm-prow">
//       <button ref={aRef} className="cm-pav"
//         onClick={()=>isOpen ? setPopup(null) : openPopup(u, aRef)}>
//         <Avatar url={u.avatarUrl} name={u.username} size={34}/>
//       </button>
//       <button className="cm-pname"
//         onClick={()=>isOpen ? setPopup(null) : openPopup(u, aRef)}>
//         {u.username}
//       </button>
//       <FollowBtn myId={me.id} targetId={u.id} sm/>
//       {isOpen && (
//         <UserPopup user={popup.user} meId={me.id} anchorRef={popup.anchorRef}
//           onClose={()=>setPopup(null)} onChat={openChat} onReport={goReport}/>
//       )}
//     </div>
//   );
// }

// /* ── POST CARD — needs own useRef ── */
// function PostCard({ post, me, liked, cmts, openCmts, popup, setPopup, openPopup,
//   editPostId, editPostTxt, setEditPostId, setEditPostTxt,
//   doLike, doDeletePost, saveEditPost, toggleCmts, addTopCmt,
//   setActiveTag, setQuery, openChat, goReport }) {
//   const avRef = useRef(null);
//   const isMine = post.userId === me.id;
//   const isPopupOpen = popup?.user?.id === post.userId;
//   return (
//     <div className="cm-post">
//       <div className="cm-post-hd">
//         <button ref={avRef} className="cm-post-av"
//           onClick={()=>!isMine&&(isPopupOpen ? setPopup(null) : openPopup({id:post.userId,username:post.username,avatarUrl:post.avatarUrl}, avRef))}>
//           <Avatar url={post.avatarUrl} name={post.username} size={40}/>
//         </button>
//         <div className="cm-post-meta">
//           <div className="cm-post-uname">{post.username}</div>
//           <div className="cm-post-time">{timeAgo(post.createdAt)}</div>
//         </div>
//         <DotsMenu items={isMine ? [
//           {icon:<EditIcon/>,  label:"Edit",   onClick:()=>{setEditPostId(post.id);setEditPostTxt(post.content);}},
//           {icon:<TrashIcon/>, label:"Delete", danger:true, onClick:()=>doDeletePost(post.id)},
//         ] : [
//           {icon:<UserPlusIcon/>, label:"Follow", onClick:()=>apiSendFollowReq(me.id,post.userId).catch(e=>alert(e.message))},
//           {icon:<FlagIcon/>, label:"Report", danger:true, onClick:()=>goReport({id:post.userId,username:post.username})},
//         ]}/>
//         {!isMine && isPopupOpen && (
//           <UserPopup user={popup.user} meId={me.id} anchorRef={popup.anchorRef}
//             onClose={()=>setPopup(null)} onChat={openChat} onReport={goReport}/>
//         )}
//       </div>

//       {editPostId===post.id
//         ? <div className="cm-edit-post">
//             <textarea className="cm-edit-ta" value={editPostTxt}
//               onChange={e=>setEditPostTxt(e.target.value)} rows={3} autoFocus/>
//             <div className="cm-edit-btns">
//               <button className="cm-edit-save" onClick={()=>saveEditPost(post.id)}>Save</button>
//               <button className="cm-edit-cancel" onClick={()=>setEditPostId(null)}>Cancel</button>
//             </div>
//           </div>
//         : <div className="cm-post-content">
//             <RichText text={post.content} onTag={t=>{setActiveTag(t);setQuery("");}}/>
//           </div>
//       }

//       <Gallery images={post.images||[]}/>
//       {post.videoUrl&&<VideoPlayer url={post.videoUrl}/>}

//       {(post.hashtags||[]).length>0&&(
//         <div className="cm-post-tags">
//           {(post.hashtags||[]).map(t=>(
//             <button key={t} className="cm-ptag" onClick={()=>{setActiveTag(t);setQuery("");}}>#{t}</button>
//           ))}
//         </div>
//       )}

//       <div className="cm-post-acts">
//         <button className={`cm-act-btn${liked[post.id]?" cm-liked":""}`} onClick={()=>doLike(post.id)}>
//           <HeartIcon f={!!liked[post.id]}/><span>{post.likes||0}</span>
//         </button>
//         <button className="cm-act-btn" onClick={()=>toggleCmts(post.id)}>
//           <CmtIcon/><span>{(cmts[post.id]||[]).length||""}</span>
//         </button>
//         <ShareBtn post={post}/>
//       </div>

//       {openCmts[post.id]&&(
//         <div className="cm-cmts-wrap">
//           <CommentTree comments={cmts[post.id]||[]} postId={post.id} me={me}/>
//           <TopCmtInput me={me} postId={post.id} onSubmit={addTopCmt}/>
//         </div>
//       )}
//     </div>
//   );
// }

// /* ════════════════════════════════════════════════════════════
//    MAIN PAGE
// ════════════════════════════════════════════════════════════ */
// export default function Community() {
//   const [theme,setTheme]=useState(()=>localStorage.getItem("cuchco-theme")||"dark");
//   useEffect(()=>{const r=theme==="system"?(window.matchMedia("(prefers-color-scheme:light)").matches?"light":"dark"):theme;document.documentElement.setAttribute("data-theme",r);localStorage.setItem("cuchco-theme",theme);},[theme]);

//   const [me,       setMe]      =useState(()=>loadSession());
//   const [allUsers, setAllUsers]=useState([]);
//   const [posts,    setPosts]   =useState([]);
//   const [loading,  setLoading] =useState(false);
//   const [error,    setError]   =useState("");

//   // auth
//   const [authMode,setAuthMode]=useState("login");
//   const [aForm,   setAForm]   =useState({username:"",email:"",password:""});
//   const [aErr,    setAErr]    =useState("");

//   // create
//   const [pContent,setPContent]=useState(""); const [pImgs,setPImgs]=useState([]); const [pPrev,setPPrev]=useState([]);
//   const [pVid,    setPVid]    =useState(""); const [showVid,setShowVid]=useState(false);
//   const [pTags,   setPTags]   =useState([]); const [tagInp,setTagInp]=useState("");
//   const [posting, setPosting] =useState(false);
//   const fileRef=useRef(null);

//   // search + filter
//   const [query, setQuery]=useState(""); const [activeTag,setActiveTag]=useState("");

//   // comments
//   const [openCmts, setOpenCmts]=useState({}); const [cmts, setCmts]=useState({});

//   // user popup
//   const [popup, setPopup]=useState(null); // {user, anchorRef}

//   // edit post
//   const [editPostId,  setEditPostId]  =useState(null);
//   const [editPostTxt, setEditPostTxt] =useState("");

//   // liked
//   const [liked, setLiked]=useState({});

//   // DM
//   const [dmView,setChatView]=useState(false); const [chatParter,setChatPartner]=useState(null);

//   useEffect(()=>{loadPosts();loadAllUsers();},[]);// eslint-disable-line

//   async function loadPosts(){setLoading(true);try{const r=await apiGetPosts();setPosts(r.posts||[]);}catch(e){setError(e.message);}finally{setLoading(false);}}
//   async function loadAllUsers(){try{const r=await apiGetAllUsers();setAllUsers(r.users||[]);}catch{}}

//   /* AUTH */
//   async function handleAuth(e){e.preventDefault();setAErr("");try{let r;if(authMode==="register")r=await apiRegister(aForm.username,aForm.email,aForm.password);else r=await apiLogin(aForm.email,aForm.password);saveSession(r.user);setMe(r.user);setAForm({username:"",email:"",password:""});}catch(e){setAErr(e.message);}}

//   /* IMAGES */
//   function onImgPick(e){const f=Array.from(e.target.files||[]).slice(0,6);const m=[...pImgs,...f].slice(0,6);setPImgs(m);Promise.all(m.map(f=>new Promise(res=>{const r=new FileReader();r.onload=ev=>res(ev.target.result);r.readAsDataURL(f);}))).then(setPPrev);e.target.value="";}
//   function rmImg(i){const ni=[...pImgs];ni.splice(i,1);setPImgs(ni);const np=[...pPrev];np.splice(i,1);setPPrev(np);}

//   /* HASHTAGS */
//   function addTag(raw){const t=raw.replace(/^#+/,"").trim().toLowerCase().replace(/\s+/g,"_");if(!t)return;if(!pTags.includes(t))setPTags(h=>[...h,t]);setTagInp("");}
//   function rmTag(t){setPTags(h=>h.filter(x=>x!==t));}
//   function tagKey(e){if(e.key==="Enter"||e.key===" "||e.key===","){e.preventDefault();addTag(tagInp);}}

//   /* POST */
//   async function doPost(){if(!pContent.trim()&&pImgs.length===0&&!pVid.trim())return;setPosting(true);
//     try{let urls=[];for(const f of pImgs){try{urls.push(await uploadImage(f));}catch{}}
//       const it=(pContent.match(/#(\w+)/g)||[]).map(t=>t.slice(1).toLowerCase());
//       const at=[...new Set([...pTags,...it])];
//       const tp=pVid.trim()?"video":urls.length>0?"image":"text";
//       const r=await apiCreatePost(me.id,me.username,me.avatarUrl||"",tp,pContent,urls,at,pVid.trim());
//       setPosts(p=>[r.post,...p]);setPContent("");setPImgs([]);setPPrev([]);setPTags([]);setTagInp("");setPVid("");setShowVid(false);
//     }catch(e){alert(e.message);}finally{setPosting(false);}
//   }

//   async function doLike(pid){if(!me)return;try{const r=await apiToggleLike(pid,me.id);setLiked(l=>({...l,[pid]:r.liked}));setPosts(p=>p.map(x=>x.id===pid?{...x,likes:r.likes}:x));}catch{}}
//   async function doDeletePost(pid){if(!me||!window.confirm("Delete this post?"))return;try{await apiDeletePost(pid,me.id);setPosts(p=>p.filter(x=>x.id!==pid));}catch(e){alert(e.message);}}
//   async function saveEditPost(pid){try{await apiEditPost(pid,me.id,editPostTxt);setPosts(p=>p.map(x=>x.id===pid?{...x,content:editPostTxt}:x));setEditPostId(null);}catch(e){alert(e.message);}}

//   async function loadCmts(pid){try{const r=await apiGetComments(pid);setCmts(c=>({...c,[pid]:r.comments}));}catch{}}
//   function toggleCmts(pid){setOpenCmts(o=>{const n={...o,[pid]:!o[pid]};if(n[pid])loadCmts(pid);return n;});}
//   async function addTopCmt(pid,txt){if(!txt.trim()||!me)return;try{const r=await apiAddComment(pid,"",me.id,me.username,me.avatarUrl||"",txt);setCmts(c=>({...c,[pid]:[...(c[pid]||[]),r.comment]}));}catch(e){alert(e.message);}}

//   // open popup
//   function openPopup(user, anchorRef){ if(user.id===me?.id) return; apiGetUser(user.id).then(r=>setPopup({user:r.user||user,anchorRef})).catch(()=>setPopup({user,anchorRef})); }

//   function goReport(user){ window.location.href=`/report?userId=${user.id}&username=${encodeURIComponent(user.username)}`; }
//   function openChat(partner){ setChatPartner(partner); setChatView(true); }

//   const filtered=posts.filter(p=>{
//     const q=query.trim().toLowerCase(), t=activeTag.toLowerCase();
//     if(t&&!(p.hashtags||[]).map(x=>x.toLowerCase()).includes(t)) return false;
//     if(!q) return true;
//     return p.content?.toLowerCase().includes(q)||p.username?.toLowerCase().includes(q)||(p.hashtags||[]).some(x=>x.toLowerCase().includes(q));
//   });

//   /* ── AUTH WALL ── */
//   if(!me) return (
//     <div className="cm-page cm-auth-page">
//       <nav className="cm-nav"><div className="cm-nav-left"><a href="/" className="cm-logo">CUCHCO</a></div><div className="cm-nav-center"/><div className="cm-nav-right"><div className="cm-theme"><button className={`cm-tb${theme==="light"?" on":""}`} onClick={()=>setTheme("light")}><SunIcon/></button><button className={`cm-tb${theme==="system"?" on":""}`} onClick={()=>setTheme("system")}><MonIcon/></button><button className={`cm-tb${theme==="dark"?" on":""}`} onClick={()=>setTheme("dark")}><MoonIcon/></button></div></div></nav>
//       <div className="cm-auth-box">
//         <div className="cm-auth-logo">CUCHCO</div>
//         <div className="cm-auth-title">{authMode==="login"?"Welcome back":"Join Cuchco"}</div>
//         <form className="cm-auth-form" onSubmit={handleAuth}>
//           {authMode==="register"&&<input className="cm-inp" placeholder="Username" value={aForm.username} onChange={e=>setAForm(f=>({...f,username:e.target.value}))} required/>}
//           <input className="cm-inp" type="email" placeholder="Email" value={aForm.email} onChange={e=>setAForm(f=>({...f,email:e.target.value}))} required/>
//           <input className="cm-inp" type="password" placeholder="Password" value={aForm.password} onChange={e=>setAForm(f=>({...f,password:e.target.value}))} required/>
//           {aErr&&<div className="cm-aerr">{aErr}</div>}
//           <button className="cm-auth-btn" type="submit">{authMode==="login"?"Sign In":"Create Account"}</button>
//         </form>
//         <div className="cm-auth-sw">{authMode==="login"?"No account?":"Already have one?"}<button onClick={()=>setAuthMode(m=>m==="login"?"register":"login")}>{authMode==="login"?"Register":"Login"}</button></div>
//       </div>
//     </div>
//   );

//   /* ── DM VIEW ── */
//   if(dmView&&chatParter) return (
//     <div className="cm-page">
//       <nav className="cm-nav"><div className="cm-nav-left"><a href="/" className="cm-logo">CUCHCO</a><span className="cm-sep">/</span><span className="cm-sub">MESSAGES</span></div><div className="cm-nav-center"/><div className="cm-nav-right"><button className="cm-pill" onClick={()=>setChatView(false)}>← Feed</button><div className="cm-theme"><button className={`cm-tb${theme==="light"?" on":""}`} onClick={()=>setTheme("light")}><SunIcon/></button><button className={`cm-tb${theme==="system"?" on":""}`} onClick={()=>setTheme("system")}><MonIcon/></button><button className={`cm-tb${theme==="dark"?" on":""}`} onClick={()=>setTheme("dark")}><MoonIcon/></button></div></div></nav>
//       <div className="dm-layout"><ConvSidebar me={me} onSelect={setChatPartner} activeId={chatParter.id} allUsers={allUsers}/><DMPanel me={me} partner={chatParter} onClose={()=>setChatView(false)}/></div>
//     </div>
//   );

//   /* ── MAIN FEED ── */
//   return (
//     <div className="cm-page">
//       <nav className="cm-nav">
//         <div className="cm-nav-left">
//           <a href="/" className="cm-logo">CUCHCO</a>
//           <a href="/" className="cm-home-ico" title="Home"><HomeIcon/></a>
//           <span className="cm-sep">/</span>
//           <span className="cm-sub">COMMUNITY</span>
//         </div>
//         <div className="cm-nav-center">
//           <div className="cm-search">
//             <SearchIcon/>
//             <input className="cm-search-inp" placeholder="Search posts, #tags, people…" value={query} onChange={e=>{setQuery(e.target.value);setActiveTag("");}}/>
//             {query&&<button className="cm-search-x" onClick={()=>setQuery("")}><XIcon/></button>}
//           </div>
//         </div>
//         <div className="cm-nav-right">
//           <NotifBell me={me} allUsers={allUsers} onDone={loadAllUsers}/>
//           <button className="cm-pill" onClick={()=>setChatView(true)}><MsgIcon/><span>Messages</span></button>
//           <div className="cm-theme">
//             <button className={`cm-tb${theme==="light"?" on":""}`} onClick={()=>setTheme("light")}><SunIcon/></button>
//             <button className={`cm-tb${theme==="system"?" on":""}`} onClick={()=>setTheme("system")}><MonIcon/></button>
//             <button className={`cm-tb${theme==="dark"?" on":""}`} onClick={()=>setTheme("dark")}><MoonIcon/></button>
//           </div>
//           <button className="cm-user-chip" onClick={()=>{clearSession();setMe(null);}}>
//             <Avatar url={me.avatarUrl} name={me.username} size={28}/><span>{me.username}</span>
//           </button>
//         </div>
//       </nav>

//       <div className="cm-body">
//         {/* LEFT */}
//         <aside className="cm-sl">
//           <div className="cm-slabel">PEOPLE</div>
//           {allUsers.filter(u=>u.id!==me.id).slice(0,20).map(u=>(
//             <PeopleRow key={u.id} u={u} me={me} popup={popup} setPopup={setPopup} openPopup={openPopup} openChat={openChat} goReport={goReport}/>
//           ))}
//         </aside>

//         {/* FEED */}
//         <main className="cm-feed">
//           {(activeTag||query)&&(
//             <div className="cm-filter-bar">
//               {activeTag&&<><HashIcon/><strong>#{activeTag}</strong></>}
//               {query&&!activeTag&&<><SearchIcon/><strong>"{query}"</strong></>}
//               <span className="cm-fcnt">{filtered.length} post{filtered.length!==1?"s":""}</span>
//               <button className="cm-fx" onClick={()=>{setActiveTag("");setQuery("");}}>Clear <XIcon/></button>
//             </div>
//           )}

//           {/* CREATE */}
//           <div className="cm-create">
//             <Avatar url={me.avatarUrl} name={me.username} size={40}/>
//             <div className="cm-create-body">
//               <textarea className="cm-cta" placeholder="Share a solve, tip, video… #tags inline" value={pContent} onChange={e=>setPContent(e.target.value)} rows={3}/>
//               {pPrev.length>0&&<div className="cm-prev">{pPrev.map((s,i)=><div key={i} className="cm-prev-item"><img src={s} alt=""/><button className="cm-prev-x" onClick={()=>rmImg(i)}><XIcon/></button></div>)}{pImgs.length<6&&<button className="cm-prev-add" onClick={()=>fileRef.current?.click()}><PlusIcon/></button>}</div>}
//               {showVid&&<div className="cm-vinp"><VideoIcon/><input className="cm-vid-inp" placeholder="YouTube or video URL…" value={pVid} onChange={e=>setPVid(e.target.value)}/>{pVid&&<button className="cm-vid-x" onClick={()=>setPVid("")}><XIcon/></button>}</div>}
//               <div className="cm-ht-sec">
//                 <div className="cm-ht-lbl"><HashIcon/> Hashtags <span className="cm-ht-opt">(optional)</span></div>
//                 <div className="cm-ht-row">{pTags.map(t=><span key={t} className="cm-ht-chip">#{t}<button onClick={()=>rmTag(t)}><XIcon/></button></span>)}<input className="cm-ht-inp" placeholder="Type + Enter…" value={tagInp} onChange={e=>setTagInp(e.target.value.replace(/[^a-zA-Z0-9_]/g,""))} onKeyDown={tagKey} onBlur={()=>{if(tagInp.trim())addTag(tagInp);}}/></div>
//               </div>
//               <div className="cm-create-ft">
//                 <input ref={fileRef} type="file" accept="image/*" multiple style={{display:"none"}} onChange={onImgPick}/>
//                 <button className="cm-ftool" onClick={()=>fileRef.current?.click()}><ImgIcon/>{pImgs.length>0?` ${pImgs.length}`:""}</button>
//                 <button className={`cm-ftool${showVid?" tool-on":""}`} onClick={()=>setShowVid(v=>!v)}><VideoIcon/> Video</button>
//                 <span className="cm-char">{pContent.length}/500</span>
//                 <button className="cm-post-btn" onClick={doPost} disabled={(!pContent.trim()&&pImgs.length===0&&!pVid.trim())||posting}>{posting?"Posting…":"Post"}</button>
//               </div>
//             </div>
//           </div>

//           {error&&<div className="cm-err">{error}</div>}
//           {loading&&<div className="cm-loading">Loading…</div>}
//           {!loading&&filtered.length===0&&(query||activeTag)&&<div className="cm-no-res"><HashIcon/><p>No posts match {activeTag?`#${activeTag}`:`"${query}"`}</p></div>}

//           {/* POSTS */}
//           {filtered.map(post=>(
//             <PostCard
//               key={post.id}
//               post={post}
//               me={me}
//               liked={liked}
//               cmts={cmts}
//               openCmts={openCmts}
//               popup={popup}
//               setPopup={setPopup}
//               openPopup={openPopup}
//               editPostId={editPostId}
//               editPostTxt={editPostTxt}
//               setEditPostId={setEditPostId}
//               setEditPostTxt={setEditPostTxt}
//               doLike={doLike}
//               doDeletePost={doDeletePost}
//               saveEditPost={saveEditPost}
//               toggleCmts={toggleCmts}
//               addTopCmt={addTopCmt}
//               setActiveTag={setActiveTag}
//               setQuery={setQuery}
//               openChat={openChat}
//               goReport={goReport}
//             />
//           ))}
//         </main>

//         {/* RIGHT */}
//         <aside className="cm-sr">
//           <Trending posts={posts} onTag={t=>{setActiveTag(t);setQuery("");}}/>
//           <div className="cm-slabel" style={{marginTop:20}}>SUGGESTED</div>
//           {allUsers.filter(u=>u.id!==me.id).slice(0,8).map(u=>(
//             <div key={u.id} className="cm-sugg-row">
//               <button className="cm-sugg-av" onClick={()=>{const r={current:null};openPopup(u,r);}}><Avatar url={u.avatarUrl} name={u.username} size={30}/><div className="cm-dot"/></button>
//               <button className="cm-sugg-name" onClick={()=>openPopup(u,{current:null})}>{u.username}</button>
//             </div>
//           ))}
//         </aside>
//       </div>
//     </div>
//   );
// }

// /* small helper — top-level comment input */
// function TopCmtInput({ me, postId, onSubmit }) {
//   const [txt,setTxt]=useState("");
//   return (
//     <div className="cm-topcmt">
//       <Avatar url={me.avatarUrl} name={me.username} size={28}/>
//       <input className="cmt-inp" placeholder="Write a comment…" value={txt} onChange={e=>setTxt(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){onSubmit(postId,txt);setTxt("");}}}/>
//       <button className="cmt-send" onClick={()=>{onSubmit(postId,txt);setTxt("");}}><SendIcon/></button>
//     </div>
//   );
// }
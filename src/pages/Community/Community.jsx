import { useState, useEffect, useRef, useCallback } from "react";
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
          {/* Learn — mega dropdown */}
          <div className="nav-item">
            <button
              className="nav-link"
              onMouseEnter={() => setDropdown("learn")}
              onClick={() => setDropdown(dropdown === "learn" ? null : "learn")}
            >
              Learn <ChevronDown />
            </button>
          </div>

          {/* Lessons — goes back to home lessons section */}
          <div className="nav-item">
            <button className="nav-link"
              onClick={() => { window.location.href = "/#lessons"; }}>
              Lessons
            </button>
          </div>

          {/* Community — active page */}
          <div className="nav-item">
            <span className="nav-link" style={{ color:"var(--yellow)", cursor:"default" }}>
              Community
            </span>
          </div>

          {/* About */}
          <div className="nav-item">
            <a href="/#about" className="nav-link">About</a>
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
                    <a key={item.label}
                      href={item.locked && !user ? undefined : item.href}
                      className="mega-link"
                      onClick={e => {
                        if (item.locked && !user) { e.preventDefault(); setDropdown(null); openAuth("login"); }
                        else setDropdown(null);
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
        <div className="mobile-menu-section">
          <h4>Navigate</h4>
          <a href="/"          className="mobile-menu-link" onClick={() => setMobileOpen(false)}>🏠 Home</a>
          <a href="/#lessons"  className="mobile-menu-link" onClick={() => setMobileOpen(false)}>📚 Lessons</a>
          <a href="/community" className="mobile-menu-link" onClick={() => setMobileOpen(false)}>💬 Community</a>
        </div>
        <div className="mobile-menu-section">
          <h4>Free Tools</h4>
          <a href="/cube"  className="mobile-menu-link" onClick={() => setMobileOpen(false)}>🧩 Cube Solver</a>
          <a href="/chess" className="mobile-menu-link" onClick={() => setMobileOpen(false)}>♟️ Chess Board</a>
          <a href="/code"  className="mobile-menu-link" onClick={() => setMobileOpen(false)}>💻 Code Playground</a>
        </div>
        <div className="mobile-auth-row">
          {user ? (
            <button className="btn-signup" style={{flex:1}} onClick={() => { setMobileOpen(false); setSettingsOpen(true); }}>⚙ Settings</button>
          ) : (
            <>
              <button className="btn-login"  style={{flex:1}} onClick={() => { setMobileOpen(false); openAuth("login"); }}>Log In</button>
              <button className="btn-signup" style={{flex:1}} onClick={() => { setMobileOpen(false); openAuth("signup"); }}>Sign Up</button>
            </>
          )}
        </div>
        <div style={{marginTop:24,display:"flex",gap:8,alignItems:"center"}}>
          <span style={{fontFamily:"Space Mono,monospace",fontSize:"0.6rem",letterSpacing:"2px",color:"var(--text2)"}}>THEME</span>
          <div className="theme-toggle">
            <button className={`t-btn${themeMode==="light"  ? " on" : ""}`} onClick={() => setThemeMode("light")}><SunIcon/></button>
            <button className={`t-btn${themeMode==="system" ? " on" : ""}`} onClick={() => setThemeMode("system")}><MonitorIcon/></button>
            <button className={`t-btn${themeMode==="dark"   ? " on" : ""}`} onClick={() => setThemeMode("dark")}><MoonIcon/></button>
          </div>
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
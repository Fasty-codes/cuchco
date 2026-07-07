// /**
//  * CUCHCO — Google Sheets Backend API
//  * ====================================
//  * Setup Instructions:
//  * 1. Create a Google Sheet with these tabs:
//  *    - Users:    id | username | email | passwordHash | avatarUrl | bio | createdAt
//  *    - Posts:    id | userId | username | avatarUrl | type | content | mediaUrl | likes | createdAt
//  *    - Likes:    id | postId | userId
//  *    - Comments: id | postId | parentId | userId | username | avatarUrl | content | createdAt
//  *
//  * 2. Deploy a Google Apps Script as Web App (execute as Me, anyone can access):
//  *    - Paste the Apps Script code below as reference
//  *    - Copy the deployment URL into SHEETS_API_URL
//  *
//  * 3. Replace SHEETS_API_URL with your deployed Apps Script URL.
//  *
//  * ============================================================
//  * APPS SCRIPT CODE (deploy as Web App):
//  * ============================================================
//  *
//  * const SHEET_ID = "YOUR_GOOGLE_SHEET_ID";
//  *
//  * function doPost(e) {
//  *   const data = JSON.parse(e.postData.contents);
//  *   const ss = SpreadsheetApp.openById(SHEET_ID);
//  *   const { action, payload } = data;
//  *   let result;
//  *
//  *   try {
//  *     switch(action) {
//  *       case "register":    result = register(ss, payload);    break;
//  *       case "login":       result = login(ss, payload);       break;
//  *       case "updateProfile": result = updateProfile(ss, payload); break;
//  *       case "createPost":  result = createPost(ss, payload);  break;
//  *       case "getPosts":    result = getPosts(ss, payload);    break;
//  *       case "deletePost":  result = deletePost(ss, payload);  break;
//  *       case "toggleLike":  result = toggleLike(ss, payload);  break;
//  *       case "addComment":  result = addComment(ss, payload);  break;
//  *       case "getComments": result = getComments(ss, payload); break;
//  *       case "deleteComment": result = deleteComment(ss, payload); break;
//  *       default: result = { error: "Unknown action" };
//  *     }
//  *   } catch(err) {
//  *     result = { error: err.toString() };
//  *   }
//  *
//  *   return ContentService.createTextOutput(JSON.stringify(result))
//  *     .setMimeType(ContentService.MimeType.JSON);
//  * }
//  *
//  * function doGet(e) { return doPost(e); }
//  *
//  * function uid() { return Utilities.getUuid(); }
//  * function now() { return new Date().toISOString(); }
//  *
//  * function simpleHash(str) {
//  *   let hash = 0;
//  *   for (let i = 0; i < str.length; i++) {
//  *     hash = ((hash << 5) - hash) + str.charCodeAt(i);
//  *     hash |= 0;
//  *   }
//  *   return hash.toString(16);
//  * }
//  *
//  * function register(ss, { username, email, password }) {
//  *   const sheet = ss.getSheetByName("Users");
//  *   const rows = sheet.getDataRange().getValues();
//  *   for (let i = 1; i < rows.length; i++) {
//  *     if (rows[i][2] === email) return { error: "Email already registered" };
//  *     if (rows[i][1] === username) return { error: "Username taken" };
//  *   }
//  *   const id = uid();
//  *   const hash = simpleHash(password);
//  *   sheet.appendRow([id, username, email, hash, "", "", now()]);
//  *   return { ok: true, user: { id, username, email, avatarUrl: "", bio: "" } };
//  * }
//  *
//  * function login(ss, { email, password }) {
//  *   const sheet = ss.getSheetByName("Users");
//  *   const rows = sheet.getDataRange().getValues();
//  *   const hash = simpleHash(password);
//  *   for (let i = 1; i < rows.length; i++) {
//  *     if (rows[i][2] === email && rows[i][3] === hash) {
//  *       return { ok: true, user: {
//  *         id: rows[i][0], username: rows[i][1], email: rows[i][2],
//  *         avatarUrl: rows[i][4], bio: rows[i][5]
//  *       }};
//  *     }
//  *   }
//  *   return { error: "Invalid email or password" };
//  * }
//  *
//  * function updateProfile(ss, { userId, username, email, avatarUrl, bio }) {
//  *   const sheet = ss.getSheetByName("Users");
//  *   const rows = sheet.getDataRange().getValues();
//  *   for (let i = 1; i < rows.length; i++) {
//  *     if (rows[i][0] === userId) {
//  *       sheet.getRange(i+1, 2).setValue(username || rows[i][1]);
//  *       sheet.getRange(i+1, 3).setValue(email || rows[i][2]);
//  *       sheet.getRange(i+1, 5).setValue(avatarUrl !== undefined ? avatarUrl : rows[i][4]);
//  *       sheet.getRange(i+1, 6).setValue(bio !== undefined ? bio : rows[i][5]);
//  *       return { ok: true, user: {
//  *         id: rows[i][0],
//  *         username: username || rows[i][1],
//  *         email: email || rows[i][2],
//  *         avatarUrl: avatarUrl !== undefined ? avatarUrl : rows[i][4],
//  *         bio: bio !== undefined ? bio : rows[i][5]
//  *       }};
//  *     }
//  *   }
//  *   return { error: "User not found" };
//  * }
//  *
//  * function createPost(ss, { userId, username, avatarUrl, type, content, mediaUrl }) {
//  *   const sheet = ss.getSheetByName("Posts");
//  *   const id = uid();
//  *   sheet.appendRow([id, userId, username, avatarUrl, type, content, mediaUrl || "", 0, now()]);
//  *   return { ok: true, post: { id, userId, username, avatarUrl, type, content, mediaUrl: mediaUrl||"", likes: 0, createdAt: now() }};
//  * }
//  *
//  * function getPosts(ss) {
//  *   const sheet = ss.getSheetByName("Posts");
//  *   const rows = sheet.getDataRange().getValues();
//  *   const posts = [];
//  *   for (let i = 1; i < rows.length; i++) {
//  *     posts.unshift({ id: rows[i][0], userId: rows[i][1], username: rows[i][2],
//  *       avatarUrl: rows[i][3], type: rows[i][4], content: rows[i][5],
//  *       mediaUrl: rows[i][6], likes: rows[i][7], createdAt: rows[i][8] });
//  *   }
//  *   return { ok: true, posts };
//  * }
//  *
//  * function deletePost(ss, { postId, userId }) {
//  *   const sheet = ss.getSheetByName("Posts");
//  *   const rows = sheet.getDataRange().getValues();
//  *   for (let i = 1; i < rows.length; i++) {
//  *     if (rows[i][0] === postId && rows[i][1] === userId) {
//  *       sheet.deleteRow(i+1); return { ok: true };
//  *     }
//  *   }
//  *   return { error: "Not found or unauthorized" };
//  * }
//  *
//  * function toggleLike(ss, { postId, userId }) {
//  *   const likesSheet = ss.getSheetByName("Likes");
//  *   const postsSheet = ss.getSheetByName("Posts");
//  *   const likeRows = likesSheet.getDataRange().getValues();
//  *   let liked = false, likeRow = -1;
//  *   for (let i = 1; i < likeRows.length; i++) {
//  *     if (likeRows[i][1] === postId && likeRows[i][2] === userId) { liked = true; likeRow = i+1; break; }
//  *   }
//  *   const postRows = postsSheet.getDataRange().getValues();
//  *   for (let i = 1; i < postRows.length; i++) {
//  *     if (postRows[i][0] === postId) {
//  *       let count = parseInt(postRows[i][7]) || 0;
//  *       if (liked) { likesSheet.deleteRow(likeRow); count = Math.max(0, count-1); }
//  *       else { likesSheet.appendRow([uid(), postId, userId]); count++; }
//  *       postsSheet.getRange(i+1, 8).setValue(count);
//  *       return { ok: true, liked: !liked, likes: count };
//  *     }
//  *   }
//  *   return { error: "Post not found" };
//  * }
//  *
//  * function addComment(ss, { postId, parentId, userId, username, avatarUrl, content }) {
//  *   const sheet = ss.getSheetByName("Comments");
//  *   const id = uid();
//  *   sheet.appendRow([id, postId, parentId||"", userId, username, avatarUrl||"", content, now()]);
//  *   return { ok: true, comment: { id, postId, parentId: parentId||"", userId, username, avatarUrl: avatarUrl||"", content, createdAt: now() }};
//  * }
//  *
//  * function getComments(ss, { postId }) {
//  *   const sheet = ss.getSheetByName("Comments");
//  *   const rows = sheet.getDataRange().getValues();
//  *   const comments = [];
//  *   for (let i = 1; i < rows.length; i++) {
//  *     if (rows[i][1] === postId) {
//  *       comments.push({ id: rows[i][0], postId: rows[i][1], parentId: rows[i][2],
//  *         userId: rows[i][3], username: rows[i][4], avatarUrl: rows[i][5],
//  *         content: rows[i][6], createdAt: rows[i][7] });
//  *     }
//  *   }
//  *   return { ok: true, comments };
//  * }
//  *
//  * function deleteComment(ss, { commentId, userId }) {
//  *   const sheet = ss.getSheetByName("Comments");
//  *   const rows = sheet.getDataRange().getValues();
//  *   for (let i = 1; i < rows.length; i++) {
//  *     if (rows[i][0] === commentId && rows[i][3] === userId) {
//  *       sheet.deleteRow(i+1); return { ok: true };
//  *     }
//  *   }
//  *   return { error: "Not found or unauthorized" };
//  * }
//  */

// // ============================================================
// // FRONTEND API CLIENT
// // ============================================================

// // 🔴 REPLACE THIS with your deployed Google Apps Script Web App URL
// export const SHEETS_API_URL = "https://script.google.com/macros/s/AKfycbxtk1gy7dcfgELU15Xf5wgssq_pHvzarpUa9GM2g0lT7dhJ3AjTEq7ra5rLaJ13D66F/exec";

// // For image uploads — use Cloudinary free tier or imgbb
// // Replace with your actual key
// const IMGBB_API_KEY = "e8b04a5aad2ce2130f60058eb6eabce0";

// /**
//  * Core API call to Google Sheets via Apps Script
//  */
// async function sheetsCall(action, payload = {}) {
//   try {
//     const res = await fetch(SHEETS_API_URL, {
//       method: "POST",
//       headers: { "Content-Type": "text/plain" }, // Apps Script needs text/plain for CORS
//       body: JSON.stringify({ action, payload }),
//     });
//     const data = await res.json();
//     if (data.error) throw new Error(data.error);
//     return data;
//   } catch (err) {
//     throw new Error(err.message || "Network error");
//   }
// }

// // ── AUTH ────────────────────────────────────────────────────

// export async function apiRegister(username, email, password) {
//   return sheetsCall("register", { username, email, password });
// }

// export async function apiLogin(email, password) {
//   return sheetsCall("login", { email, password });
// }

// export async function apiUpdateProfile(userId, fields) {
//   return sheetsCall("updateProfile", { userId, ...fields });
// }

// // ── IMAGE UPLOAD (imgbb) ────────────────────────────────────

// export async function uploadImage(file) {
//   const formData = new FormData();
//   formData.append("image", file);
//   const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
//     method: "POST",
//     body: formData,
//   });
//   const data = await res.json();
//   if (!data.success) throw new Error("Image upload failed");
//   return data.data.url;
// }

// // ── POSTS ───────────────────────────────────────────────────

// export async function apiCreatePost(userId, username, avatarUrl, type, content, mediaUrl) {
//   return sheetsCall("createPost", { userId, username, avatarUrl, type, content, mediaUrl });
// }

// export async function apiGetPosts() {
//   return sheetsCall("getPosts", {});
// }

// export async function apiDeletePost(postId, userId) {
//   return sheetsCall("deletePost", { postId, userId });
// }

// export async function apiToggleLike(postId, userId) {
//   return sheetsCall("toggleLike", { postId, userId });
// }

// // ── COMMENTS ────────────────────────────────────────────────

// export async function apiAddComment(postId, parentId, userId, username, avatarUrl, content) {
//   return sheetsCall("addComment", { postId, parentId, userId, username, avatarUrl, content });
// }

// export async function apiGetComments(postId) {
//   return sheetsCall("getComments", { postId });
// }

// export async function apiDeleteComment(commentId, userId) {
//   return sheetsCall("deleteComment", { commentId, userId });
// }

// // ── LOCAL SESSION ───────────────────────────────────────────
// // We store the logged-in user in localStorage

// export function saveSession(user) {
//   localStorage.setItem("cuchco-user", JSON.stringify(user));
// }

// export function loadSession() {
//   try {
//     const raw = localStorage.getItem("cuchco-user");
//     return raw ? JSON.parse(raw) : null;
//   } catch { return null; }
// }

// export function clearSession() {
//   localStorage.removeItem("cuchco-user");
// }

// // ── TIME FORMATTING ─────────────────────────────────────────

// export function timeAgo(dateStr) {
//   const diff = Date.now() - new Date(dateStr).getTime();
//   const s = Math.floor(diff / 1000);
//   if (s < 60)  return `${s}s ago`;
//   const m = Math.floor(s / 60);
//   if (m < 60)  return `${m}m ago`;
//   const h = Math.floor(m / 60);
//   if (h < 24)  return `${h}h ago`;
//   const d = Math.floor(h / 24);
//   return `${d}d ago`;
// }

// AKfycbxtk1gy7dcfgELU15Xf5wgssq_pHvzarpUa9GM2g0lT7dhJ3AjTEq7ra5rLaJ13D66F
// e8b04a5aad2ce2130f60058eb6eabce0


// ============================================================
// CUCHCO — sheetsApi.js  (Frontend API Client)
// Sheet ID: 1_2xXaEPExtjM4UvgvQ6FpUNTwjTnkv6Cul1cq3j2iPY
// Tabs: Users · Posts · Likes · Comments · Follows · Messages
// ============================================================

// ============================================================
// CUCHCO — sheetsApi.js
// Sheet ID: 1_2xXaEPExtjM4UvgvQ6FpUNTwjTnkv6Cul1cq3j2iPY
// ============================================================

export const SHEETS_API_URL = "https://script.google.com/macros/s/AKfycbxtk1gy7dcfgELU15Xf5wgssq_pHvzarpUa9GM2g0lT7dhJ3AjTEq7ra5rLaJ13D66F/exec";
// ↑ Paste your Web App URL here after deploying Code.gs

const IMGBB_API_KEY = "e8b04a5aad2ce2130f60058eb6eabce0";

// Core fetch
// We send Content-Type: text/plain so Apps Script puts the body in
// e.postData.contents without any redirect / CORS stripping.
async function sheetsCall(action, payload = {}) {
  try {
    const res = await fetch(SHEETS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action, payload }),
      redirect: "follow",
    });
    const text = await res.text();
    let data;
    try { data = JSON.parse(text); }
    catch { throw new Error("Server response not JSON: " + text.slice(0, 300)); }
    if (data.error) throw new Error(data.error);
    return data;
  } catch (err) {
    throw new Error(err.message || "Network error");
  }
}

// ── AUTH ──────────────────────────────────────────────────────
export const apiRegister       = (username, email, password) =>
  sheetsCall("register", { username, email, password });
export const apiLogin          = (email, password) =>
  sheetsCall("login", { email, password });
export const apiUpdateProfile  = (userId, fields) =>
  sheetsCall("updateProfile", { userId, ...fields });
export const apiGetUser        = (userId) =>
  sheetsCall("getUser", { userId });
export const apiGetAllUsers    = () =>
  sheetsCall("getAllUsers", {});

// ── IMAGE UPLOAD (imgbb) ─────────────────────────────────────
export async function uploadImage(file) {
  const fd = new FormData();
  fd.append("image", file);
  const res  = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
    method: "POST", body: fd,
  });
  const data = await res.json();
  if (!data.success) throw new Error("Image upload failed");
  return data.data.url;
}

// ── POSTS ─────────────────────────────────────────────────────
export const apiCreatePost = (userId, username, avatarUrl, type, content, images, hashtags, videoUrl) =>
  sheetsCall("createPost", { userId, username, avatarUrl, type, content, images, hashtags, videoUrl });
export const apiGetPosts      = ()                  => sheetsCall("getPosts",   {});
export const apiDeletePost    = (postId, userId)    => sheetsCall("deletePost",  { postId, userId });
export const apiToggleLike    = (postId, userId)    => sheetsCall("toggleLike",  { postId, userId });

// ── COMMENTS ─────────────────────────────────────────────────
export const apiAddComment    = (postId, parentId, userId, username, avatarUrl, content) =>
  sheetsCall("addComment", { postId, parentId, userId, username, avatarUrl, content });
export const apiGetComments   = (postId)            => sheetsCall("getComments",   { postId });
export const apiDeleteComment = (commentId, userId) => sheetsCall("deleteComment", { commentId, userId });

// ── FOLLOWS ───────────────────────────────────────────────────
export const apiSendFollowReq  = (fromId, toId) => sheetsCall("sendFollowRequest", { fromId, toId });
export const apiAcceptFollow   = (fromId, toId) => sheetsCall("acceptFollow",       { fromId, toId });
export const apiRejectFollow   = (fromId, toId) => sheetsCall("rejectFollow",       { fromId, toId });
export const apiUnfollow       = (fromId, toId) => sheetsCall("unfollow",           { fromId, toId });
export const apiGetFollowState = (fromId, toId) => sheetsCall("getFollowState",     { fromId, toId });
export const apiGetFollowers   = (userId)       => sheetsCall("getFollowers",       { userId });
export const apiGetFollowing   = (userId)       => sheetsCall("getFollowing",       { userId });
export const apiGetPendingReqs = (userId)       => sheetsCall("getPendingRequests", { userId });

// ── MESSAGES ─────────────────────────────────────────────────
export const apiSendMessage      = (fromId, toId, content) =>
  sheetsCall("sendMessage",       { fromId, toId, content });
export const apiGetMessages      = (userId, otherId) =>
  sheetsCall("getMessages",       { userId, otherId });
export const apiDeleteMessage    = (msgId, userId) =>
  sheetsCall("deleteMessage",     { msgId, userId });
export const apiGetConversations = (userId) =>
  sheetsCall("getConversations",  { userId });
export const apiMarkRead         = (userId, otherId) =>
  sheetsCall("markRead",          { userId, otherId });

// ── SESSION ───────────────────────────────────────────────────
export const saveSession  = (u) => localStorage.setItem("cuchco-user", JSON.stringify(u));
export const loadSession  = ()  => {
  try { return JSON.parse(localStorage.getItem("cuchco-user") || "null"); } catch { return null; }
};
export const clearSession = ()  => localStorage.removeItem("cuchco-user");

// ── HELPERS ───────────────────────────────────────────────────
export function timeAgo(dateStr) {
  const s = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (s < 60)  return `${s}s`;
  const m = Math.floor(s / 60); if (m < 60)  return `${m}m`;
  const h = Math.floor(m / 60); if (h < 24)  return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

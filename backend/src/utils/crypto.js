// // utils/crypto.js
// import crypto from "crypto";

// const RAW_KEY = process.env.CHAT_AES_KEY; // base64 of 32 random bytes

// function getKey() {
//   // Prefer base64 decoding (32 bytes)
//   try {
//     const b = Buffer.from(RAW_KEY, "base64");
//     if (b.length === 32) return b;
//   } catch {}
//   // fallback if someone put utf8 in env: pad/truncate to 32 bytes
//   const utf = Buffer.from(RAW_KEY || "", "utf8");
//   return Buffer.concat([utf, Buffer.alloc(32)]).subarray(0, 32);
// }

// // AES-256-GCM (random 12-byte IV). Returns base64 parts.
// export function encryptText(plaintext) {
//   const key = getKey();
//   const iv = crypto.randomBytes(12);
//   const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
//   const ct = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
//   const tag = cipher.getAuthTag();
//   return {
//     ivB64: iv.toString("base64"),
//     ctB64: ct.toString("base64"),
//     tagB64: tag.toString("base64"),
//   };
// }

// export function decryptText({ ivB64, ctB64, tagB64 }) {
//   const key = getKey();
//   const iv = Buffer.from(ivB64, "base64");
//   const ct = Buffer.from(ctB64, "base64");
//   const tag = Buffer.from(tagB64, "base64");
//   const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
//   decipher.setAuthTag(tag);
//   const pt = Buffer.concat([decipher.update(ct), decipher.final()]);
//   return pt.toString("utf8");
// }

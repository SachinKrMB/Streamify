// // models/Message.js
// import mongoose from "mongoose";

// const encryptedSchema = new mongoose.Schema(
//   {
//     ivB64: { type: String, required: true },
//     ctB64: { type: String, required: true },
//     tagB64: { type: String, required: true },
//   },
//   { _id: false }
// );

// const messageSchema = new mongoose.Schema(
//   {
//     // Use string because your channelId is like "userA-userB"
//     chatId: { type: String, required: true },

//     sender: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     // Optional legacy/plaintext (keep null for encrypted messages)
//     text: { type: String, default: null },

//     // Encrypted payload (preferred)
//     encrypted: { type: encryptedSchema, required: true },

//     isEncrypted: { type: Boolean, default: true },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Message", messageSchema);

// // routes/chat.route.js
// import express from "express";
// import { protectRoute } from "../middleware/auth.middleware.js";
// import {
//   getStreamToken,
//   createChannel,
//   sendMessage,
//   getMessages,
// } from "../controllers/chat.controller.js";

// const router = express.Router();

// router.use(protectRoute);

// router.get("/token", getStreamToken);
// router.post("/channel", createChannel);
// router.post("/channel/:channelId/message", sendMessage);
// router.get("/channel/:channelId/messages", getMessages);

// export default router;
import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getStreamToken } from "../controllers/chat.controller.js";

const router = express.Router();

router.get("/token", protectRoute, getStreamToken);

export default router;
import { Router } from "express";
import {
  getMessages,
  getMyConversations,
  createOrGetConversation,
  sendMessage,
  getConversationById,
} from "./chat.controller";
import verifyJwt from "../../common/middlewares/verifyJwt";

const router = Router();

// conversations list
router.get("/", verifyJwt, getMyConversations);

// create or get conversation
router.post("/conversation", verifyJwt, createOrGetConversation);

// get single conversation (secure)
router.get("/:conversationId", verifyJwt, getConversationById);

// messages
router.get("/:conversationId/messages", verifyJwt, getMessages);

// send message (fallback if no socket)
router.post("/:conversationId/message", verifyJwt, sendMessage);

export default router;
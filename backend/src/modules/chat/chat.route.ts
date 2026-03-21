import { Router } from "express";
import { getMessages } from "./chat.controller";

const router = Router();

router.get("/:conversationId/messages", getMessages);

export default router;
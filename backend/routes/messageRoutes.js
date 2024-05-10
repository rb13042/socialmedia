import express from "express";
import protectRoutes from "../middlewares/protectRoutes.js";
import { getConversations, getMessages, sendMessage } from "../controller/messageController.js";
const router = express.Router();


router.get("/conversations",protectRoutes,getConversations);

router.get("/:otherUserId",protectRoutes,getMessages);

router.post("/",protectRoutes,sendMessage);



export default router;
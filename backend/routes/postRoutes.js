import  express from 'express';
import { LikeUnlikePost, createPost, deletePost, getFeedPost, getPost, replyToPost } from '../controller/postController.js';
import protectRoutes from '../middlewares/protectRoutes.js';

const router = express.Router();

router.get("/feed",protectRoutes,getFeedPost);
router.get("/:id",getPost);
router.post("/create",protectRoutes,createPost);
router.delete("/:id",protectRoutes,deletePost);
router.post("/like/:id",protectRoutes,LikeUnlikePost);
router.post("/reply/:id",protectRoutes,replyToPost);





export default router;





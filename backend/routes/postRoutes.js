import  express from 'express';
import { LikeUnlikePost, createPost, deletePost, getFeedPost, getPost, getUserPosts, replyToPost } from '../controller/postController.js';
import protectRoutes from '../middlewares/protectRoutes.js';

const router = express.Router();

router.get("/feed",protectRoutes,getFeedPost);
router.get("/:id",getPost);
router.get("/user/:username",getUserPosts);
router.post("/create",protectRoutes,createPost);
router.delete("/:id",protectRoutes,deletePost);
router.put("/like/:id",protectRoutes,LikeUnlikePost);
router.put("/reply/:id",protectRoutes,replyToPost);





export default router;





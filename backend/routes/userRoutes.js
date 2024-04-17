import express from "express";
import {FollowUnFollowUser, loginUser, logoutUser, signupUser} from "../controller/userController.js";
import protectRoutes from "../middlewares/protectRoutes.js";
const router = express.Router();

router.post("/signup",signupUser);
router.post("/login",loginUser);
router.post("/logout",logoutUser);
router.post("/follow/:id",protectRoutes,FollowUnFollowUser);
//login
//updating
//deleting


export default router;
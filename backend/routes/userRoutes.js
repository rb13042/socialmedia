import express from "express";
import {FollowUnFollowUser, getUserProfile, loginUser, logoutUser, signupUser, updateUser} from "../controller/userController.js";
import protectRoutes from "../middlewares/protectRoutes.js";
const router = express.Router();

router.get("/profile/:username",getUserProfile);
router.post("/signup",signupUser);
router.post("/login",loginUser);
router.post("/logout",logoutUser);
router.post("/follow/:id",protectRoutes,FollowUnFollowUser); //middleware prtectroutes for authorization
router.post("/update/:id",protectRoutes,updateUser);
//login
//updating
//deleting


export default router;
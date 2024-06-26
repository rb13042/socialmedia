import User from "../db/models/userModel.js";
import bcrypt from "bcryptjs";
import generateTokensAndSetCookies from "../utilis/helpers/generateTokenAndSetCookie.js";
import {v2 as cloudinary} from 'cloudinary';
import { Mongoose } from "mongoose";
import mongoose from "mongoose";
import Post from "../db/models/postModel.js";
//sign up
const signupUser = async(req,res)=>{

  try {
    const {name,username,email,password} = req.body;
    const user = await User.findOne({$or:[{email},{username}]});
    if(user){
      return res.status(400).json({error:"Users already exist"});
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);

    const newUser = new User({
      name,
      username,
      email,
      password:hashedPassword
 
    });

    await newUser.save();

    if(newUser)
    {
      //generating tokens and setting cookies

          generateTokensAndSetCookies(newUser._id,res)
      
      res.status(201).json({
        _id:newUser._id,
        name:newUser.name,
        username:newUser.username,
        email:newUser.email,
        profilePic:newUser.profilePic,
        bio:newUser.bio,
      });
    }
    else
    {
      res.status(400).json({
        error:"Invalid user data"
      });
    }

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
    console.log("Error in signing up user : ",err.message );
    
  }
 
}

//login 
const loginUser = async(req,res)=>{

  try {
    const {username,password} = req.body;
    const user = await User.findOne({username}); //hashed password
    const isPasswordCorrect = await bcrypt.compare(password,user?.password || "");
    if(!user || !isPasswordCorrect)return res.status(400).json({
      message:"Invalid username or password"
    });

    //generating tokens and setting cookies

    generateTokensAndSetCookies(user._id,res)

    res.status(200).json({
      _id: user._id,
      name:user.name,
      username:user.username,
      email:user.email,
      bio:user.bio,
      profilePic:user.profilePic,
    });
    
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
    console.log("Error in logging in user : ",error.message );
    
  }
}

//logout
const logoutUser = (req,res)=>{
     try {
      
          res.cookie('jwt',"",{maxAge:1});
          res.status(200).json({
            message:"User logged out successfully"
          });
     } catch (error) {


    res.status(500).json({
      error: error.message
    });
    console.log("Error in logging out user : ",error.message );
       
     }
}

//follow and unfollow
const FollowUnFollowUser = async(req,res)=>{
  try {
      const {id} = req.params;
      const userToModify = await User.findById(id);
      const currentUser = await User.findById(req.user._id);
      console.log(id);
      console.log(req.user._id);

      if(id == req.user._id)return res.status(400).json({message:"you cannot follow/unfollow yourself"});

      if(!userToModify || !currentUser)return res.status(400).json({message:"user not found"});

      const isFollowing = currentUser.following.includes(id);

      //mechanism for toggle
      if(isFollowing){
           //unfollow
        await User.findByIdAndUpdate(id,{
          $pull:{followers:req.user._id}
        });
        await User.findByIdAndUpdate(req.user._id,{
          $pull:{following:id}
        });
        res.status(200).json({
          message:"User unfollowed successfully"
        });
      }
      else
      { 
        //follow
        await User.findByIdAndUpdate(id,{
          $push:{followers:req.user._id}});
        await User.findByIdAndUpdate(req.user._id,{
          $push:{following:id}});
        res.status(200).json({
          message:"User followed successfully"
        });

      }
  } catch (error) {
    res.status(500).json({
      error: err.message
    });
    console.log("Error in following/unfollowing the user : ",err.message );
  }
}

//update the user profile
const updateUser = async(req,res)=>{
   const { name,email,username,password,bio} = req.body;
   let {profilePic} = req.body;
   const userId = req.user._id;
 
     
  try {
   
    let user = await User.findById(userId);
    if(!user) return res.status(404).json({message:"User not found"});

    if(req.params.id !== userId.toString()) return res.status(400).json({message:"You are not authorized to update this user"});

    if(password){
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password,salt);
      user.password = hashedPassword;
    }

    if(profilePic)
    {
        if(user.profilePic){
          await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0]);
        }

        const uploadedResponse = await cloudinary.uploader.upload(profilePic);
        profilePic = uploadedResponse.secure_url;
    }

    user.name  = name || user.name;
    user.email = email || user.email;
    user.username = username || user.username;
    user.profilePic = profilePic || user.profilePic;
    user.bio = bio || user.bio;
    
    user = await user.save();

    await Post.updateMany(
      {"replies.userId":userId},
      {
        $set:{
          "replies.$[reply].username":user.username,
          "replies.$[reply].userProfilePic":user.profilePic

        }
      },
      {arrayFilters:[{"reply.userId":userId}]}
    )
    res.status(200).json(user);

  } catch (err) {
    
     res.status(500).json({
      error: err.message
    });
    console.log("Error in updating the user : ",err.message );
  }
}

//to get the profile using username 
const getUserProfile = async(req,res)=>{
     try {
              
          const {query} = req.params;
          console.log(query);
          let user;
          if(mongoose.Types.ObjectId.isValid(query))
          {
            console.log(mongoose.Types.ObjectId.isValid(query));
            user = await User.findOne({_id:query}).select("-password").select("-updatedAt");
          }
          else
          {
            user = await User.findOne({username:query}).select("-password").select("-updatedAt");
          }
          if(!user) return res.status(404).json({error:"User not found"});
          res.status(200).json(user);
         
     } catch (err) {
       
          res.status(500).json({error: err.message});
          console.log("Error in getting  the profile : ",err.message );
     }
}

const getSuggestedUsers = async(req,res)=>{
  try {
    const userId = req.user._id;

    const usersFollowedByYou = await User.findById(userId).select("following");

    const users = await User.aggregate([
      {
        $match:{
           _id:{$ne:userId},
        }
      },
      {
        $sample:{
          size:10
        }

      }
    ])
    const filteredUsers = users.filter(user => !usersFollowedByYou.following.includes(user._id));
    const suggestedUsers = filteredUsers.slice(0,4);

    suggestedUsers.forEach(user => user.password = null);

    res.status(200).json(suggestedUsers);
   } catch (err) {
       res.status(500).json({error: err.message});
      console.log("Error in getting  the suggested users : ",err.message );
    
  }
}

export {signupUser,loginUser,logoutUser,FollowUnFollowUser,updateUser,getUserProfile,getSuggestedUsers};
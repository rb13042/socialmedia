import User from "../db/models/userModel.js";
import bcrypt from "bcryptjs";
import generateTokensAndSetCookies from "../utilis/helpers/generateTokenAndSetCookie.js";

//sign up
const signupUser = async(req,res)=>{

  try {
    const {name,username,email,password} = req.body;
    const user = await User.findOne({$or:[{email},{username}]});
    if(user){
      return res.status(400).json({
        message:"Users already exist"
      });
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
      });
    }
    else
    {
      res.status(400).json({
        message:"Invalid user data"
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

export {signupUser,loginUser,logoutUser,FollowUnFollowUser};
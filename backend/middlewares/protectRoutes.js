import User from "../db/models/userModel.js";
import jwt from "jsonwebtoken";
const protectRoutes = async(req,res,next)=>{
  try{
  const token  =  req.cookies.jwt;
  if(!token)return res.status(401).json({error:"You are not logged in"});

  const decoded = jwt.verify(token,process.env.JWT_SECRET);

  const user = await User.findById(decoded.userId).select("-password");
  req.user = user;
  next(); //to continue the flow of execution

  }
  catch(error)
  {
        res.status(500).json({
      error: error.message
    });
    console.log("Error in protectRoutes middleware : ",error.message );
  }
}

export default protectRoutes;
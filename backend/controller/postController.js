import Post from "../db/models/postModel.js";
import User from "../db/models/userModel.js";
import {v2 as cloudinary} from 'cloudinary';
//for creating a post
const createPost = async(req,res)=>{
try{
      const {postedBy , text } = req.body;
      let {img} = req.body;

      if(!postedBy || !text)return res.status(400).json({error: "PostedBy and textfields are required"});

      const user = await User.findById(postedBy);
      if(!user){
        return res.status(404 ).json({error: "User not found"});
      }

      //authorization
      if(!req.user || user._id.toString() !== req.user._id.toString()){
        return res.status(401).json({error: " Unauthorized to create a Post"});
      }

      const maxLength = 500;
      if(text.length > maxLength){
        return res.status(400).json({error: `Text should be less than ${maxLength} characters`});
      }

      if(img)
      {
               const uploadedResponse = await cloudinary.uploader.upload(img);
               img = uploadedResponse.secure_url;

      }

      const newPost = new Post({postedBy , text , img});
      const savedPost = await newPost.save();

      return res.status(201).json(savedPost);

}
catch(err)
{

    res.status(500).json({error: err.message});
    console.log("Error in createPost: ",err.message );
}

}

//for getting a post
const getPost = async(req,res)=>{

    
   try {
    
         const postId = req.params.id;

        const post = await Post.findById(postId);

        if(!post)return res.status(404).json({error: "Post not found"});

        return res.status(200).json(post);
   
        
   } catch (err) {

    res.status(500).json({error: err.message});
    console.log("Error in getPost: ",err.message );
    
   }
}

//for deleting a post
const deletePost = async(req,res)=>{
      try {
            const post  = await Post.findById(req.params.id);

            if(!post)return res.status(404).json({error: "Post not found"});

            if(!req.user || post.postedBy.toString()!==req.user._id.toString()){
              return res.status(401).json({error: " You are Unauthorized to delete the post"});
            }

             if(post.img){
              const ImgId = post.img.split("/").pop().split(".")[0] ;
              await cloudinary.uploader.destroy(ImgId);
             }

            await Post.findByIdAndDelete(req.params.id);

            return res.status(200).json({message: "Post deleted successfully"});



      } catch (err) {

         res.status(500).json({error: err.message});
         console.log("Error in deletePost: ",err.message );
        
      }
}

//likeunliking a post
const LikeUnlikePost = async(req,res)=>{
  try{
     const post = await Post.findById(req.params.id);
     if(!post)return res.status(404).json({error: "Post not found"});



     if(post.likes.includes(req.user._id)){
      //unlike the post
          await Post.updateOne({_id:req.params.id},{$pull:{likes:req.user._id}});
          return res.status(200).json({message: "Post unliked successfully"});
     }
     else
     { 
       //like the post
        await Post.updateOne({_id:req.params.id},{$push:{likes:req.user._id}});
        return res.status(200).json({message: "Post liked successfully"});
           
     }
     
     
        
  }
  catch(err)
  {
         res.status(500).json({error: err.message});
         console.log("Error in LikeUnlikePost: ",err.message );
  }
}

//replying to a post
const replyToPost = async(req,res)=>{
  try {
    const postId = req.params.id;
    const {text} = req.body;
    const userId = req.user._id;
    const userProfilePic = req.user.profilePic;
    const username = req.user.username;

    if(!text) return res.status(400).json({error: "Text is required for replying"});


    let post = await Post.findById(postId);

    if(!post)return res.status(404).json({error: "Post not found"});

    const reply = {userId,text,userProfilePic,username};

    await Post.updateOne({_id:postId},{$push:{replies:reply}});

    post = await Post.findById(postId);
    res.status(200).json(post);
  } catch (err) {
        res.status(500).json({error: err.message});
         console.log("Error in replyToPost: ",err.message );
    
  }
}

//getting feed and posts
const getFeedPost = async(req,res)=>{
          try {
              const userId = req.user._id;
              const user = await User.findById(userId);
              if(!user)return res.status(404).json({error: "User not found"});

              const following = user.following;

              const feedPosts = await Post.find({postedBy:{$in:following}}).sort({createdAt:-1}); //sort in descending order of days(latest at the top)

              res.status(200).json(feedPosts);

          } catch (err) {
              res.status(500).json({error: err.message});
              console.log("Error in getFeedPost: ",err.message );
          }

          
}

const getUserPosts = async(req,res)=>{
  const {username} = req.params; 
  try {
     const user  = await User.findOne({username});
     if(!user)return res.status(404).json({error: "User not found"});

     const posts = await Post.find({postedBy:user._id}).sort({createdAt:-1});
     res.status(200).json(posts);
  } catch (error) {
     res.status(500).json({error: err.message});
  }
       
        
}

export {createPost,getPost,deletePost,LikeUnlikePost,replyToPost,getFeedPost,getUserPosts};
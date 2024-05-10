import Conversation from "../db/models/ConversationModel.js";
import Message from "../db/models/messageModel.js";
import { getRecipientSocketId, io } from "../socket/socket.js";
import {v2 as cloudinary} from 'cloudinary';

//to send a message
const sendMessage = async(req,res)=>{
  try {
    const {recipientId , message} = req.body;
    let {img}  = req.body;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({participants: {$all: [senderId,recipientId]}});

    if(!conversation){
      conversation = new Conversation({
        participants:[senderId,recipientId],
        lastMessage:{
          text:message,
          sender:senderId,
        }
      })
      await conversation.save();
    }

    if(img){
      const uploadedresponse  = await cloudinary.uploader.upload(img);
      img = uploadedresponse.secure_url;
    }

    const newMessage = new Message({
      conversationId: conversation._id,
      sender: senderId,
      text: message,
      img: img || "" 
    });

    await Promise.all([
      newMessage.save(),
      conversation.updateOne({
        lastMessage:{
          text: message,
          sender:senderId
        }
      })
    ])

   const recipientSocketId = getRecipientSocketId(recipientId);
   if(recipientSocketId)
    {
       io.to(recipientSocketId).emit('newMessage',newMessage);
    }
   

    res.status(201).json(newMessage);
    
  } catch (error) {
    res.status(500).json({error:error.message});
    console.log(error);
  }
}

//to get messages
const getMessages = async(req,res)=>{
  const {otherUserId} = req.params;
  const userId = req.user._id;
  try {
    const conversation = await Conversation.findOne({participants: {$all: [userId,otherUserId]}});

    if(!conversation)return res.status(404).json({error:"conversation not found"});
    const messages = await Message.find({conversationId:conversation._id}).sort({createdAt:1});

    res.status(200).json(messages);
    
  } catch (error) {
      res.status(500).json({error:error.message});
  }
}

//to get all conversations
const getConversations = async(req,res)=>{
  const userId = req.user._id;
  console.log(userId);
  try {
    const conversations = await Conversation.find({participants:userId}).populate({
      path:"participants",
      select:"username profilePic",
    });

    //remove the current user
    conversations.forEach(conversation=>{
      conversation.participants = conversation.participants.filter(participant=>participant._id.toString()!==userId.toString());
    })
    res.status(200).json(conversations);
  } catch (error) {

    res.status(500).json({error:error.message});
  }
}


export {sendMessage,getMessages,getConversations};
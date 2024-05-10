import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db/connectDB.js';
import cookieParser from 'cookie-parser';
import userRoutes   from './routes/userRoutes.js'
import  postRoutes  from './routes/postRoutes.js'
import  messageRoutes  from './routes/messageRoutes.js'
import {app,server} from './socket/socket.js'
dotenv.config(); 
import {v2 as cloudinary} from 'cloudinary';
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret:process.env.CLOUDINARY_API_SECRET 
});

connectDB();




const PORT = process.env.PORT;

//MIDDLEWARE(s)

app.use(express.urlencoded({ limit: '100mb',extended: true ,parameterLimit: 50000}));//to parse url encoded data
app.use(express.json({limit:'100mb'})); //to add body header to the req object
app.use(cookieParser()); //To use cookies in our application(especially in req object)

//Routes
app.use("/api/users",userRoutes);
app.use("/api/posts",postRoutes);
app.use("/api/messages",messageRoutes);


server.listen(5000,()=>{
        console.log(`server started at http://localhost:${PORT} heyy`);
});
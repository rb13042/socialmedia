import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db/connectDB.js';
import cookieParser from 'cookie-parser';

dotenv.config(); 

connectDB();

const app = express();


const PORT = process.env.PORT;

//MIDDLEWARE(s)
app.use(express.json()); //to add body header to the req object
app.use(express.urlencoded({ extended: true }));//to parse url encoded data
app.use(cookieParser()); //To use cookies in our application(especially in req object)

//Routes
app.use("api/users");

app.listen(5000,()=>{
        console.log(`server started at http://localhost:${PORT} heyy`);
});
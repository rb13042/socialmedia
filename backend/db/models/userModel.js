import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  username:{
    type:String,
    required:true,
    unique: true,
  },
  email:{
    type: String,
    required: true,
    uniqued: true,
  },
  password:{
    type: String,
    minLength:6,
    required: true,
  },
  profilePic:{
    type:String,
    default:"",
  },
  followers:{
    type:[String],
    default:[],
  },
  following:{
    type:[String],
    default:[],
  },
  bio:{
    type:String,
    default: "",
  }
},{
  timestamps:true,
});

//imposing the schema on the 'users' collection threads database
const User = mongoose.model("User",userSchema);

export default User;
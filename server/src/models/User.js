import mongoose from "mongoose";
import { type } from "os";

const userSchema = new mongoose.Schema({
    firstname:{
      type:String,
      default:null,
      required:true
    },
    lastname:{
      type:String,
      default:null,
      required:true
    },
    email:{
      type:String,
      required:true,
      unique:true
    },
    password:{
      type:String,
      required:true
    },
});

const User = mongoose.model("User",userSchema);
export default User;
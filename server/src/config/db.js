import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const DBConnection = async () => {
  mongoose.connection.on('connected',()=>{
      console.log("Database connected");
    })
    await mongoose.connect(`${process.env.MONGODB_URL}/onlineJudge`);
};

export default DBConnection;


import express from 'express';
import DBConnection from './config/db.js';
import authRouter from "./routes/authRoutes.js";
import userRouter from './routes/userRoutes.js';
import problemRouter from './routes/problemRoutes.js'
import runRoutes from './routes/runRoutes.js'
import submissionRouter from './routes/submissionRoutes.js';
import aiRouter from './routes/aiRoutes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser'

const app = express();
const port = process.env.PORT || 4000
DBConnection();


//middlewares
const allowedOrigins = ['http://localhost:5173']
app.use(cors({origin:allowedOrigins,credentials:true}));
app.use(express.json());  
app.use(cookieParser());   
app.use(express.urlencoded({ extended: true }));



app.get('/',(req,res)=>{res.send("API working")});

app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)
app.use("/api/problem",problemRouter);
app.use("/api/ai",aiRouter);
app.use("/run",runRoutes)
app.use("/api/submissions",submissionRouter)

app.get("/",(req,res)=>{
  res.send("this is get");
})
app.listen(port,()=>{
  console.log(`server running on ${port}`);
})
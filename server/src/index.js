
import express from 'express';
import DBConnection from './config/db.js';
import authRoutes from "./routes/authRoutes.js";
import problemRoutes from './routes/problemRoutes.js'
import runRoutes from './routes/runRoutes.js'
import submissionRoute from './routes/submissionRoute.js'
import cors from 'cors';
const app = express();

//middlewares
app.use(cors());
app.use(express.json());     
app.use(express.urlencoded({ extended: true }));

DBConnection();

app.use("/auth",authRoutes)
app.use("/problems",problemRoutes);
app.use("/run",runRoutes)
app.use("/submit",submissionRoute)

app.get("/",(req,res)=>{
  res.send("this is get");
})
app.listen(8000,()=>{
  console.log('server is listening on port 8000');
})
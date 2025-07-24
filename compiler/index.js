import express from 'express';
import runCode from './runCode.js';
const app = express();

app.use(express.json());         
app.use(express.urlencoded({ extended: true }));


app.get('/compiler',(req,res)=>res.send('compiler working'))
app.post('/hello',(req,res)=>{
  const {code} = req.body;
  res.send(code);
})

app.post('/compiler/run',runCode);

app.listen(8000,(req,res)=>{
  console.log('compiler running on 8000 port')
})

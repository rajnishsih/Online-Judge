
import axios from 'axios'

export const runUserCode = async (req, res)=>{
  const {language="cpp",code,input} = req.body;

  if(!code){
    return res.status(400).json({success:false,error:"Empty code body"});
  }
  const compilerUrl = process.env.compilerUrl;
    const {data} = await axios.post(compilerUrl+'/compiler/run',{language,code,input});
    
    res.json({
      ...data
    }) 
}
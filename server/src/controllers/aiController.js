import { callGeminiAPI } from "../services/aiService.js"

export const askAI = async(req,res)=>{
    const {code} = req.body;
    if(code === undefined || code.trim()===''){
      return res.json({success:false,message:"Empy code"});
    }

    try {
      const aiResponse = await callGeminiAPI(code);
      res.json({success:true,aiResponse});
    } catch (error) {
      return res.json({success:false,message:error.message});
    }
}
import runCode from '../../judge/runCode.js'


export const runUserCode = async (req, res)=>{
  const {language="cpp",code,input} = req.body;

  if(!code){
    return res.status(400).json({success:false,error:"Empty code body"});
  }
  try {
    const result = await runCode({language,code,input});
    res.json({
      success:true,
      ...result
    })
  } catch (error) {
    res.status(500).json({
      success:false,
      error:error.stderr || error.message || JSON.stringify(error)
    })
  }
}
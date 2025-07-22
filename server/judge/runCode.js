import { generateFile } from "./generateFile.js";
import executeCpp from "./executeCpp.js";
import generateInputFile from "./generateInputFile.js";

const runCode = async ({language,code,input})=>{
  const filePath = generateFile({ language, code });
  const inputFilePath = generateInputFile(input || "");
  const output = await executeCpp(filePath, inputFilePath);

  return{
    filePath,
    inputFilePath,
    output
  }
}

export default runCode

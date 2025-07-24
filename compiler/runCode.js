import { generateFile } from "./generateFile.js";
import executeCpp from "./executeCpp.js";
import generateInputFile from "./generateInputFile.js";
import { trimCppPath } from "./utils/trimErrorPath.js";

const executors = {
  cpp: executeCpp,
  // python: executePython,
  // py: executePython,
  // java: executeJava,
};

const runCode = async (req,res) => {
  const { language, code, input } = req.body;
  let filePath, inputFilePath;
  try {
    filePath = generateFile({ language, code });
    inputFilePath = generateInputFile(input || "");
    const executor = executors[language];
    if (!executor) return { success: false, errorType: "unknown", error: "Language not supported" };
    const output = await executor(filePath, inputFilePath);
    res.json( { success: true, output });
  } catch (error) {
   const errorRaw =
      typeof error === "string"
        ? error
        : error.stderr || error.message || JSON.stringify(error);
    const errorStr = trimCppPath(errorRaw);
    let errorType = "runtime";
    if (errorStr.toLowerCase().includes("error:")) errorType = "compilation";
    if (errorStr.toLowerCase().includes("time limit")) errorType = "tle";
    if (errorStr === "Language not supported") errorType = "unknown";
    
     res.json({ success: false, error: errorStr, errorType });
  }
};

export default runCode;

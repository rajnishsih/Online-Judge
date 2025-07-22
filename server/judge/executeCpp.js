import fs from 'fs';
import path, { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const outputPath = path.join(__dirname,"outputs")
if(!fs.existsSync(outputPath)){
  fs.mkdirSync(outputPath,{recursive:true})
}

const  executeCpp = async (filePath,inputFilePath) =>{
    const jobId = path.basename(filePath).split(".")[0];
    const outputFilename = `${jobId}.exe`;
    const exePath = path.join(outputPath,outputFilename);


    return new Promise((resolve,reject)=>{
      const command = `g++ ${filePath} -o ${exePath} && cd ${outputPath} && ${outputFilename} < ${inputFilePath}`;
      exec(command,(error,stdout,stderr)=>{
        if(error){
          reject({error,stderr});
        }
        if(stderr){
          reject(stderr);
        }
        resolve(stdout);
      })
    })

}
export default executeCpp;
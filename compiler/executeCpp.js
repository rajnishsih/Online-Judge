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
    
    const command = `g++ ${filePath} -o ${exePath} && cd ${outputPath} && ${outputFilename} < ${inputFilePath}`;

   return new Promise((resolve, reject) => {
    exec(command, { timeout: 3000 }, (error, stdout, stderr) => {
      if (error) {
        if (error.killed || error.signal === 'SIGTERM' || error.code === null) {
          return reject({ error: "Time Limit Exceeded", stdout, stderr });
        }
        return reject({ error, stdout, stderr });
      }
      resolve(stdout);
    });
  });

}
export default executeCpp;
import { dir } from 'console';
import fs from 'fs';
import path from 'path';
import { v4 as uuid } from 'uuid';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dirInputs = path.join(__dirname,"inputs");

if(!fs.existsSync(dirInputs)){
  fs.mkdirSync(dirInputs,{recursive:true});
}

const generateInputFile = (input)=>{
  const jobId = uuid();
  const inputFilename = `${jobId}.txt`;
  const inputFilePath = path.join(dirInputs,inputFilename);
  fs.writeFileSync(inputFilePath,input);
  return inputFilePath;
}

export default generateInputFile
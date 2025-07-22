import { dir } from 'console';
import fs from 'fs';
import path from 'path';
import { v4 as uuid } from 'uuid';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const dirCodes = path.join(__dirname,"codes");

if(!fs.existsSync(dirCodes)){
  fs.mkdirSync(dirCodes,{recursive:true});
}

const generateFile = ({language,code})=>{
    const jobId = uuid();
    const fileName = `${jobId}.${language}`;
    const filePath = path.join(dirCodes,fileName);
    fs.writeFileSync(filePath,code);
    return filePath
}
export {generateFile};
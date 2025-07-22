import express from 'express';
import { runUserCode } from '../controllers/runCodeController.js';
const router = express();

router.post("/",runUserCode);


export default router;
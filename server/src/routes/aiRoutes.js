import express from 'express'
import { askAI } from '../controllers/aiController.js';

const aiRouter = express.Router();

aiRouter.post('/code-review',askAI)


export default aiRouter;
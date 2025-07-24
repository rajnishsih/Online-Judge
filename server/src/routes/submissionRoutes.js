import express from 'express';
import { getAllSubmission, submission } from '../controllers/submissionController.js';
import userAuth from '../middleware/userAuth.js';
const submissionRouter = express.Router();


submissionRouter.post('/:slug',userAuth,submission);
submissionRouter.get('/all/:slug',userAuth,getAllSubmission);

export default submissionRouter
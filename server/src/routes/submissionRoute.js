import express from 'express';
import { submission} from '../controllers/submissionController.js';
const router = express();

router.post("/:slug",submission)

export default router;
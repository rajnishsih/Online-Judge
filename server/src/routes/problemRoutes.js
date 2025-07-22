import express from 'express';
const router = express.Router();
import { getAllProblems,getProblemBySlug } from '../controllers/problemController.js';

router.get("/",getAllProblems)
router.get("/:slug",getProblemBySlug)

export default router
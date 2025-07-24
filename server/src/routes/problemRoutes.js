import express from 'express';
import { getAllProblems,getProblemBySlug } from '../controllers/problemController.js';

const problemRouter = express.Router();
problemRouter.get("/all",getAllProblems)
problemRouter.get("/:slug",getProblemBySlug)

export default problemRouter
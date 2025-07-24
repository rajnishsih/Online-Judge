import express from "express";
import fs from "fs/promises";
import path from "path";

import submissionModel from "../models/submissionModel.js";
import axios from'axios';

const PROBLEMS_DIR_PATH = path.join(process.cwd(), "problems");

export const submission = async (req, res) => {
  const { slug } = req.params;
  const { language, code } = req.body;
  const userId = req.userId;
  const problemDirPath = path.join(PROBLEMS_DIR_PATH, slug);
  const testcasesDirPath = path.join(problemDirPath, "testcases");
  const compilerUrl = process.env.compilerUrl;

  try {
    let i = 1;
    let verdict = "Accepted";
    const results = [];

    while (true) {
      let input, expected;
      
      try {
        input = await fs.readFile(path.join(testcasesDirPath, `${i}.in`), "utf-8");
        expected = await fs.readFile(path.join(testcasesDirPath, `${i}.out`), "utf-8");
      } catch {
        break;
      }

     
      const {data} = await axios.post(compilerUrl+'/compiler/run',{language,code,input});
      const result = data;

      if (!result.success) {
        if (result.errorType === "compilation") {
          verdict = "Compilation Error";
        } else if (result.errorType === "tle") {
          verdict = "Time Limit Exceeded";
        } else if (result.errorType === "runtime") {
          verdict = "Runtime Error";
        } else {
          verdict = "Unknown Error";
        }

        results.push({
          test: i,
          passed: false,
          expected: expected ? expected.trim() : "",
          received: "",
          error: result.error,
        });
        break;
      }

      const outputStr = result.output ?? "";
      const passed = (outputStr.trim() === expected.trim());

      results.push({
        test: i,
        passed,
        expected: expected.trim(),
        received: outputStr.trim(),
      });

      if (!passed) {
        verdict = "Wrong Answer";
        break;
      }

      i++;
    }

    const newSubmission = await submissionModel.create({
      userId,
      problemSlug: slug,
      language,
      code,
      verdict,
    });

    res.json({
      success: true,
      verdict,
      results,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};



// getting all submission of particular problem
export const getAllSubmission = async (req, res) => {
  try {
    const userId = req.userId;
    const { slug } = req.params;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!slug) {
      return res.status(400).json({ success: false, message: "Problem slug is required" });
    }

    const submissions = await submissionModel.find({
      userId,
      problemSlug: slug,
    })
    .sort({ createdAt: -1 });

    res.json({
      success: true,
      submissions,
    });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.json({ success: false, message: "Internal server error" });
  }
};


import express from "express";
import fs from "fs/promises";
import path from "path";
import runCode from "../../judge/runCode.js";

const PROBLEMS_DIR_PATH = path.join(process.cwd(), "problems");

export const submission = async (req, res) => {
  const { slug } = req.params;
  const { language, code } = req.body;

  const problemDirPath = path.join(PROBLEMS_DIR_PATH, slug);
  const testcasesDirPath = path.join(problemDirPath, "testcases");

  let i = 1;
  let allPassed = true;
  const results = [];

  while (true) {
    try {
      const input = await fs.readFile(
        path.join(testcasesDirPath, `${i}.in`),
        "utf-8"
      );
      const expected = await fs.readFile(
        path.join(testcasesDirPath, `${i}.out`),
        "utf-8"
      );

      const result = await runCode({ language, code, input });
      const output = result.output;

      const passed = output.trim() === expected.trim();

      results.push({
        test: i,
        passed,
        expected: expected.trim(),
        received: output.trim(),
      });

      if (!passed) allPassed = false;
      i++;
    } catch (error) {
      break; // No more test cases
    }
  }

  res.json({
    success: true,
    verdict: allPassed ? "Accepted" : "Wrong Answer",
    results,
  });
};

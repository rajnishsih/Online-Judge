import fs from "fs/promises"; // ✅ Use fs/promises for async/await
import path from "path";

const PROBLEMS_DIR_PATH = path.join(process.cwd(),  "problems");

export const getAllProblems = async (req, res) => {
  try {
    const problemDirs = await fs.readdir(PROBLEMS_DIR_PATH); // ✅ async/await compatible
    const allProblems = [];

    for (const dir of problemDirs) {
      const metaPath = path.join(PROBLEMS_DIR_PATH, dir, "metadata.json"); // ✅ path.join not path.json
      const data = await fs.readFile(metaPath, "utf-8");
      const meta = JSON.parse(data);
      allProblems.push({ slug: dir, ...meta });
    }

    res.json(allProblems);
  } catch (error) {
    console.error("Error loading problems:", error);
    res.status(500).json({ error: "Failed to load problems." });
  }
};

export const getProblemBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    const metaPath = path.join(PROBLEMS_DIR_PATH, slug, "metadata.json");
    const statementPath = path.join(PROBLEMS_DIR_PATH, slug, "problem.md");

    const metaData = await fs.readFile(metaPath, "utf-8");
    const meta = JSON.parse(metaData);
    const statement = await fs.readFile(statementPath, "utf-8");

    res.json({ slug, ...meta, statement });
  } catch (error) {
    console.error("Problem not found:", error);
    res.status(404).json({ error: "Problem not found." });
  }
};

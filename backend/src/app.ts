import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { log } from "console";

dotenv.config();

const app = express();
const PORT = 3000;
const BASE_DIR = path.resolve(process.cwd(), process.env.BASE_DIR as string);

// app.use(cors({
//   origin: "http://localhost:5173"
// }));

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || origin === "null" || origin === "file://") {
        callback(null, true);
      } else {
        callback(null, true); // or check allowed origins here
      }
    },
  })
);

app.get("/api/files", (req, res) => {
  try {
    let requestedPath = String(req.query.path || "."); // fallback to current folder

    // Remove any leading slashes to make it relative
    if (requestedPath.startsWith("/")) {
      requestedPath = requestedPath.slice(1);
      console.log(requestedPath);
    }

    const safePath = path.resolve(BASE_DIR, requestedPath);

    console.log(safePath);

    if (!safePath.startsWith(BASE_DIR)) {
      return res.status(400).json({ error: "Access denied" });
    }

    const files = fs
      .readdirSync(safePath, { withFileTypes: true })
      .map((file) => ({
        name: file.name,
        isDirectory: file.isDirectory(),
        ext: file.isFile() ? path.extname(file.name) : null,
      }));

    res.json({ path: requestedPath || ".", files });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to read directory" });
  }
});

app.get("/api/file", async (req, res) => {
  const { filePath } = req.query;

  if (!filePath) {
    return res.status(400).json({ error: "File path is required" });
  }

  const safePath = path.resolve(BASE_DIR, filePath as string);

  console.log(safePath);

  if (!safePath.startsWith(BASE_DIR)) {
    return res.status(400).json({ error: "Access denied" });
  }

  try {
    const content = await fs.promises.readFile(safePath, "utf-8");
    res.json({ path: filePath, content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to read file" });
  }
});
app.put("/api/file", async (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", async () => {
    try {
      const { filePath, content } = JSON.parse(body);
      if (!filePath || content === undefined) {
        return res.status(400).json({ error: "File path and content are required" });
      }

      const safePath = path.resolve(BASE_DIR, filePath as string);

      console.log(safePath);

      if (!safePath.startsWith(BASE_DIR)) {
        return res.status(400).json({ error: "Access denied" });
      }
      // update file content by removing old content and writing new content
      await fs.promises.unlink(safePath);
      await fs.promises.writeFile(safePath, content, "utf-8");
      res.json({ message: "File updated successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to update file" });
    }
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

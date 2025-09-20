import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import dotenv from "dotenv"

dotenv.config()

const app = express();
const PORT = 3000;
const BASE_DIR = path.resolve(process.cwd(), process.env.BASE_DIR as string);

// app.use(cors({
//   origin: "http://localhost:5173"
// }));

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || origin === 'null' || origin === 'file://') {
      callback(null, true);
    } else {
      callback(null, true); // or check allowed origins here
    }
  }
}));


app.get("/api/files", (req, res) => {
  try {
    let requestedPath = String(req.query.path || "."); // fallback to current folder
    
    // Remove any leading slashes to make it relative
    if (requestedPath.startsWith("/")) {
      requestedPath = requestedPath.slice(1);
      console.log(requestedPath)
    }

    const safePath = path.resolve(BASE_DIR, requestedPath);

    console.log(safePath)

    if (!safePath.startsWith(BASE_DIR)) {
      return res.status(400).json({ error: "Access denied" });
    }

    const files = fs.readdirSync(safePath, { withFileTypes: true }).map(file => ({
      name: file.name,
      isDirectory: file.isDirectory()
    }));

    res.json({ path: requestedPath || ".", files });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to read directory" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

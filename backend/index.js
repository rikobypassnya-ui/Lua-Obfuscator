import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import archiver from "archiver";
import dotenv from "dotenv";
import { obfuscate } from "./obfuscator.js";
import { checkApiKey } from "./auth.js";

dotenv.config();

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());

app.post("/api/encode", checkApiKey, upload.single("file"), (req, res) => {
  const input = fs.readFileSync(req.file.path, "utf8");
  const output = obfuscate(input);

  const zipPath = "result.zip";
  const archive = archiver("zip");

  const stream = fs.createWriteStream(zipPath);
  archive.pipe(stream);
  archive.append(output, { name: "obfuscated.lua" });
  archive.finalize();

  stream.on("close", () => {
    res.download(zipPath, () => {
      fs.unlinkSync(zipPath);
      fs.unlinkSync(req.file.path);
    });
  });
});

app.listen(process.env.PORT, () => {
  console.log("Backend running on port", process.env.PORT);
});

import express from "express";
import upload from "../middleware/upload.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

// POST /api/upload  — admin only, field name "images", up to 6 files
router.post("/", protect, admin, upload.array("images", 6), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const urls = req.files.map((file) => file.path);

    res.json({ urls });
  } catch (error) {
    console.error("Upload route error:", error);
    res.status(500).json({ message: error.message || "Upload failed" });
  }
});

// Multer/Cloudinary error handler (file too large, too many files, wrong type)
router.use((err, req, res, next) => {
  if (err) {
    console.error("Upload middleware error:", err);
    return res.status(400).json({ message: err.message || JSON.stringify(err) || "Upload failed" });
  }
  next();
});

export default router;
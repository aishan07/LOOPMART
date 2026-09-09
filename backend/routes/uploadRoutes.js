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

    const urls = req.files.map(
      (file) => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`
    );

    res.json({ urls });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Multer error handler (file too large, too many files, wrong type)
router.use((err, req, res, next) => {
  if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
});

export default router;
import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import {
  updateProfile,
  uploadProfilePhoto,
  getFullProfile,
} from "../controllers/profileController.js";
import { protect } from "../middlewares/authMiddleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(__dirname, "../uploads");
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `profile-${req.user._id}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Apenas imagens são permitidas!"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
  fileFilter: fileFilter,
});

const router = express.Router();

router.get("/", protect, getFullProfile);
router.put("/update", protect, updateProfile);
router.post("/upload-photo", protect, upload.single("profilePhoto"), uploadProfilePhoto);

export default router;

import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import {
  updateProfile,
  uploadProfilePhoto,
  getFullProfile,
  getAllUsers,
} from "../controllers/profileController.js";
import { protect } from "../middlewares/authMiddleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Apenas imagens são permitidas!"), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});

const router = express.Router();

router.get("/", protect, getFullProfile);
router.get("/all", protect, getAllUsers); // <=== nova rota aqui
router.put("/update", protect, updateProfile);
router.post("/upload-photo", protect, upload.single("profilePhoto"), uploadProfilePhoto);

export default router;

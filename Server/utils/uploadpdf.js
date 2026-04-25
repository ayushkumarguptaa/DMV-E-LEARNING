import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const pdfStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "dmv-learning/pdfs",     // Folder in Cloudinary
    resource_type: "raw",            // 🔴 IMPORTANT for PDF
    allowed_formats: ["pdf"],        // Only PDF allowed
  },
});

export const uploadPdf = multer({
  storage: pdfStorage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB max PDF size (change if needed)
  },
});
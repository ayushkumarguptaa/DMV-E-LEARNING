import multer from "multer";
import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import jwt from "jsonwebtoken";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});



export const IsLoggedIn = (req, res, next) =>{
  const token = req.cookies.token; 
  console.log(req.cookies.token)

  if (!token) {
    return res.status(401).json({ message: "Not logged in" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}


// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: "restaurant-gallery",  // Folder name in Cloudinary
//     allowed_formats: ["jpg", "jpeg", "png", "webp"],
//   },
// });

// export const upload = multer({ storage });



const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "DMV-Pictures",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

export const upload = multer({ storage });
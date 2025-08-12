// utils/multer.js
import multer from "multer";
import storage from "./cloudinaryStorage.js";

const upload = multer({ storage });

export default upload;

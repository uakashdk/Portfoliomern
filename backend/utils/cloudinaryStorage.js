// utils/cloudinaryStorage.js
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudnary.js"; // .js extension compulsory in ESM (type: module)

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "your-folder-name",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

export default storage;

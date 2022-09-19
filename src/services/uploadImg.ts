import { Response } from "express";
import cloudinary from "cloudinary";

const uploadImg = async (imagePath: string, res: Response, next: Function) => {
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
    // width: 1000,
    // height: 1000,
    // crop: "limit",
  };

  // const extensionIndex = imagePath.lastIndexOf(".");
  // const imgToWebp = imagePath.slice(0, extensionIndex) + ".webp";
  // NEW PARAMS TO TEST
  cloudinary.v2.uploader.upload(imagePath, options, (err, result) => {
    if (err) return res.status(500).json({ message: err });
    else return next(result);
  });
};

export default uploadImg;

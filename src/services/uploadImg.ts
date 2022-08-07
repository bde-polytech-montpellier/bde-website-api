import { Response } from "express";
import cloudinary from "cloudinary";

const uploadImg = async (imagePath: string, res: Response, next: Function) => {
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  };

  // Upload the image
  cloudinary.v2.uploader.upload(imagePath, options, (err, result) => {
    if (err) return res.status(500).json({ message: err });
    else return next(result);
  });
};

export default uploadImg;

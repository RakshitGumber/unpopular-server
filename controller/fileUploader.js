import cloudinary from "cloudinary";

const uploadImage = (req, res) => {
  if (!req.file) res.status(204).json({ message: "no file found" });

  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    cloudinary.UploadStream.upload_stream((result) =>
      res.status(201).json({ user_avatar_url: result.secure_url })
    ).end(req.file.buffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default uploadImage;

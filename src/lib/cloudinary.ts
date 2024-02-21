import { v2 as cloudinary } from "cloudinary";

export default new (class CloudinaryConfig {
  config() {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });
  }

  async destination(image: string) {
    try {
      const cloudResponse = await cloudinary.uploader.upload(
        "src/upload/" + image,
        { folder: "threads-clone" }
      );
      console.log(`cloudResponse`, cloudResponse);
      return cloudResponse.secure_url;
    } catch (error) {
      console.log(`ERROR`, error);
      throw error;
    }
  }
})();

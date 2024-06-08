import { v2 as cloudinary } from "cloudinary";

export default new (class CloudinaryConfig {
  config() {
    cloudinary.config({
      cloud_name: "dipdenbch",
      api_key: "954663778361164",
      api_secret: "sRSooV_rYkEyzvgL8Qip92zpfhM",
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

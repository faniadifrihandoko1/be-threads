import * as express from "express";
import authController from "../controller/authController";
import threadController from "../controller/threadController";
import { authentication } from "../middleware/authentication";
import replyController from "../controller/replyController";
import likeController from "../controller/likeController";
import userController from "../controller/userController";
import followController from "../controller/followController";
import uploadFile from "../middleware/uploadFile";

const Route = express.Router();

// Auth
Route.post("/register", authController.register);
Route.post("/login", authController.login);

// User

Route.patch(
  "/user/:id",

  uploadFile.uploadImage("photo_profile"),
  userController.update
);
Route.patch(
  "/user/photo-cover/:id",

  uploadFile.uploadImage("photo_cover"),
  authentication,
  userController.updateCover
);
Route.get(
  "/user/username/:username",
  authentication,
  userController.getUserById
);
Route.get("/user/get-current", authentication, userController.getCurrent);
Route.get("/check", authentication, userController.check);

// Thread
Route.get("/thread", threadController.findAll);
Route.get("/threadUser", authentication, threadController.getThreadByUser);
Route.get("/thread/:id", authentication, threadController.getThreadById);
Route.post(
  "/thread",
  authentication,
  uploadFile.uploadImage("image"),
  threadController.create
);
Route.patch("/thread/:id", threadController.update);
Route.delete("/thread/:id", authentication, threadController.delete);

// Reply
Route.get("/thread/reply", replyController.getAll);
Route.post(
  "/thread/reply/:id",
  uploadFile.uploadImage("image"),
  authentication,
  replyController.create
);
Route.delete("/thread/reply/:id", authentication, replyController.delete);

// like
Route.get("/thread/like", authentication, likeController.getall);
Route.post("/thread/like/:id", authentication, likeController.create);
Route.get("/thread/:id/like", authentication, likeController.getLikeByUser);

// Follow
Route.get("/follow", authentication, followController.find);
Route.post("/follow", authentication, followController.follow);

export default Route;

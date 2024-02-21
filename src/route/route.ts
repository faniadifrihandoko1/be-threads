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
Route.put("/user/:id", userController.update);
Route.get("/user/get-current", authentication, userController.getCurrent);
Route.get("/check", authentication, userController.check);

// Thread
Route.get("/thread", threadController.findAll);
Route.post(
  "/thread",
  authentication,
  uploadFile.uploadImage("image"),
  threadController.create
);
Route.patch("/thread/:id", threadController.update);
Route.delete("/thread/:id", threadController.delete);

// Reply
Route.get("/thread/reply", replyController.getAll);
Route.post("/thread/reply", authentication, replyController.create);
Route.delete("/thread/reply/:id", authentication, replyController.delete);

// like
Route.get("/thread/like", authentication, likeController.getall);
Route.post("/thread/like", authentication, likeController.create);

// Follow
Route.post("/user/follow", authentication, followController.kitaNgeFollowOrang);
export default Route;

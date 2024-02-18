import * as express from "express";
import authController from "../controller/authController";
import threadController from "../controller/threadController";
import { authentication } from "../middleware/authentication";
import replyController from "../controller/replyController";

const Route = express.Router();

// Auth
Route.post("/register", authController.register);
Route.post("/login", authController.login);

// Thread
Route.get("/thread", threadController.findAll);
Route.post("/thread", authentication, threadController.create);
Route.patch("/thread/:id", threadController.update);
Route.delete("/thread/:id", threadController.delete);

// Reply
Route.get("/thread/reply", replyController.getAll);
Route.post("/thread/reply", authentication, replyController.create);
export default Route;

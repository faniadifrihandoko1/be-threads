import * as express from "express";
import authController from "../controller/authController";
import threadController from "../controller/threadController";

const Route = express.Router();

Route.post("/register", authController.register);
Route.post("/login", authController.login);
Route.get("/thread/find", threadController.findAll);
Route.post("/thread/create", threadController.create);
Route.patch("/thread/update/:id", threadController.update);
Route.delete("/thread/delete/:id", threadController.delete);
export default Route;

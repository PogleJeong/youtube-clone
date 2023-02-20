import express from "express";
import { join, login } from "../controllers/userController";
import { trending } from "../controllers/videoController";

const globalRouter = express.Router();

globalRouter.get("/join", join);
globalRouter.get("/login",login);

globalRouter.get("/", trending);


export default globalRouter; // 다른 js 에서 import 하면 기본적으로 globalRouter 가 import 됨.
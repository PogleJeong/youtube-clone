import express from "express";
import { getJoin, postJoin, getLogin, postLogin } from "../controllers/userController";
import { home, search } from "../controllers/videoController";
import { publicOnlyMiddleware } from "../middlewares";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.route("/join").all(publicOnlyMiddleware).get(getJoin).post(postJoin);
rootRouter.route("/login").all(publicOnlyMiddleware).get(getLogin).post(postLogin);
rootRouter.get("/search", search);
export default rootRouter; // 다른 js 에서 import 하면 기본적으로 rootRouter 가 import 됨.
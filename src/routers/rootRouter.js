import express from "express";
import { getJoin, postJoin, login } from "../controllers/userController";
import { home, search } from "../controllers/videoController";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.route("/join").get(getJoin).post(postJoin);
rootRouter.get("/login",login);
rootRouter.get("/search", search);
export default rootRouter; // 다른 js 에서 import 하면 기본적으로 rootRouter 가 import 됨.
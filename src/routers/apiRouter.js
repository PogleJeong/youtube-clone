// 랜더링하지 않는 view 를 위한 router
import express from "express";
import { registerView, removeComment, writeComment } from "../controllers/videoController";

const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/view", registerView);
apiRouter.post("/videos/:id([0-9a-f]{24})/comment", writeComment);
apiRouter.delete("/videos/:id([0-9a-f]{24})/remove/comment", removeComment);

export default apiRouter;
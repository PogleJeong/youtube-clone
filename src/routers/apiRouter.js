// 랜더링하지 않는 view 를 위한 router
import express from "express";
import { registerView, removeComment, thumbDown, thumbUp, updateComment, writeComment } from "../controllers/videoController";

const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/view", registerView);
apiRouter.post("/videos/:id([0-9a-f]{24})/comment", writeComment);
apiRouter.post("/videos/:id([0-9a-f]{24})/thumb-up", thumbUp);
apiRouter.post("/videos/:id([0-9a-f]{24})/thumb-down", thumbDown);
apiRouter.delete("/videos/:id([0-9a-f]{24})/remove/comment", removeComment);
apiRouter.post("/videos/:id([0-9a-f]{24})/update/comment", updateComment);

export default apiRouter;
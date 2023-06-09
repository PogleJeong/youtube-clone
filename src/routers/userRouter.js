import express from "express";
import { remove, logout, see, getEdit, postEdit, startGitHubLogin, finishGitHubLogin, getChangePassword, postChangePassword } from "../controllers/userController"; // controller
import { avatarUpload, protectorMiddleware, publicOnlyMiddleware } from "../middlewares";

const userRouter = express.Router();

userRouter.get('/logout', protectorMiddleware, logout);
userRouter
    .route('/edit')
    .all(protectorMiddleware)
    .get(getEdit)
    // multer middleware 사용
    // input type=file name="avatar"
    .post(avatarUpload.single("avatar"), postEdit);
userRouter.get('/github/start', publicOnlyMiddleware,startGitHubLogin);
userRouter.get('/github/callback', publicOnlyMiddleware, finishGitHubLogin);
userRouter
    .route('/change-password')
    .all(protectorMiddleware)
    .get(getChangePassword).post(postChangePassword);
userRouter.get('/:id', see);

export default userRouter;

//all : 어떤 http method 를 사용하던지 middleware 를 적용시켜주는 메서드
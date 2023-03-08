import express from "express";
import { edit, remove, logout, see, postEdit } from "../controllers/userController"; // controller
import { avatarUpload } from "../middlewares";

const userRouter = express.Router();

userRouter.get('/logout', logout);
userRouter.route('/edit').post(avatarUpload.single("avatar"), postEdit);
userRouter.get('/remove', remove);
userRouter.get(':id', see);

export default userRouter;
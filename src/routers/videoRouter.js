import express from "express";
import { watch, getEdit, postEdit } from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/:id(\\d+)", watch);

videoRouter.get("/:id(\\d+)/edit", getEdit);
videoRouter.post("/:id(\\d+)/edit", postEdit);
// videoRouter.route("/:id(\\d+)/edit").get(getEdit).post(postEdit)


export default videoRouter;

/* 
    :param = url 안에 변수를 포함할 수 있게 해줌. ${} 의 역할
    url 안에 param 이 없는 get 함수가 param 이 있는 get 함수보다 위에 있어야함.
    하지만 express 에서 (예를들어) videos/aaaaa 가 있다면 aaaaa가 변수로 들어갔는지
    변수가 아닌지 구별할 수 가 없음 이를 해결하기 위해 정규식이 들어감.
*/
 
/*
    정규식은 개발자에게 유용함.

    nico\w+ = nico로 시작하는 모든 문자열 (\\w+)
    \d+ = 숫자만 허용 -> (\\d+)
*/
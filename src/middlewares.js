import multer from "multer";

export const localsMiddleware = (req, res, next) => {
    // res.locals 은 전역변수로 사용되어 모든 페이지에서 사용가능
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.siteName = "Wetube";
    res.locals.loggedInUser = req.session.user;
    next();
}

export const avatarUpload = multer({
    dest: "uploads/avatars/", // 저장할 위치(destination)는 server의 uploads 파일
    limits: {
        fileSize: 30000000,
    },
});

export const videoUpload = multer({
    dest:"uploads/videos/",
    limits: {
        fileSize: 200000000,
    },
});
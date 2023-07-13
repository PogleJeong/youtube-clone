import multer from "multer";

// 미들웨어를 통해 컨트롤러 사이에 공통으로 처리할 기능구현
export const localsMiddleware = (req, res, next) => {
    // res.locals 은 전역변수로 사용되어 모든 페이지에서 사용가능
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.siteName = "Wetube";
    res.locals.loggedInUser = req.session.user;
    next();
}

// 로그인하지 않은 유저는 특정페이지로 이동할 수 없도록 보호해주는 미들웨어
export const protectorMiddleware = (req, res, next) => {
    if (req.session.loggedIn) {
        next();
    } else {
        return res.redirect("/login");
    }
}

// 로그인하지 않은 유저만 특정페이지로 이동할 수 있도록 보호해주는 미들웨어
export const publicOnlyMiddleware = (req, res, next) => {
    if (!req.session.loggedIn) {
        next();
    } else {
        return res.render("/");
    }
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
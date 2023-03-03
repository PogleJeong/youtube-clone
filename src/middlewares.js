export const localsMiddleware = (req, res, next) => {
    // res.locals 은 전역변수로 사용되어 모든 페이지에서 사용가능
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.siteName = "Wetube";
    res.locals.loggedInUser = req.session.user;
    next();
}
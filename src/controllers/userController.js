import User from "../models/User";
import bcrypt from "bcrypt";
export const getJoin = (req, res) => {
    res.render("join", {pageTitle: "Join"});
}
export const postJoin = async (req, res) => {
    const { name, username, email, password, password2, location } = req.body;
    
    // 비밀번호 확인
    // res.status(status code) 크롬의 저장여부는 code 200일때 계속 발생하므로 막기위함
    if (password !== password2) {
        return res.status(400).render("join", {
            pageTitle, 
            errorMessage: "Password confirmation does not match",
        })
    }

    // 중복체크
    const exists = await User.exists({$or: [{ username }, { email }]})
    if (exists) {
        return res.status(400).render("join", {
            pageTitle,
            errorMessage: "This username/email is already token.",
        })
    }
    try{
        await User.create({
            name,
            username,
            email,
            password,
            location,
        });
    }catch(error) {
        return res.status(400).render("join", {
            pageTitle: "Join",
            errorMessage: error._message,
        })
    };
    return res.redirect("/");
}
export const getLogin = (req, res) => 
    res.render("login", { pageTitle: "Login" });

export const postLogin = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    // check if account exists
    if (user) {
        return res.status(400)
        .render("/login", { 
            pageTitle: "Login", 
            errorMessage:"An account with this username does not exists."
        });
    }
    
    // check if password correct
    // hashing password 가 같은지 확인 (bcrypt.compare)
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
        return res.status(400)
        .render("/login", { 
            pageTitle: "Login", 
            errorMessage:"Wrong password",
        });
    };
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
}

export const logout = (req, res) => res.send("Log Out");
export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Remove User");
export const see = (req, res) => res.send("See User");
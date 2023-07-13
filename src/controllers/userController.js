import User from "../models/User";
import bcrypt from "bcrypt";
export const getJoin = (req, res) => {
    res.render("join", {pageTitle: "Join"});
}
export const postJoin = async (req, res) => {
    const { name, username, email, password, password2, location } = req.body;
    const pageTitle = "Join";
    // 비밀번호 확인
    // res.status(status code) 크롬의 저장여부는 code 200일때 계속 발생하므로 막기위함
    if (password !== password2) {
        return res.status(400).render("join", {
            pageTitle: "join", 
            errorMessage: "Password confirmation does not match",
        })
    }
 
    // 중복체크
    const exists = await User.exists({$or: [{ username }, { email }]});
    if (exists) {
        return res.status(400).render("join", {
            pageTitle,
            errorMessage: "This username/email is already token.",
        });
    };
    await User.create({
        name,
        username,
        email,
        password,
        location,
    });

    return res.redirect("/login");
}
export const getLogin = (req, res) => 
    res.render("login", { pageTitle: "Login" });

export const postLogin = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({username, socialOnly: false});
    // check if account exists
    if (!user) {
        return res.render("login", { 
            pageTitle: "Login",
            errorMessage:"An account with this username does not exists."
        });
    }
    
    // check if password correct
    // hashing password 가 같은지 확인 (bcrypt.compare)
    const ok = bcrypt.compare(password, user.password);
    if (!ok) {
        return res.status(400)
        .render("login", { 
            pageTitle: "Login", 
            errorMessage:"Wrong password",
        });
    };
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
}

export const logout = (req, res) => {
    req.session.destroy(); // 세션연결끊기
    return res.redirect("/");
}

export const getEdit = (req, res) => {
    // middleware 에 있는 loggedInUser 를 가져와서 사용
    return res.render("edit-profile", { pageTitle: "Edit Profile"});
}

export const postEdit = async (req, res) => {
    const {
      session: {
        user: { _id, avatarUrl, email: sessionEmail, username: sessionUsername },
      },
      body: { 
        name: formName, email: formEmail, username: formUsername, location: formLocation
      },
      file,
    } = req;
    /*
        코드챌린지: 유저정보 업데이트 시 기능보완
        1. 업데이트하려는 정보가 중복되는 정보라면? email, username 경우(unique)
        2. 만약 업데이트한 값중에 바뀌지 않았을 경우 email, username 등이 바뀌지 않을 경우 고려.
    */
    if (sessionEmail !== formEmail) {
        const emailExist = await User.findOne({email});
        if (emailExist) {
            return res.render("edit-profile", { 
                pageTitle: "Edit Profile",
                errorMessage: "This email is already token",
            });
        }
    }

    if (sessionUsername !== formUsername) {
        const usernameExist = await User.findOne({username});
        if (usernameExist) {
            return res.render("edit-profile", { 
                pageTitle: "Edit Profile",
                errorMessage: "This username is already token",
            });
        }
    }
    /*
        인자1: 찾을 조건
        인자2: 업데이트할 데이터
        인자3: 옵션 (new) false는 update 이전 DB 반환, true 는 update 이후 DB 반환
        반환 : 업데이트 전/후 DB 데이터
    */
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        // 새파일업로드 유무
        name: formName,
        email: formEmail,
        username: formUsername,
        avatarUrl: file ? file.path : avatarUrl,
        location: formLocation,
      },
      { new: true }
    );
    req.session.user = updatedUser; // DB 업데이트 이후 세션도 바꿔주어야함.
    return res.redirect("/users/edit");
};

// github 로그인을 위한 컨트롤러 (뷰에서 직접링크하지 않고 컨트롤러에서 이동)
export const startGitHubLogin = (req, res) => {
    // new URLSearchParams(Object).toString() 사용
    const baseUrl = `https://github.com/login/oauth/authorize`;
    const config = {
        client_id: process.env.GH_CLIENT,
        allow_signup: false,
        scope: "read:user user:email", // 요청할 유저정보
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl);
};


export const finishGitHubLogin = async(req, res) => {
    const baseUrl = "https://github.com/login/oauth/access_token";
    const config = {
        client_id: process.env.GH_CLIENT,
        client_secret: process.env.GH_SECRET,
        code: req.query.code,
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    
    // access token 가져오기
    // node js 에서는 일반 js 인 fetch 를 사용할 수 없다. (그런데 nodejs 18.0.0 부터는 탑재되어있음)
    // npm install node-fetch@2.6.1
    const tokenRequest = await (await fetch(finalUrl, {
            method: "POST",
            headers: {
                Accept: "application/json",
            },
        })
    ).json();
    // 확인하기 : res.send(JSON.stringify(tokenRequest));
    
    // access token 을 사용하여 유저정보 가져오기
    if ("access_token" in tokenRequest) {
        const { access_token } = tokenRequest;
        const apiUrl = "https://api.github.com"; 
        const userData = await (await fetch(`${apiUrl}/user`, {
                headers: {
                    Authorization: `token ${access_token}`,
                }
            })
        ).json();
        // 확인하기 : res.send(JSON.stringify(userData));
       
        const emailData = await (await fetch(`${apiUrl}/user/emails`, {
                headers: {
                    Authorization: `token ${access_token}`,
                }
            })
        ).json();

        // 조건에 맞는 이메일 가져오기
        const emailObj = emailData.find((email)=> email.primary === true && email.verified === true);
        if (!emailObj) {
            return res.redirect("/login");
        }
        /* Github 등 소셜 로그인시
            1. 이미 계정이 있는 유저인가?
            2. 똑같은 Email 이 있는가
            3. 어떤 로직을 사용하여 인증을 진행할 것인지
        */
       
       let user = await User.findOne({ email: emailObj.email });
       // 유저 DB 에 해당 이메일이 존재하는가?
        if (!user) {
             // 존재하지 않을 시 계정만들기(추가)
                user = await User.create({
                name: userData.name || userData.login,
                username: userData.login,
                email: emailObj.email,
                password: "",
                socialOnly: true,
                avatarUrl: userData.avatar_url,
                location: userData.location,
            });
        } 
        req.session.loggedIn = true;
        req.session.user = user;
       
        return res.redirect("/");
        
    } else {
        return res.redirect("/login");
    }
}

export const getChangePassword = (req, res) => {
    return res.render("users/change-password", { pageTitle: "Change Password"});
}

export const postChangePassword = async(req, res) => {
    // sned notification
    const {
        session: {
          user: { _id, password },
        },
        body: { 
            oldPassword, newPassword, confirmPassword 
        }
    } = req;

    // 비밀번호 변경시 이전 비밀번호 확인
    const ok = await bcrypt.compare(oldPassword, password);
    if (!ok) {
        return res.status(400).render("users/change-password", {
            pageTitle: "Change Password",
            errorMessage: "The current password is incorrect",
        })
    }

    // 비밀번호 재확인 절차
    if(newPassword !== confirmPassword) {
        return res.status(400).render("users/change-password", {
            pageTitle: "Change Password",
            errorMessage: "The password does not match the confirmation",
        })
    }
    
    // 비밀번호 변경후 DB 저장 및 세션끊기, 로그아웃
    const user = await User.findById(_id);
    user.password = newPassword;
    await user.save(); //User.js 해싱 후 저장
    req.session.user.password = user.password; // 세션업데이트
    
    return res.redirect("/users/logout");
}

export const see = async(req, res) => {
    const { id } = req.params;
    // 유저정보 + 유저의 비디오정보 double populate
    const user = await User.findById(id).populate({
        path: "videos",
        populate: {
            path: "owner",
            model: "User",
        }
    });
    if (!user) {
        return res.status(404).render("404", {
            pageTitle: "User not found"
        })
    }
    return res.render("users/profile", { 
        pageTitle: `${user.username}의 Profile`, 
        user,
    });
}
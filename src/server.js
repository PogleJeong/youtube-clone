import "./database"; // DB 파일 IMPORT
import "./models/Video" // model 불러오기

import express from "express"; // express 패키지 import
import morgan from "morgan"; // morgan 패키지
import session from "express-session";
import MongoStore from "connect-mongo";

import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import { localsMiddleware } from "./middlewares";

const app = express(); // express app 생성
const logger = morgan("dev");

app.set("view engine", "pug"); // 자동으로 views 파일에서 pug 파일을 찾게 설정되어있음
app.set("views", process.cwd() + "/src/views") // 경로지정
app.use(logger); // global middleware
app.use(express.urlencoded( {extended: true})); //express가 form value를 읽고 js 형식으로 전환.
app.use(session({ // express 가 자동적으로 브라우저를 위한 session id 를 생성하여 전달
    // cookie에 sign 할때 사용하는 String - session hijacking 을 막기위함.
    secret: process.env.COOKIE_SECRET,

    // Domain : 쿠키를 전달받는 호스트
    // uninitialized : 세션이 새로만들어지고 수정된적 없는 세션 -> 이후 session 에 수정된 부빈 있으면 그때가 실제로 세션이 초기화된 부분(userController 에서의 req.session.loggedIn = true)
    // saveUninitialized: false 는 세션을 수정할 때만 세션을 DB에 저장하고 쿠키를 넘겨줌, true 는 모든 방문자의 세션을 저장하고 쿠키를 넘겨줌
    resave: false, 
    saveUninitialized: false, 
    
    // Expire : 쿠키의 만료날짜 / 비워두면 컴퓨터를 재시작하거나 브라우저를 닫으면 없어짐.
    cookie: { 
        maxAge: 3600000, // 쿠키가 만료될때까지의 시간 (ms) (로그인유지시간으로 활용가능)
    },
    store: MongoStore.create({mongoUrl: process.env.DB_URL}), // mongo store 사용
    })
);
app.use(localsMiddleware);

app.use("/uploads", express.static("uploads")); // 유저들에게 upload 폴더를 노출(/upload로 접속가능)

app.use("/", rootRouter); // /request로 / 를 받으면 rootRouter 로 이동
app.use("/users", userRouter); // request로 /users 를 받으면 userRouter 로 이동 
app.use("/videos",videoRouter); // request로 /videos 를 받으면 videoRouter 로 이동

export default app;

/*
    서버는 항상 켜져있는 컴퓨터와 같음.
    서버는 클라이언트의 request 을 listen 하고 있음.(로그인, 동영상, 카톡 등)
    서버가 사람들이 뭔가를 요청할 때까지 기다리게 해야함.
*/

/*
    서버를 시작하면 localhost 를 통해서 접속할 수 있음
    지금 브라우저를 키고 주소창에 localhost:4000(포트번호)을 입력하면 화면이 나옴.
    CANNOT GET / 이 나오는 창이 뜨면 성공
*/

/*
    3.1 GET Requests
    서버가 request 에 response 하게 만들예정.
    CANNOT GET / 의 "/" 가 서버의 root(첫페이지)
    우리가 naver.com 을 주소창에 입력하면, 네이버가 나오는 동시에 
    주소창에는 naver.com/ 처럼 "/"이 추가됨

    CANNOT GET / 의 "GET" 가 HTTP method, http 는 서버끼리 의사소통하는 방법
    유저들이 접속하고자 할때 브라우저가 대신해서 http request 를 만들어 보냄
    http request 는 웹사이트에 접속하고 서버에 정보를 보내는 방법

    GET / >> 페이지(/)를 가져와(GET) (get request)
*/

/*
    3.5 미들웨어
    - request 와 response 사이에 존재하는 소프트웨어, 브라우저가 request 한 다음 서버가 응답하기전
    - 모든 middleware 는 controller 이고, 모든 controller 는 middleware 가 될 수 있음.(MVC 패턴 중 Contoller)
    - callback 함수에 arg3 로 next 가 들어가는데 next 가 있는 callback 함수는 middleware
    - middleware 는 request 에 응답하는 것이 아니라 지속시켜주는 역할을 한다. (검사로도 쓰일 수 있음)
    - 작업을 다음 함수에게 넘기는 함수이고, 필요한 만큼 만들수 있다.
    */


/*
    3.6 app.use()
    - global middleware 를 만들수 있게 해주는 함수
    - 어떤 url 에 접속해도 사용됨
    - app.use() 사용 이후 app.get() 을 사용해야한다.
*/

/*
    3.11 morgan 
    - nodejs 용 request logger middleware
    - morgan 함수를 호출하면 사용자가 설정한대로 middleware를 return
    - morgan import 해주어여하며 app.use() 안에 사용
    = 직접 middleware를 만드는 것보다 정교함
    - morgan("dev")
    - morgan("combine")
*/  


// post 데이터베이스에서 추가하기 위해서 post 사용
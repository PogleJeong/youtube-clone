// server 의 configuration 에 관련한 코드
import "dotenv/config"; // 서버가 시작되는 곳에 위치해야 전체 파일에 적용됨.
import "./database";
import "./models/User";
import "./models/Video";
import "./models/Comment";
import app from "./server";

const PORT = 5000;
const handleListening = () => console.log(`Server listening on localhost:${PORT}!!`);

app.listen(PORT, handleListening); // (포트번호, 함수)
// server 의 configuration 에 관련한 코드

import "./database";
import "./models/Video";
import "./models/User";
import app from "./server";

const PORT = 5000;
const handleListening = () => console.log(`Server listening on localhost:${PORT}!!`);

app.listen(PORT, handleListening); // (포트번호, 함수)
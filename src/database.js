// connecting mongodb 

// cmd 에서 mongosh 로 DB URL 가져오기

import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/wetube", { 
    useNewUrlParser: true, useUnifiedTopology: true 
}); // "url + db이름", 옵션(경고없애기)

const db = mongoose.connection; // db 연결정보 가져오기

const handleOpen = () => console.log("Connected to DB") ;
const handleError = (error) => console.log("DB Error: ", error);
db.on("error", handleError); // on = 여러번 실행가능
db.once("open", handleOpen); // once = 단 한번만 실행하는 함수


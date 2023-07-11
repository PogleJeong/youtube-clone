import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    socialOnly: { type: Boolean, default: false }, //github 계정인지 확인.
    username : { type: String, required: true, unique: true },
    password : { type: String }, // 보안을 위해 해싱(hashing)시켜야함
    name : { type: String, required: true },
    avatarUrl: { type: String },
    location : { type: String },
    videos: [{type: mongoose.Schema.Types.ObjectId, required: true, ref: "Video"}]
});

// save 하기전 실행하는 함수
UserSchema.pre("save", function () {
    // 해당모델의 password 에 변화가 있는지 감시, this == User model
    // password 가 수정될 때만 해싱이 일어남!
    if(this.isModified("password")) {
        this.password = bcrypt.hash(this.password, 5); // salt round = 5
    }
});
const User = mongoose.model("User", UserSchema);
export default User;
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
});

// save 하기전 실행하는 함수
UserSchema.pre("save", async function () { // async () => 은 작동안함.
    this.password = await bcrypt.hash(this.password, 5); // salt round = 5
});
const User = mongoose.model("User", UserSchema);
export default User;
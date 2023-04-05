import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    username : { type: String, required: true, unique: true },
    password : { type: String, required: true }, // 보안을 위해 해싱(hashing)시켜야함
    name : { type: String, required: true },
    location : { type: String },
});

// save 하기전 실행하는 함수
UserSchema.pre("save", async ()=> {
    console.log("Users password:", this.password);
    this.password = await bcrypt.hash(this.password, 5); // salt round = 5
    console.log("Hashed password:", this.password);
});
const User = mongoose.model("User", UserSchema);
export default User;
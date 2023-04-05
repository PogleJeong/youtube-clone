import mongoose from "mongoose";

// 스키마 생성 및 설정
const videoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    fileUrl: { type: String, required: true},
    description: { type: String, required: true },
    createdAt: { type: Date, requried: true, default: Date.now }, // Date.now 괄호필요없음!!
    hashtags: [{type: String}], // String == type: String
    meta: {
        views: { type: Number, required: true, default: 0 },
        rating: { type: Number, required: true, default: 0 }
    },
});

/* 해시태그 처리하는 여러방법 

1. "save" 하기전에 실행하는 middleware
videoSchema.pre("save", async function() {
    this.hashtags = this.hashtags.split(",").map((word) => word.startWith("#") ? word : `#${word}`);
})

or

export const handleHashtags = (hashtags) => {
    hashtags.split(",").map((word) => word.startWith("#") ? word : `#${word}`);
}

or 
*/

videoSchema.static("formatHashtags", function(hashtags) {
    return hashtags
        .split(",")
        .map( word => word.startWith("#") ? word : `#${word}`);
})

const Video = mongoose.model("Video", videoSchema); // model 만들기(model 이름, model schema)
export default Video;
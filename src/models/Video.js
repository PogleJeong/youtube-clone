import mongoose from "mongoose";

// 스키마 생성 및 설정
const videoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    videoUrl: { type: String, required: true},
    thumbnailUrl: { type: String, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, requried: true, default: Date.now }, // Date.now 괄호필요없음!!
    hashtags: [{type: String}], // String == type: String
    meta: {
        views: { type: Number, required: true, default: 0 },
        thumbUp: [{ type: mongoose.Schema.Types.ObjectId, required: true, default: 0 }],
        thumbDown: [{ type: mongoose.Schema.Types.ObjectId, required: true, default: 0 }],
    },
    comment: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: "Comment"}],
    owner: { // ObjectId : mongoDB에서 제공하는_id 정보를 담기 위한 종류, ref는 연결시킬 다른 model
        type: mongoose.Schema.Types.ObjectId, required: true, ref: "User"
    }
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
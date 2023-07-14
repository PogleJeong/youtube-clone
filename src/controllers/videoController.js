import { async } from "regenerator-runtime";
import User from "../models/User";
import Video from "../models/Video"; // DB MODEL 사용

/* 
  Mongoose : callback 방식, promise 방식으로 나뉨.

  1) callback 함수
  callback 함수는 어느 위치에 있는 그 함수안에서 가장 마지막에 실행됨. 
  오류를 빠르게 확인할 수 있지만 가장 마지막에 실행되므로 DB 접근에 많은 시간을 기다릴 수 있으며, 함수안에 함수를 써야하는 점.
  
  export const home = (req, res) => {
  Video.find({}, (error , videos) => { // 함수명 생략가능한 방법 (argu1, argu2) => {}
    //console.log("error:", error); error가 있는가?
    //console.log("videos:",videos); select 결과
    return res.render("home", { pageTitle: "Home", videos });
  }) 
};
*/

/* 
  2) promise 함수
*/
export const home = async (req, res) => {
  try {
    const videos = await Video.find({})
    .sort({ createAt: "desc"})
    .populate("owner");
    return res.render("home", {pageTitle : "Home", videos });
  } catch {
    return res.status(404).render("server-error");
  }
};

export const watch = async (req, res) => {
  // req 는 URL (/video/:id)에서 받은 변수정보를 담음.
  const { id } = req.params;
  // 비디오의 정보 + 해당 비디오의 작성자 닉네임 불러오기(ref 된 model 에서 가져올 정보)
  const video = await Video.findById(id).populate("owner");
  console.log(video);
  
  if (video) {
    return res.render("watch", { pageTitle: video.title, video});
  } 
  return res.status(404).render("404", { pageTitle: "Video not found"});
  };

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const { user: { _id }} = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found"})
  } 
  /* 수정 시 작성자만 접속가능함 
    video.owner : Object
    _id : String
  */
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "Your are not the owner of the video.");
    return res.status(403).redirect("/");
  }
  return res.render("edit", {pageTitle: `Edit ${ video.title }`});
  };

// video 수정
export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const video = await Video.exists({_id: id}); //or await Video.findById(id);
  if (video) {

    await Video.findByIdAndUpdate(id, { // ID를 통해 데이터를 찾고 업데이트
      title, 
      description, 
      hashtags: Video.formatHashtags(hashtags),// video.js 안의 static 
    });
    req.flash("success", "Changes saved");
    return res.render(`/videos/${id}`);
  };
  
  /*
    video.title = title;
    video.description = description;
    video.hashtags = hashtags // 안에 해시태그가 있다면 추가하지 않고 없으면 추가함.
      .split(",")
      .map((word) => 
      word.startWith("#") ? word : `#${word}`);
  */
  return res.render("404", { pageTitle: "Video not found"})
};

export const getUpload = (req, res) => {
  return res.render("upload", {pageTitle: "Upload video!"});
};

export const postUpload = async (req, res) => {
  const { user : { _id } } = req.session;
  const { video, thumbnail } = req.files; // multer
  const { title, description, hashtags } = req.body;
  console.log(video);
  console.log(thumbnail);
  try {
    // 1. video model 에 data 넣기
    const newVideo = await Video.create({ // creates Video data model / promise / save into DB
      title, // title : title
      description, // description : description
      videoUrl: video[0].path.replace(/[\\]/g, "/"),
      thumbnailUrl: thumbnail[0].path.replace(/[\\]/g, "/"),
      owner:_id,
      hashtags : hashtags.split(",").map((word)=> `#${word}`),
      meta: {
        views: 0,
        rating: 0,
      },
    })
    // 2. User model 에 video 정보 추가하기
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save(); // -> 버그 해결(영상업로드시 해당 계정 비밀번호해싱발생)
    return res.redirect("/");
  } catch (error) { // error 출력 error에서 _message 를 통해 간략한 에러사항을 알 수 있음.
    console.log(error);
    return res.status(400).render("upload", { pageTitle : "Upload Video", errorMesaage : error._message });
  }
 
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const { user: { _id }} = req.session;

  const video = await Video.findById(id);
  // 1. 해당 비디오가 존재하는가
  if(!video) {
    return res.status(404).render("404", {pageTitle: "Video not found."});
  }
  // 2. 지우고자하는 영상의 소유자인가
  if (String(video.owner)!==String(_id)) {
    return res.status(403).redirect("/");
  }
  
  // delete
  await Video.findByIdAndDelete(id);
  return res.redirect("/");
};

export const search = async (req, res) => {
  //GET request 에서 ? param값 가져오기
  const { keyword } = req.query;
  let videos = [];
  
  if (keyword) { // keyword 가 입력되면 실행
      videos = await Video.find({
        title: {
          $regex: new RegExp(`${keyword}$`, "i"), // 정규식 사용 할 수 있게 해줌
      }, // where title = keyword
    }).populate("owner");
  }
  return res.render("search", { pageTitle: "Search", videos});
}

export const registerView = async(req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404); //랜더링 없이 api 요청
  }
  video.meta.views = video.meta.views + 1;
  await video.save();
  return res.sendStatus(200);
}

export const writeComment = async(req, res) => {
  console.log(req.params);
  console.log(req.body);
  return res.sendStatus(200);
}
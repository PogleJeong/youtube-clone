//FFmpeg 사용 : 영상에서 썸네일 따오기
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const selfRecoderBtn = document.getElementById("selfRecordBtn");
const actionBtn = document.getElementById("actionBtn");
const videoContainer = document.getElementById("videoContainer");
const video = document.getElementById("preview");

let stream; // 녹화시 필요한 객체저장
let recorder; // MediaRecorder 개체
let videoFile;

const files = {
    input: "recording.webm",
    output: "output.mp4",
    thumbnail: "thumbnail.jpg",
};

const downloadFile = (fileUrl, fileName) => {
    // 해당 element 를 클릭시 a tag 를 생성하여 바로 클릭(자동)
    const a = document.createElement("a");
    a.href= fileUrl;
    a.download = fileName; // 다운로드 형식 .mp4 (모든 브라우져에서 사용가능)
    document.body.appendChild(a);
    a.click(); // 자동 다운로드(클릭)
}

// 비디오 미리보기 기능. 웹캠 등 필요
const init = async() => {
    stream = await navigator.mediaDevices.getUserMedia({
        audio: true, 
        video: {
            width : 550, 
            height: 450,
        },
    });
    video.srcObject = stream;
    video.play(); 
};

const handleSelfRecorderBtn = () => {
    videoContainer.classList.toggle("showing");
};

const handleDownload = async() => {
    // 0단계 - 다운로드 이벤트 제거 및 다운로드 완료시까지 비활성화
    actionBtn.removeEventListener("click", handleDownload);
    actionBtn.innerText = "Transcoding..."
    actionBtn.disabled = true;

    // 1단계 - ffmpeg 소프트웨어 로드
    const ffmpeg = createFFmpeg({log:true})
    await ffmpeg.load();

    // 2단계 - ffmpeg.FS() 파일작성해서 가상공간에 저장(File System)
    ffmpeg.FS("writeFile", files.input, await fetchFile(videoFile));
    await ffmpeg.run("-i", files.input, "-r", "60",files.output); // recording.webm 을 초당 60프레임으로 인코딩하여 output.mp4로 변환
    await ffmpeg.run("-i", files.input, "ss", "00:00:01", "-frames:v","1", files.thumbnail); // recoring.webm 의 00:00:01 의 구간을 1프레임 가져와서 썸네일로 저장
    const mp4File = ffmpeg.FS("readFile", files.output);
    const thumbFile = ffmpeg.FS("readFile", files.thumbnail);

    // 3단계 - Uint8Array 를 Blob 객체로 변환
    const mp4Blob = new Blob([mp4File.buffer], {type: "video/mp4"});
    const thumbBlob = new Blob([thumbFile.buffer], {type: "image/jpg"});

    const mp4Url = URL.createObjectURL(mp4Blob);
    const thumbUrl = URL.createObjectURL(thumbBlob);
    
    downloadFile(mp4Url, "MyRecording.mp4")
    downloadFile(thumbUrl, "MyThumbnail.jpg");

    // url 해제
    ffmpeg.FS("unlink", files.input);
    ffmpeg.FS("unlink", files.output);
    ffmpeg.FS("unlink", files.thumbnail);
    // url 삭제
    URL.revokeObjectURL(mp4Url);
    URL.revokeObjectURL(thumbUrl);
    URL.revokeObjectURL(videoFile);

    // 다운로드 완료 후 버튼활성화
    actionBtn.innerText = "Record Again";
    actionBtn.disabled = false;
    actionBtn.addEventListener("click", handleDownload);
};

// 버튼 누를때마다 버튼이름하고 이벤트가 바뀜.
// 버튼 누르면 영상녹화가 종료되고 다운로드
const handleStop = () => {
    actionBtn.innerText = "Download Recording";
    actionBtn.removeEventListener("click", handleStop);
    actionBtn.addEventListener("click", handleDownload);
    recorder.stop(); // 녹화 중단
};

/** 녹화 시작 함수 */
const handleStart = async() => {
    // 녹화 시작과 동시에 녹화 종료 및 저장기능 활성화,
    // 기존 버튼에 있던 녹화 시작 이벤트를 제거하고 녹화 종료 및 저장 이벤트 추가
    actionBtn.innerText = "Stop recording";
    actionBtn.removeEventListener("click", handleStart);
    actionBtn.addEventListener("click", handleStop);

    recorder = new MediaRecorder(stream, { mimeType: "video/webm" }); // 녹화객체생성

    // recorder.stop() 이 발생되면 발생
    recorder.ondataavailable = (event) => { // start() ~ stop() 까지의 비디오 저장
        // event.data 가 영상 데이터(Blob 객체)
        // 영상을 브라우저의 메모리에 저장하고, 그 영상을 불러오기 위해 URL 생성
        videoFile = URL.createObjectURL(event.data); 
        video.srcObject = null;
        video.src = videoFile;
        video.loop = true; // 반복재생
        video.play();
    };
    recorder.start(); // 녹화 시작
};


init();
actionBtn.addEventListener("click", handleStart);
selfRecoderBtn.addEventListener("click", handleSelfRecorderBtn);
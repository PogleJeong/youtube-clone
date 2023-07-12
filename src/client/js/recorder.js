const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

let stream; // 녹화시 필요한 객체저장
let recorder; // MediaRecorder 개체
let videoFile;

// 비디오 미리보기 기능. 웹캠 등 필요
const init = async() => {
    stream = await navigator.mediaDevices.getUserMedia({
        audio: true, 
        video: {
            width : 400, 
            height: 300,
        },
    });
    video.srcObject = stream;
    video.play(); 
};

const handleDownload = () => {
    // 해당 element 를 클릭시 a tag 를 생성하여 바로 클릭(자동)
    const a = document.createElement("a");
    a.href= videoFile;
    a.download = "MyRecording.webm"; // 다운로드 형식 .webm (모든 브라우져에서 사용가능)
    document.body.appendChild(a);
    a.click(); // 자동 다운로드(클릭)
};

// 버튼 누를때마다 버튼이름하고 이벤트가 바뀜.
// 버튼 누르면 영상녹화가 종료되고 다운로드
const handleStop = () => {
    startBtn.innerText = "Download Recording";
    startBtn.removeEventListener("click", handleStop);
    startBtn.addEventListener("click", handleDownload);
    recorder.stop(); // 녹화 중단
};

/** 녹화 시작 함수 */
const handleStart = async() => {
    // 녹화 시작과 동시에 녹화 종료 및 저장기능 활성화,
    // 기존 버튼에 있던 녹화 시작 이벤트를 제거하고 녹화 종료 및 저장 이벤트 추가
    startBtn.innerText = "Stop recording";
    startBtn.removeEventListener("click", handleStart);
    startBtn.addEventListener("click", handleStop);

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
startBtn.addEventListener("click", handleStart);
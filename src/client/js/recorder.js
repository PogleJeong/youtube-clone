const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

let stream; // 녹화시 필요한 객체저장
let recorder;
let videoFile;
//프론트엔트 오류시 regeneratorRuntime 설치 필요 (async, await 사용)
// npm i regenerator-runtime
// 연결된 device 가 있어야 작동함.
// 현재 카메라 화면 띄우기
const init = async() => {
    stream = await navigator.mediaDevices.getUserMedia({
        audio: true, 
        video: {
            width : 400, 
            height: 300
        },
    });
    video.srcObject = stream;
    video.play(); // 미리보기
};

const handleDownload = () => {
    const a = document.createElement("a");
    a.href= videoFile;
    a.download = "MyRecording.webm"; //다운로드 형식 .webm (모든 브라우져에서 사용가능)
    document.body.appendChild(a);
    a.click();

};

// 버튼 누를때마다 버튼이름하고 이벤트가 바뀜.
// 버튼 누르면 영상녹화가 종료되고 다운로드
const handleStop = () => {
    startBtn.innerText = "Downloading Recording";
    startBtn.removeEventListener("click", handleStop);
    startBtn.addEventListener("click", handleDownload);

    recorder.stop(); // 녹화 중단
};

// 버튼 누를때마다 버튼이름하고 이벤트가 바뀜.
// 누르면 녹화시작
const handleStart = async() => {
    startBtn.innerText = "Stop recording";
    startBtn.removeEventListener("click", handleStart);
    startBtn.addEventListener("click", handleStop);

    recorder = new window.MediaRecorder(stream); // 녹화객체생성

    recorder.ondataavailable = (event) => { // start() ~ stop() 까지의 비디오 저장
        //event.data 가 영상 데이터(Blob 객체)
        // 영상을 브라우저의 메모리에 저장하고, 그 영상을 불러오기 위해 URL 생성
        videoFile = URL.createObjectURL(event.data); 
        video.srcObject = null;
        video.src = videoFile;
        video.loop = true;
        video.play();
    };
    recorder.start(); // 녹화 시작
};
init();
startBtn.addEventListener("click", handleStart);

//
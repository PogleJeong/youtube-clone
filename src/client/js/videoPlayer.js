const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const videoContainer = document.getElementById("videoContainer");

let volumeValue = 0.5; // 처음 동영상 소리 
video.volume = volumeValue;

const formatTime = (seconds) => new Date(seconds * 1000).toISOString().substring(11,19);

const handlePlayClick = () => {
    video.paused? video.play(): video.pause();
    playBtn.innerText = video.paused ? "Play" : "Pause";
}

const handleMute = () => {
    video.muted = video.muted ? false : true;
    muteBtn.innerText = video.muted ? "Unmute" : "Mute";
    volumeRange.value = video.muted ? 0 : volumeValue;
}

const handleVolumnChange = (event) => {
    const {
        target: { 
            value 
        }
    } = event;
    if (video.muted) {
        video.muted = false;
        muteBtn.innerText = "Mute";
    }
    volumeValue = value;
    video.volume = value;
}

/** meta data(영상) 가 로드될 때 실행됨 */
const handleLoaderMetadata = () => {
    totalTime.innerText = formatTime(Math.floor(video.duration));
    timeline.max = Math.floor(video.duration); // 영상에 따른 타임라인 길이 설정
}

/** 비디오 시간이 변경하면 발생 */
const handleTimeUpdate = () => {
    currentTime.innerText = formatTime(Math.floor(video.currentTime));
    timeline.value = Math.floor(video.currentTime);
}

/** 타임라인 바 변경시 발생 */
const handleTimelineChange = (event) => {
    const {
        target: {value}
    } = event;
    video.currentTime = value;
}

const handleFullScreen = () => {
    const fullscreen = document.fullscreenElement;
    if(fullscreen) {
        document.exitFullscreen();
        fullScreenBtn.innerText = "Enter Full Screen";
    }else{
        videoContainer.requestFullscreen();
        fullScreenBtn.innerText = "Exit Full Screen";
    }
}

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumnChange);
video.addEventListener("loadedmetadata", handleLoaderMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
timeline.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullScreen);

/*
    [video]

    <<이벤트>>

    1. loadedmetadata : meta data 가 로드될 때 실행됨.
    meta data 란 비디오를 제외한 모든 것
    - 비디오 시간, 비디오 크기 등 비디오 자체를 제외한 모든 부가적인 것들

    2. timeupdate
    비디오의 시간이 변할때마다 발생


    <<속성>>
    1. duration
    비디오의 총시간(초)

    2. currentTime
    비디오의 현재 진행시간

    3. element.requestFullscreen
    Element.requestFullscreen() (en-US)
    유저 에이전트가 지정한 요소(그리고 그 자손들까지)를 full-screen mode로 설정하고, 
    브라우저의 모든 UI 요소와 다른 모든 애플리케이션을 화면에서 제거하도록 요구합니다. 
    full-screen mode가 활성화되면 Promise resolved를 반환합니다.

    4. document.fullscreenElement()
    풀스크린 상태인 element return, 아니면 null

    5. document.exitFullscreen()
    모든 풀스크린 상태 해제
*/
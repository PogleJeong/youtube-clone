const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playIcon = playBtn.querySelector("i"); // play btn 안에 아이콘
const muteBtn = document.getElementById("mute");
const muteIcon = muteBtn.querySelector("i"); // mute btn 안에 아이콘
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

let volumeValue = 0.5; // 처음 동영상 소리
let controlsTimeout = null; // timeout 함수를 조건에 따라 여러번 발동시킬 수 있도록 변수를 선언
let controlsMovementTimeout = null;
video.volume = volumeValue;

const formatTime = (seconds) => new Date(seconds * 1000).toISOString().substring(11,19);

const handlePlayClick = () => {
    video.paused? video.play(): video.pause();
    playIcon.className = video.paused ? "fas fa-play" : "fas fa-pause";
}

const handleMute = () => {
    video.muted = video.muted ? false : true;
    muteIcon.className = video.muted ? "fas fa-volume-mute" : "fas fa-volume-up";
    volumeRange.value = video.muted ? 0 : volumeValue;
}

const handleVolumnChange = (event) => {
    const {
        target: { 
            value 
        }
    } = event;
    video.muted = video.muted ? false : true; 
    muteIcon.className = value == 0 ? "fas fa-volume-mute" : "fas fa-volume-up";
    
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

/** 비디오가 모두 종료되면 발생 
 *  조회수 올리기
 *  백엔드-프론트엔드가 쉽게 데이터를 공유하기 위한 방법으로 element 의 dataset 을 사용
*/
const handleEnded = () => {
    const { id } = videoContainer.dataset;
    fetch(`/api/videos/${id}/view`, {
        method: "POST",
    });
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
        fullScreenIcon.classList = "fas fa-expand";
    }else{
        videoContainer.requestFullscreen();
        fullScreenIcon.classList = "fas fa-compress";
    }
}

const hideControls = () => videoControls.classList.remove("showing");

/** 비디오 위에서 마우스 움직임 감지하는 함수
    비디오에서 마우스가 움직이면 컨트롤바를 보여줌.
    1. 3초 후에 발생하는 setTimeout 이 생김 (컨트롤바 숨기기)
    2. 3초 안에 마우스 움직임이 시작되면 if 문에서 걸리고, 기존setTimeout 함수는 없어지고 새로운 setTimeout 함수가 생성.
    3. 3초 동안 움직임이 없으면 기존 setTimeout 함수가 발동하므로 hideControls 함수가 발생.
    4. 컨트롤 바 숨겨짐
  
*/
const handleMouseMove = () => {
    if (controlsTimeout) {
        clearTimeout(controlsTimeout); // 해당 id 를 가지고 있는 timeout function 제거
        controlsTimeout = null;
    }
    if (controlsMovementTimeout) { // 마우스가 움직이고 있으면 id 존재 - 3초동안 움직임이 없을 경우 null 값.
        clearTimeout(controlsMovementTimeout);
        controlsMovementTimeout = null;
    }
    videoControls.classList.add("showing");
    controlsMovementTimeout = setTimeout(hideControls, 3000);
}

/** 마우스가 비디오 밖으로 나가는 것을 감지
 *  마우스가 비디오 밖으로 나갈경우 컨트롤바를 숨김.
*/
const handleMouseLeave = () => {
    controlsTimeout = setTimeout(hideControls, 3000);
}

const handleKeyPress = (event) => {
    if (event.code === "Space") {
        handlePlayClick();
    }
}

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
timeline.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullScreen);
volumeRange.addEventListener("input", handleVolumnChange);

video.addEventListener("loadedmetadata", handleLoaderMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("ended", handleEnded);
video.addEventListener("click", handlePlayClick);
video.addEventListener("mousemove", handleMouseMove);
video.addEventListener("mouseleave", handleMouseLeave);
document.addEventListener("keydown", handleKeyPress);

/*
    [video]

    <<이벤트>>

    1. loadedmetadata : meta data 가 로드될 때 실행됨.
    meta data 란 비디오를 제외한 모든 것
    - 비디오 시간, 비디오 크기 등 비디오 자체를 제외한 모든 부가적인 것들

    2. timeupdate
    비디오의 시간이 변할때마다 발생

    3. ended
    비디오가 재생이 모두 완료되면 발생


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
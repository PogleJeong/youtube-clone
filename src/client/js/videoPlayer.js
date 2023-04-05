console.log("video player");

const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const time = document.getElementById("time");
const volumeRange = document.getElementById("volume");

let volumeValue = 0.5; // 처음 동영상 소리 
video.volume = volumeValue;

const handlePlayClick = (event) => {
    //if hte video is playing, pause it
    if (video.paused) video.play();
    else video.pause();
    playBtn.innerText = video.paused ? "Play" : "Pause";
}

const handleMute = (event) => {
    if (video.muted) video.muted = false;
    else video.muted = true;
    muteBtn.innerText = video.muted ? "Unmute" : "Mute";
    volumeRange.value = video.muted ? 0 : volumeValue;
}

const handleVolumnChange = (event) => {
    const {target: { value }} = event;
    video.volume = value;
}
playBtn.addEventListener("click",handlePlayClick);
muteBtn.addEventListener("click",handleMute);
// volumeRange.addEventListener("change", handleVolumnChange); change 말구 다른 옵션
volumeRange.addEventListener("input", handleVolumnChange);
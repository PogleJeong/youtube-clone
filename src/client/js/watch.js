const videoContainer = document.getElementById("videoContainer");

const thumbUp = document.getElementById("thumb-up");
const thumbUpCount = document.getElementById("thumb-up__count");
const thumbDown = document.getElementById("thumb-down");
const thumbDownCount = document.getElementById("thumb-down__count");
const videoUpdateBtn = document.getElementById("video__updateBtn");
const videoDeleteBtn = document.getElementById("video__deleteBtn");

const handleThumbUp = async(event) => {
    event.preventDefault();
    const video_id = videoContainer.dataset.id;
    const response = await fetch(`/api/videos/${video_id}/thumb-up`, {
        method: "POST",
    })

    if (response.status === 404) {
        console.log("thumb-up error")
        return;
    }
    if (response.status === 201) {
        const { result, count, swap } = await response.json();
        if (result === "add") {
            thumbUp.style.backgroundColor = "blue";
            thumbDown.style.backgroundColor = "gray";
            thumbUpCount.innerText = count;
            if (swap) {
                thumbDownCount.innerText -= 1;
            }
        }
        if (result === "remove") {
            thumbUp.style.backgroundColor = "gray";
            thumbUpCount.innerText = count;
        }
    }
}

const handleThumbDown = async(event) => {
    event.preventDefault();
    const video_id = videoContainer.dataset.id;
    const response = await fetch(`/api/videos/${video_id}/thumb-down`, {
        method: "POST",
    })

    if (response.status === 404) {
        console.log("thumb-down error")
        return;
    }
    if (response.status === 201) {
        const { result, count, swap } = await response.json();
        if (result === "add") {
            thumbDown.style.backgroundColor = "blue";
            thumbUp.style.backgroundColor = "gray";
            thumbDownCount.innerText = count;
            if (swap) {
                thumbUpCount.innerText -= 1;
            }
        }
        if (result === "remove") {
            thumbDown.style.backgroundColor = "gray";
            thumbDownCount.innerText = count;
        }
    }
}

const clickVideoUpdateBtn = () => {
    const confirm = window.confirm("동영상을 수정하시겠습니까?");
    if (!confirm) return;

    const video_id = videoContainer.dataset.id;
    location.href = video_id + "/edit";

}

const clickVideoDeleteBtn = () => {
    const confirm = window.confirm("동영상을 삭제하시겠습니까?");
    if (!confirm) return;

    const video_id = videoContainer.dataset.id;
    location.href = video_id + "/delete";
}

if (thumbUp && thumbDown) {
    thumbUp.addEventListener("click", handleThumbUp);
    thumbDown.addEventListener("click", handleThumbDown);
}
if (videoUpdateBtn && videoDeleteBtn) {
    videoUpdateBtn.addEventListener("click", clickVideoUpdateBtn);
    videoDeleteBtn.addEventListener("click", clickVideoDeleteBtn);
}
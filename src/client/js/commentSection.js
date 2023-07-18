const videoContainer = document.getElementById("videoContainer");

const form = document.getElementById("commentForm");
const textarea = form.querySelector("textarea");
const removeCommentBtn = document.getElementsByClassName("removeCommentBtn");
const thumbUp = document.getElementById("thumb-up");
const thumbUpCount = document.getElementById("thumb-up__count");
const thumbDown = document.getElementById("thumb-down");
const thumbDownCount = document.getElementById("thumb-down__count");



const addComment = (text, newCommentId) => {
    const videoComments = document.querySelector(".video__comments ul");
    const newComment = document.createElement("li");
    newComment.className = "video__comment";
    newComment.dataset.id = newCommentId
    const icon = document.createElement("i");
    icon.className = "fas fa-comment";
    const span = document.createElement("span");
    const span2 = document.createElement("span");
    span2.className = "removeCommentBtn";
    span2.addEventListener("click", handleRemove);
    span.innerText = ` ${text}`;
    span2.innerText = "ⓧ";
    newComment.appendChild(icon);
    newComment.appendChild(span);
    newComment.appendChild(span2);

    videoComments.prepend(newComment);
}

const handleSubmit = async(event) => {
    event.preventDefault();
    const video_id = videoContainer.dataset.id;
    const text = textarea.value;

    if (text === "") return;

    // api 컨트롤러 거치는데, res.status() 보고 if문 거침 
    const response = await fetch(`/api/videos/${video_id}/comment`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
    });
    textarea.value = "";

    if (response.status === 201) {
        const { newCommentId } = await response.json();
        addComment(text, newCommentId);
    }
};

const handleRemove = async(event) => {
    event.preventDefault();
    const commentBox = event.target.parentNode;
    const comment_id = commentBox.dataset.id;
    const video_id = videoContainer.dataset.id;
    const response = await fetch(`/api/videos/${video_id}/remove/comment`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment_id })
    })

    if (response.status === 201) {
        commentBox.remove();
    }
}

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
                thumbDown.innerText -= 1;
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
                thumbUp.innerText -= 1;
            }
        }
        if (result === "remove") {
            thumbDown.style.backgroundColor = "gray";
            thumbDownCount.innerText = count;
        }
    }
}

form.addEventListener("submit", handleSubmit);
thumbUp.addEventListener("click", handleThumbUp);
thumbDown.addEventListener("click", handleThumbDown);
Array.from(removeCommentBtn).forEach(element => {
    element.addEventListener("click", handleRemove);
});



/*
    1. js 를 통해 추가한 자신의 댓글
    - addComment 에서 event addEventLister 추가
    2. 서버를 통해 보여주는 자신의 댓글.
    - class 를 통해 이벤트 addEventListener 추가.
*/
const videoContainer = document.getElementById("videoContainer");

const form = document.getElementById("commentForm");
const textarea = form.querySelector("textarea");
const removeCommentBtn = document.getElementsByClassName("removeCommentBtn");

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
    console.log(event.target.parentNode.dataset.id);
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

form.addEventListener("submit", handleSubmit);
Array.from(removeCommentBtn).forEach(element => {
    element.addEventListener("click", handleRemove);
});


/*
    1. js 를 통해 추가한 자신의 댓글
    - addComment 에서 event addEventLister 추가
    2. 서버를 통해 보여주는 자신의 댓글.
    - class 를 통해 이벤트 addEventListener 추가.
*/
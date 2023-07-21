
const videoContainer = document.getElementById("videoContainer");

const form = document.getElementById("commentForm");
const textarea = form.querySelector("textarea");
const removeCommentBtnList = document.getElementsByClassName("removeCommentBtn");
const updateCommentBtnList = document.getElementsByClassName("updateCommentBtn");

/** 댓글수정 취소 시 기존 댓글 내용을 담은 변수 */
let previousComment;

/** 댓글작성 시 댓글 element 추가 */
const addComment = (text, newCommentId, username) => {
    const videoComments = document.querySelector(".video__comments ul");
    const newComment = document.createElement("li");
    newComment.className = "video__comment";
    newComment.dataset.id = newCommentId;

    // comment header
    const divHeader = document.createElement("div");
    divHeader.className = "video__comment-header";

    const icon = document.createElement("i");
    icon.className = "fas fa-comment";
    
    const span_name = document.createElement("span");
    span_name.innerText = username //이름
    
    const span_delete = document.createElement("span");
    span_delete.className = "removeCommentBtn";
    span_delete.addEventListener("click", handleRemove);
    span_delete.innerText = "댓글삭제";

    const span_update = document.createElement("span");
    span_update.className = "updateCommentBtn";
    span_update.addEventListener("click", handleChangeElementForUpdate);
    span_update.innerText = "댓글수정";

    divHeader.appendChild(icon);
    divHeader.appendChild(span_name);
    divHeader.appendChild(span_delete);
    divHeader.appendChild(span_update);

    // comment body
    const divBody = document.createElement("div");
    divBody.className = "video__comment-body";
    const span_content = document.createElement("span");
    span_content.innerText = text;
    divBody.append(span_content);

    // comment box 에 추가
    newComment.appendChild(divHeader);
    newComment.appendChild(divBody);

    videoComments.prepend(newComment);
}

/** 댓글수정 시 element 변경 */
const handleChangeElementForUpdate = (event) => {
    const confirm = window.confirm("댓글수정을 하시겠습니까?");
    if (!confirm) return;

    const commentBox = event.target.parentNode.parentNode;
    const commentBody = commentBox.querySelector(".video__comment-body");
    const commentContentSpan = commentBody.firstChild;

    // 수정할 내용을 적을 textarea element 생성
    const textarea = document.createElement("textarea");
    textarea.className = "textarea__update";
    textarea.innerText = commentContentSpan.innerText;

    // 수정완료 버튼 생성
    const updateBtn = document.createElement("button");
    updateBtn.id = "updateBtn";
    updateBtn.addEventListener("click", handleUpdate);
    updateBtn.innerText = "수정완료";
    
    // 수정취소 버튼 생성
    previousComment = commentContentSpan.innerText;
    const cancelBtn = document.createElement("button");
    cancelBtn.id = "cancelBtn";
    cancelBtn.addEventListener("click", handleCancelUpdateComment);
    cancelBtn.innerText = "수정취소";

    // 기존 span element 제거 후, textarea 추가
    commentBody.firstChild.remove();
    commentBody.appendChild(textarea);
    commentBody.appendChild(updateBtn);
    commentBody.appendChild(cancelBtn);

    /*
        기존 삭제 및 수정하기 버튼 숨기기
        1. 삭제하기 버튼
        2. 수정하기 버튼
    */
    event.target.previousSibling.classList.toggle("display-none");
    event.target.classList.toggle("display-none");
}

/** 댓글수정완료 시 */
const handleCompleteUpdateComment = (commentBox, updatedComment) => {
    alert("댓글수정이 완료되었습니다.");
    const commentBody = commentBox.querySelector(".video__comment-body");
    const deleteBtn = commentBox.querySelector(".video__comment-header .removeCommentBtn");
    const updateBtn = commentBox.querySelector(".video__comment-header .updateCommentBtn");
    
    // 다시 보이게 설정
    deleteBtn.classList.toggle("display-none");
    updateBtn.classList.toggle("display-none");
    
    // update 를 위한 textarea 태그 및 버튼 삭제
    commentBody.firstChild.remove();
    commentBody.firstChild.remove();
    commentBody.firstChild.remove();
    
    // span element 추가
    const commentContentSpan = document.createElement("span");
    commentContentSpan.innerText = updatedComment;
    commentBody.appendChild(commentContentSpan);
}

const handleCancelUpdateComment = (event) => {
    event.preventDefault();
    const confirm = window.confirm("댓글수정을 취소하시겠습니까?");
    if (confirm) return;

    const commentBox = event.target.parentNode.parentNode;
    const commentBody = commentBox.querySelector(".video__comment-body");
    const deleteBtn = commentBox.querySelector(".video__comment-header .removeCommentBtn");
    const updateBtn = commentBox.querySelector(".video__comment-header .updateCommentBtn");
    
    // header 의 수정하기, 삭제하기 버튼 만들기
    deleteBtn.classList.toggle("display-none");
    updateBtn.classList.toggle("display-none");
    
    // 수정용 textarea 태그 삭제
    commentBody.firstChild.remove();
    commentBody.firstChild.remove();
    commentBody.firstChild.remove();

    // 기존 span 생성 및 
    const commentSpan = document.createElement("span");
    commentSpan.innerText = previousComment;

    commentBody.appendChild(commentSpan);
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
        const { newCommentId, username } = await response.json();
        addComment(text, newCommentId, username);
    }
};

/** 수정완료 클릭 시 발생 */
const handleUpdate = async(event) => {
    event.preventDefault();
    const commentBox = event.target.parentNode.parentNode;
    const comment_id = commentBox.dataset.id;
    const video_id = videoContainer.dataset.id;

    const textarea = commentBox.querySelector(".video__comment-body .textarea__update");
    const content = textarea.value;
    const response = await fetch(`/api/videos/${video_id}/update/comment`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",      
        },
        body: JSON.stringify({ comment_id, video_id, content })
    })
    if (response.status === 404) {
        alert("댓글 수정 실패!");
    }
    if (response.status === 201) {
        handleCompleteUpdateComment(commentBox, content);
    }
    return;
}

const handleRemove = async(event) => {
    event.preventDefault();
    const confirm = window.confirm("댓글을 삭제하시겠습니까?");
    if (!confirm) return;

    const commentBox = event.target.parentNode.parentNode;
    const comment_id = commentBox.dataset.id;
    const video_id = videoContainer.dataset.id;

    const response = await fetch(`/api/videos/${video_id}/remove/comment`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment_id, video_id })
    })

    if (response.status === 201) {
        commentBox.remove();
    }
}


form.addEventListener("submit", handleSubmit);

Array.from(removeCommentBtnList).forEach(element => {
    element.addEventListener("click", handleRemove);
});
Array.from(updateCommentBtnList).forEach(element => {
    element.addEventListener("click", handleChangeElementForUpdate);
});

/*
    1. js 를 통해 추가한 자신의 댓글
    - addComment 에서 event addEventLister 추가
    2. 서버를 통해 보여주는 자신의 댓글.
    - class 를 통해 이벤트 addEventListener 추가.
*/
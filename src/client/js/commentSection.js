const videoContainer = document.getElementById("videoContainer");

const form = document.getElementById("commentForm");
const textarea = form.querySelector("textarea");


const handleSubmit = (event) => {
    event.preventDefault();
    const video_id = videoContainer.dataset.id
    const text = textarea.value;

    if (text === "") return;
    
    fetch(`/api/videos/${video_id}/comment`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
    });
};

btn.addEventListener("click", handleSubmit);
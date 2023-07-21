const avatarImage = document.getElementById("join__avatar-image");
const avatarInput = document.getElementById("join__avatar-input");

const changeAvatarInput = (event) => {
    const avatar = event.target.files[0];
    const avatarUrl = URL.createObjectURL(avatar);
    avatarImage.src = avatarUrl;
}

avatarInput.addEventListener("change", changeAvatarInput);
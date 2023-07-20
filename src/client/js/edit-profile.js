const avatarInput = document.getElementById("avatar__input");
const imageBox = document.querySelector("#avatarContainer img");

const changeAvatar = (event) => {
    const file = event.target.files[0];
    imageBox.src = URL.createObjectURL(file); // blob 객체를 가상 URL 로 변경
}

avatarInput.addEventListener("change", changeAvatar);

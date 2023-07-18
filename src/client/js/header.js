const navBtn = document.getElementById("nav__btn");
const navBar = document.getElementById("nav__bar");

const handleNavBtn = () => {
    console.log(navBar);
    navBar.classList.toggle("open");
    navBar.classList.toggle("close");
}

navBtn.addEventListener("click", handleNavBtn);
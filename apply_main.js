const popupLink = document.getElementById("applyBtn");
const popup = document.getElementById("popup");
const backdrop = document.getElementById("backdrop");

popupLink.addEventListener("click", () => {
    popup.style.display = "block";
    backdrop.style.display = "block";
});

// closeBtn.addEventListener('click', () => {
//     popup.style.display = 'none';
//     backdrop.style.display = 'none';
// });

backdrop.addEventListener("click", (event) => {
    debugger;
    if (!popup.contains(event.target) && event.target !== popupLink) {
        popup.style.display = "none";
        backdrop.style.display = "none";
    }
});

const showLoader = () => {
    document.getElementById("loaderContainer").style.display = "flex";
};

const hideLoader = () => {
    document.getElementById("loaderContainer").style.display = "none";
    // Start with header animation

    setTimeout(() => {
        document.body.classList.add("animate-job-name");
    }, 500);

    setTimeout(function () {
        document.body.classList.add("animate-department-name");
    }, 1000); // After 1s

    setTimeout(function () {
        document.body.classList.add("animate-other-info");
    }, 1250); // After 1.5s

    setTimeout(function () {
        document.body.classList.add("animate-button-apply");
    }, 1500); // After 2s

    setTimeout(function () {
        document.body.classList.add("animate-button-back");
    }, 1750); // After 3s

    setTimeout(function () {
        document.body.classList.add("animate-job-description");
    }, 2250); // After 4s

    setTimeout(function () {
        document.body.classList.add("animate-job-owner-info");
    }, 3000); // After 4.5s
};

showLoader();

setTimeout(() => {
    hideLoader()
}, 2000);

const triggerCardAnimation = () => {
    const jobCards = document.querySelectorAll(".job-card");

    jobCards.forEach(function (card) {
        const rect = card.getBoundingClientRect();

        // If the card is in the viewport, add the animate class
        if (rect.top < window.innerHeight) {
            card.classList.add("animate-cards");
        }
    });
}
triggerCardAnimation();

document.addEventListener("scroll", triggerCardAnimation);
// document.addEventListener("load", triggerCardAnimation);


document.addEventListener('DOMContentLoaded', function() {
    var ul = document.querySelector('.scrollable-list');
    
    function checkScroll() {
        if (ul.scrollTop > 0) {
            ul.classList.add('scrolled');
        } else {
            ul.classList.remove('scrolled');
        }
    }

    ul.addEventListener('scroll', checkScroll);
    checkScroll(); // Initial check
});








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

document.addEventListener("scroll", triggerCardAnimation);

document.addEventListener('DOMContentLoaded', () => {
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

const showLoader = () => {
    document.getElementById('loaderContainer').style.display = 'flex';
}

const hideLoader = () => {
    document.getElementById('loaderContainer').style.display = 'none';
    document.body.classList.add('animate-header');
    setTimeout(function() {
        document.body.classList.add('animate-filters');
        setTimeout(() => {
            triggerCardAnimation();
        }, 1000);
    }, 1600);
    
}

showLoader();

setTimeout(() => {
    hideLoader()
}, 2000);














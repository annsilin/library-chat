const profileBtn = document.querySelector(".btn-profile");
let profileMenu = document.getElementById("drop-menu-profile-no-auth");
let profileCardNumber = document.getElementById("drop-menu-profile-card-number");
const profileMenuLinks = [...document.querySelectorAll(".drop-menu-profile-btn")];

if (currentUser) {
    profileMenu = document.getElementById("drop-menu-profile-auth");
    if (profileCardNumber) {
        profileCardNumber.innerText = currentUser.cardNumber;
    }
}

if (profileBtn && profileMenu) {
    profileBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        profileMenu.classList.toggle("drop-menu-profile-active");

        // Decrease card number font size if necessary
        if (profileCardNumber && typeof adjustFontSizeToFitParent === 'function') {
            adjustFontSizeToFitParent(profileMenu, profileCardNumber, 8, 15);
        }
    });

    document.addEventListener("click", (e) => {
        if (!profileMenu.contains(e.target) && !profileBtn.contains(e.target) || profileMenuLinks.includes(e.target)) {
            profileMenu.classList.remove("drop-menu-profile-active");
        }
    }, {capture: true});
}

/* Decrease element's font size in case it overflows its container */
const adjustFontSizeToFitParent = (container, child, minFontSize, initFontSize) => {
    if (!container || !child) {
        console.warn('adjustFontSizeToFitParent: container or child is null');
        return;
    }

    const maxWidth = container.offsetWidth - 2;

    child.style.fontSize = initFontSize + 'px';

    while (child.scrollWidth > maxWidth && initFontSize > minFontSize) {
        initFontSize -= 1;
        child.style.fontSize = initFontSize + 'px';
    }
};

/* Make function globally accessible */
window.adjustFontSizeToFitParent = adjustFontSizeToFitParent;
const updateUI = () => {
    if (!currentUser) return;

    // Change profile button icon to first name and last name initials in header
    let btnProfile = document.querySelector(".btn-profile");
    if (btnProfile) {
        btnProfile.innerHTML = `${Array.from(currentUser.firstName)[0].toUpperCase() + Array.from(currentUser.lastName)[0].toUpperCase()}`;
        btnProfile.style.backgroundColor = '#FFFFFF';
        let fullName = currentUser.firstName + " " + currentUser.lastName;
        btnProfile.setAttribute('title', fullName);
    }

    // Update library card section if elements exist
    const getCardButtonsWrapper = document.querySelector(".get-card-buttons-wrapper");
    const profileBtn = document.getElementById("profile-btn");
    const cardWrapper = document.querySelector('.card-form-wrapper');

    if (getCardButtonsWrapper && profileBtn) {
        // Replace sign up and log in buttons with profile button in 'Get Card' section
        getCardButtonsWrapper.style.display = 'none';
        profileBtn.style.display = 'block';
    }

    if (cardWrapper && typeof changeReadersCard === 'function') {
        // Display Reader's card with user's info
        cardWrapper.classList.add('switch');
        changeReadersCard(currentUser);

        const cardSubtitle = document.querySelector(".card-subtitle");
        if (cardSubtitle) {
            cardSubtitle.innerText = "Your Library card";
        }
    }
};

addEventListener("DOMContentLoaded", () => {
    if (currentUser) {
        updateUI();
    }
});
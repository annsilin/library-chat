const modalProfile = document.querySelector(".modal-profile");
const modalSignUp = document.querySelector(".modal-register");
const modalSignIn = document.querySelector(".modal-login");
const modalBuyCard = document.querySelector(".modal-buy-card");
const overlay = document.querySelector(".overlay");
const signUpBtns = document.querySelectorAll(".sign-up");
const signInBtns = document.querySelectorAll(".log-in");
const profileBtns = document.querySelectorAll(".my-profile");
const closeBtns = document.querySelectorAll(".btn-close");

const modals = [modalProfile, modalSignUp, modalSignIn].filter(modal => modal !== null);
if (modalBuyCard) {
    modals.push(modalBuyCard);
}

signUpBtns.forEach(button => {
    button.addEventListener("click", (e) => {
        e.stopPropagation();

        // If modal doesn't exist, redirect to main page
        if (!modalSignUp) {
            window.location.href = 'index.html#sign-up';
            return;
        }

        closeModal(modals);
        openModal(modalSignUp);
    });
});

signInBtns.forEach(button => {
    button.addEventListener("click", (e) => {
        e.stopPropagation();

        // If modal doesn't exist, redirect to main page
        if (!modalSignIn) {
            window.location.href = 'index.html#log-in';
            return;
        }

        closeModal(modals);
        openModal(modalSignIn);
    });
});

profileBtns.forEach(button => {
    button.addEventListener("click", (e) => {
        e.stopPropagation();

        // If modal doesn't exist, redirect to profile page
        if (!modalProfile) {
            window.location.href = 'profile.html';
            return;
        }

        closeModal(modals);
        openModal(modalProfile);

        // Decrease name font size if necessary
        const modalUserName = document.querySelector(".modal-profile__user-name");
        const modalUserNameFirst = document.querySelector(".modal-profile__user-name-first");
        const modalUserNameLast = document.querySelector(".modal-profile__user-name-last");

        if (modalUserName && modalUserNameFirst) {
            adjustFontSizeToFitParent(modalUserName, modalUserNameFirst, 8, 20);
        }
        if (modalUserName && modalUserNameLast) {
            adjustFontSizeToFitParent(modalUserName, modalUserNameLast, 8, 20);
        }
    });
});

/* Close modals upon clicking on close button or overlay */
[...closeBtns, overlay].forEach(button => {
    if (button) {
        button.addEventListener("click", () => {
            closeModal(modals);
        });
    }
});

/* Helper function to open modal */
const openModal = (modal) => {
    if (!modal) {
        console.warn('Cannot open modal: modal element is null');
        return;
    }

    if (!overlay) {
        console.warn('Cannot open modal: overlay element is null');
        return;
    }

    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
};

/* Helper function to close modal */
const closeModal = (modals) => {
    modals.forEach(modal => {
        if (modal) {
            modal.classList.add("hidden");

            if (modal === modalSignIn && typeof clearSignInForm === 'function') {
                clearSignInForm();
            }
            if (modal === modalSignUp && typeof clearSignUpForm === 'function') {
                clearSignUpForm();
            }
            if (modal === modalBuyCard && typeof clearBuyCardForm === 'function') {
                clearBuyCardForm();
            }
        }
    });

    if (overlay) {
        overlay.classList.add("hidden");
    }
};
const updateProfileModal = (user) => {
    // Check if modal elements exist before updating
    const userPic = document.querySelector(".modal-profile__user-pic");
    const userNameFirst = document.querySelector(".modal-profile__user-name-first");
    const userNameLast = document.querySelector(".modal-profile__user-name-last");
    const infoCardVisits = document.querySelector(".modal-profile__info-card-visits");
    const infoCardBooks = document.querySelector(".modal-profile__info-card-books");
    const infoLibraryCardNumber = document.querySelector(".modal-profile__info-library-card-number");
    const booksUl = document.querySelector(".modal-profile__info-books-list");

    if (!userPic || !userNameFirst || !userNameLast) {
        // Modal elements don't exist on this page
        return;
    }

    // Update user credentials
    userPic.innerText = Array.from(user.firstName)[0].toUpperCase() +
        Array.from(user.lastName)[0].toUpperCase();
    userNameFirst.innerText = user.firstName;
    userNameLast.innerText = user.lastName;

    if (infoCardVisits) infoCardVisits.innerText = user.visits;
    if (infoCardBooks) infoCardBooks.innerText = user.books.length;
    if (infoLibraryCardNumber) infoLibraryCardNumber.innerText = user.cardNumber;

    // Generate list of purchased books
    if (booksUl) {
        booksUl.innerHTML = ''; // Clear the list to avoid duplicates when buying a book
        for (let bookID of user.books) {
            let foundBook = books.find(book => book.id === bookID);
            if (foundBook) {
                let bookLi = document.createElement('li');
                bookLi.className = 'modal-profile__info-books-list-item';
                bookLi.innerHTML = `${foundBook.title}, ${foundBook.author}`;
                booksUl.append(bookLi);
            }
        }
    }
}

addEventListener("DOMContentLoaded", () => {
    if (currentUser) {
        updateProfileModal(currentUser);
    }
});

const copyToClipboard = () => {
    const cardNumber = document.querySelector(".modal-profile__info-library-card-number");
    if (cardNumber) {
        navigator.clipboard.writeText(cardNumber.innerText);
    }
}
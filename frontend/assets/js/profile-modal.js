const updateProfileModal = (user) => {
  // Update user credentials
  document.querySelector(".modal-profile__user-pic").innerText = Array.from(user.firstName)[0].toUpperCase() +
    Array.from(user.lastName)[0].toUpperCase();
  document.querySelector(".modal-profile__user-name-first").innerText = user.firstName;
  document.querySelector(".modal-profile__user-name-last").innerText = user.lastName;
  document.querySelector(".modal-profile__info-card-visits").innerText = user.visits;
  document.querySelector(".modal-profile__info-card-books").innerText = user.books.length;
  document.querySelector(".modal-profile__info-library-card-number").innerText = user.cardNumber;

  // Generate list of purchased books
  let booksUl = document.querySelector(".modal-profile__info-books-list");
  booksUl.innerHTML = ''; // Clear the list to avoid duplicates when buying a book
  for (let bookID of user.books) {
    let foundBook = books.find(book => book.id === bookID);
    let bookLi = document.createElement('li');
    bookLi.className = 'modal-profile__info-books-list-item';
    bookLi.innerHTML = `${foundBook.title}, ${foundBook.author}`;
    booksUl.append(bookLi);
  }
}

addEventListener("DOMContentLoaded", () => {
  if (currentUser) {
    updateProfileModal(currentUser);
  }
});

const copyToClipboard = () => {
  const cardNumber = document.querySelector(".modal-profile__info-library-card-number");
  navigator.clipboard.writeText(cardNumber.innerText);
}

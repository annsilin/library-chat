const updateUI = () => {
  // Change profile button icon to first name and last name initials in header
  let btnProfile = document.querySelector(".btn-profile");
  btnProfile.innerHTML = `${Array.from(currentUser.firstName)[0].toUpperCase() + Array.from(currentUser.lastName)[0].toUpperCase()}`;
  btnProfile.style.backgroundColor = '#FFFFFF';
  let fullName = currentUser.firstName + " " + currentUser.lastName;
  btnProfile.setAttribute('title', fullName);


  if (document.querySelector(".get-card-buttons-wrapper")) {
  // Replace sign up and log in buttons with profile button in 'Get Card' section
  document.querySelector(".get-card-buttons-wrapper").style.display = 'none';
  document.getElementById("profile-btn").style.display = 'block';

  // Display Reader's card with user's info
  cardWrapper.classList.toggle('switch');
  changeReadersCard(currentUser);
  document.querySelector(".card-subtitle").innerText = "Your Library card";}
};

addEventListener("DOMContentLoaded", () => {
  if (currentUser) {
    updateUI();
  }
});

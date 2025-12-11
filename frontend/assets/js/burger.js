let burgerButton = document.getElementById("burger-button");
let navigation = document.getElementById("navigation");
let navigationLinks = document.getElementById("navigation__links");

burgerButton.addEventListener("click", (e) => {
  e.stopPropagation();
  burgerButton.classList.toggle("onclick");
  navigation.classList.toggle("onclick");
  navigationLinks.classList.toggle("onclick");
});

document.addEventListener("click", (e) => {
  if (![navigation, navigationLinks, burgerButton].includes(e.target) && !burgerButton.contains(e.target)) {
    burgerButton.classList.remove("onclick");
    navigation.classList.remove("onclick");
    navigationLinks.classList.remove("onclick");
  }
}, { capture: true });

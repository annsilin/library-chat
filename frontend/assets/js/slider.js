const carousel = document.querySelector(".carousel");
const carouselWrapper = document.querySelector(".carousel-visible");
const arrowLeft = document.querySelector(".carousel-arrow.left");
const arrowRight = document.querySelector(".carousel-arrow.right");
const paginationBtnsContainer = document.querySelector(".carousel-pagination");

let photoIndex = 0; // Carousel starts at the 1st photo
let paginationButtons = Array.from(paginationBtnsContainer.children);

let translateFactor = -475; // Amount of pixels used to translate the photo (width + gap)

/* Initialize the carousel with the first photo */
window.addEventListener("load", () => {
  updateCarousel(photoIndex);
  updateUIForScreenWidth();
});

window.addEventListener("resize", () => {
  updateUIForScreenWidth();
});

arrowLeft.addEventListener("click", () => {
  updateCarousel(photoIndex - 1);
});

arrowRight.addEventListener("click", () => {
  updateCarousel(photoIndex + 1);
});

paginationBtnsContainer.addEventListener("click", (e) => {
  // Find pagination button that was clicked
  const targetBtn = e.target.closest(".carousel-pagination__button");
  if (targetBtn) {
    // Get its index and update carousel using it
    const newIndex = paginationButtons.indexOf(targetBtn);
    updateCarousel(newIndex);
  }
});

/* Make left/right arrow inactive if necessary */
const toggleArrows = () => {
  if (photoIndex === 0) {
    arrowLeft.classList.add("inactive");
  } else {
    arrowLeft.classList.remove("inactive");
  }

  if (photoIndex === 4) {
    arrowRight.classList.add("inactive");
  } else {
    arrowRight.classList.remove("inactive");
  }
}

/* Move photos in the carousel */
const updateCarousel = (index) => {
  // If index reached 0 -> we can't slide left anymore
  if (index < 0) {
    index = 0;
    // If index reached max value -> we can't slide right anymore
  } else if (index >= paginationButtons.length) {
    index = paginationButtons.length - 1;
  }
  photoIndex = index;
  paginationButtons.forEach((btn, i) => {
    // If pagination btn index = photo index -> make it active, else - inactive
    btn.classList.toggle("carousel-pagination__button-active", i === index);
  });
  // Move the photo in the carousel
  carousel.style.transform = `translate(${index * translateFactor}px)`;
  // Make left/right arrow inactive if necessary
  toggleArrows();
}

/* Display or hide arrows */
const showArrows = (show) => {
  if (show === true) {
    arrowLeft.style.display = "block";
    arrowRight.style.display = "block";
  } else if (show === false) {
    arrowLeft.style.display = "none";
    arrowRight.style.display = "none";
  }
};

const updateUIForScreenWidth = () => {
  const screenWidth = window.innerWidth;

  if (screenWidth < 694) {
    // Since the photos start scaling at this resolution we need to get the new width
    let photoWidth = document.querySelector(".carousel__photo").offsetWidth;
    // In order to update carousel wrapper accordingly
    carouselWrapper.style.width = photoWidth + 'px';
    // And translate factor
    translateFactor = -25 - photoWidth;
    // Update carousel so that it doesn't get stuck in between photos
    updateCarousel(photoIndex);
  } else if (screenWidth < 1024) {
    // Display arrows
    showArrows(true);
    // Set carouselWrapper width to 450px (1 photo)
    carouselWrapper.style.width = "450px";
    // Show all 5 pagination buttons
    paginationButtons[paginationButtons.length - 1].style.display = "block";
    paginationButtons[paginationButtons.length - 2].style.display = "block";
    // Keep the original translate factor
    translateFactor = -475;
    updateCarousel(photoIndex);
  } else if (screenWidth >= 1024 && screenWidth <= 1400) {
    // Hide arrows
    showArrows(false);
    // Set carouselWrapper width to 900px (2 photos)
    carouselWrapper.style.width = "900px";
    // Hide the last (5th) pagination button
    paginationButtons[paginationButtons.length - 1].style.display = "none";
    paginationButtons[paginationButtons.length - 2].style.display = "block";
    // Keep the original translate factor
    translateFactor = -475;
    // If carousel was at the last pagination button (5th) (which was hidden)
    if (photoIndex === 4) {
      // Move it to the new last pagination button (4th)
      updateCarousel(3);
    }
  } else if (screenWidth > 1400) {
    // Hide arrows
    showArrows(false);
    // Set carouselWrapper width to 1350px (3 photos)
    carouselWrapper.style.width = "1350px";
    // Hide the last two (4th and 5th) pagination buttons
    paginationButtons[paginationButtons.length - 1].style.display = "none";
    paginationButtons[paginationButtons.length - 2].style.display = "none";
    // Keep the original translate factor
    translateFactor = -475;
    // If carousel was at any of last two pagination buttons (4th or 5th) (which were hidden)
    if (photoIndex === 4 || photoIndex === 3) {
      // Move it to the new last pagination button (3rd)
      updateCarousel(2);
    }
  }
};






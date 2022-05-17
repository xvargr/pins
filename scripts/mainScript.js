// navbar sliding function
function navSlide() {
  const burger = document.querySelector(".burger");
  const nav = document.querySelector(".mobileHeaderItems");
  const mainHeader = document.querySelector(".mainHeader");
  const mainTitle = document.querySelector(".mainTitle");
  const headerItems = document.querySelectorAll(".mobileHeaderItems li");

  burger.addEventListener("click", function () {
    nav.classList.toggle("mobileHeaderItemsActive");
    mainHeader.classList.toggle("headerHidden");
    mainTitle.classList.toggle("titleHidden");
  }); //toggle navbar menu
}

// TODO create event delegation for cards to link to show page
// index page card links
// const indexCards = document.querySelector(".columnContainer");

// indexCards.addEventListener(e) {
//   let target = e.target;
//   console.log(e);
//   // if (target === )
// }

function app() {
  navSlide();
  cardLink();
}

app();

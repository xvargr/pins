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

function app() {
  navSlide();
}

app();

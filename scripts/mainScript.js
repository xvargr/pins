// navbar sliding function
function navSlide() {
  const burger = document.querySelector(".burger");
  const nav = document.querySelector(".mobileHeaderItems");
  const mainHeader = document.querySelector(".mainHeader");
  const mainTitle = document.querySelector(".mainTitle");

  // add event to the burger which toggles visibility of menus
  burger.addEventListener("click", function () {
    nav.classList.toggle("mobileHeaderItemsActive");
    mainHeader.classList.toggle("headerHidden");
    mainTitle.classList.toggle("titleHidden");
  }); //toggle navbar menu
}

// add event listener that goes to specific link of lib to each card
// tried to use event delegation but this turned out to be easier
// massive problem trying to get data like the specific link of each card
//-// after completing this I discovered that you can directly inject
//-// variables into the js file on teh page
function cardLink() {
  if (window.location.pathname === "/libraries") {
    const indexContainer = document.querySelector(".columnContainer");
    for (let card of indexContainer.children) {
      card.addEventListener("click", function (e) {
        window.location = `/libraries/${card.children[1].firstElementChild.id}`;
      });
    }
  }
}

function app() {
  navSlide();
  cardLink();
}

app();

// navbar sliding function
function navSlide() {
  const burger = document.querySelector(".burger");
  const nav = document.querySelector(".mobileHeaderItems");
  const mainHeader = document.querySelector(".mainHeader");
  const mainTitle = document.querySelector(".mainTitle");

  // add event to the burger which toggles visibility of menus
  burger.addEventListener("click", function () {
    nav.classList.toggle("mobileHeaderItemsActive");
    if (
      //this only needs to run on the homepage, no other page has a main banner
      window.location.pathname === "/libraries" ||
      window.location.pathname === "/libraries/"
    ) {
      mainHeader.classList.toggle("headerHidden");
      mainTitle.classList.toggle("titleHidden");
    }
  }); //toggle navbar menu
}

// add event listener that goes to specific link of lib to each card
// tried to use event delegation but this turned out to be easier
// massive problem trying to get data like the specific link of each card
//-// after completing this I discovered that you can directly inject
//-// variables into the js file on the page

// old cardLink that uses id as variable
// function cardLink() {
//   if (
//     window.location.pathname === "/libraries" ||
//     window.location.pathname === "/libraries/"
//   ) {
//     const indexContainer = document.querySelector(".columnContainer");
//     console.log(indexContainer);
//     for (let card of indexContainer.children) {
//       console.log(typeof card);
//       card.addEventListener("click", function (e) {
//         window.location = `/libraries/${card.children[1].firstElementChild.id}`;
//       });
//     }
//   }
// }

// new cardLink which uses resultExport variable passed in object
function cardLink() {
  if (
    //if current page are one of these;
    window.location.pathname === "/libraries" ||
    window.location.pathname === "/libraries/"
  ) {
    const columnContent = document.getElementsByClassName("columnContent"); //select content container
    for (let card of columnContent) {
      card.addEventListener("click", function () {
        let index = Array.from(columnContent).indexOf(card); //make array from columnContent, then get the current index of card
        window.location = `/libraries/${resultExport[index]._id}`; //set the event listener link to the id of that index from imported data object
      });
    }
  }
}

// client-side form validation
// runs when form is submitted, returns false if validation failed, true if successful
function formValidation() {
  if (
    window.location.pathname === "/libraries/new" ||
    window.location.pathname === "/libraries/edit"
  ) {
    // selecting form elements
    const name = document.querySelector("#name");
    const description = document.querySelector("#description");
    const location = document.querySelector("#location");
    const fee = document.querySelector("#fee");
    const file = document.querySelector("#file");
    // const fields = [name, description, location, fee, file];

    function fieldOK(field) {
      //if field passes validation
      console.log(`the ${field.id} field passed validation`);
      field.classList.add("formValidationPassed");
      // field.style.borderColor = "red";
    }
    function fieldErr(field) {
      //if field fails validation
      console.log(`the ${field.id} field failed validation`);
      field.classList.add("formValidationFailed");
    }

    //checking fields
    if (!name.value) {
      fieldErr(name);
      return false;
    }
  }
}

// run these functions on every request
function app() {
  navSlide();
  cardLink();
}

app();

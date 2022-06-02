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
  //if current page is the index page
  if (window.location.pathname.indexOf("libraries") !== -1) {
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
const validateForm = {
  // MODULAR apply classes to indicate valid and invalid fields
  fieldOK(field) {
    //if field passes validation
    // console.log(`${field.id} field passed validation`);
    field.className = "";
    field.classList.add("formValidationPassed");
  },
  fieldErr(field) {
    //if field fails validation
    // console.log(`${field.id} field failed validation`);
    field.className = "";
    field.classList.add("formValidationFailed");
    field.placeholder = "This field is required!";
  },
  // MODULAR check if required fields are empty
  isRequired(fields) {
    let formComplete = true;
    // new field check, iterative
    for (let field of fields) {
      // console.log(field);
      if (!field.value) {
        // if the field is empty
        this.fieldErr(field);
        formComplete = false;
      } else {
        this.fieldOK(field);
      }
    }
    return formComplete;
  },
  // Specific edit form validation
  editForm() {
    console.log("---> client side edit form validation running");
    // selecting form elements
    const name = document.querySelector("#name");
    const description = document.querySelector("#description");
    const location = document.querySelector("#location");
    const fee = document.querySelector("#fee");
    // file section temporarily removed while figuring out how to store it
    // const file = document.querySelector("#file");
    // const fields = [name, description, location, fee, file];
    const fields = [name, description, location, fee];
    const formComplete = this.isRequired(fields);
    if (formComplete === false) {
      console.log("---> client side form validation failed");
      return false;
    }
    console.log("---> client side edit validation passed");
  },
  // review form validation
  //
  //  NOT COMPLETE!!!
  //
  reviewForm() {
    const review = document.querySelector("#review");
    const rating = document.querySelector("[name='review[rating]']:checked");
    const fields = [review, rating];
    const formComplete = this.isRequired(fields);
    if (formComplete === false) {
      console.log("---> client side form validation failed");
      return false;
    }
    console.log("---> client side edit validation passed");
  },
  // IDEA - make a function which accepts args that are the names, id, class of the elements that needs to be verified and do so
};

// run these functions on every request
function app() {
  navSlide();
  cardLink();
}

app();

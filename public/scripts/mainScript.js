// navbar sliding function
function navSlide() {
  const burger = document.querySelector(".burger");
  const nav = document.querySelector(".mobileHeaderItems");
  const mainHeader = document.querySelector(".mainHeader");

  // add event to the burger which toggles visibility of menus
  burger.addEventListener("click", function () {
    nav.classList.toggle("mobileHeaderItemsActive");
    if (
      //this only needs to run on the homepage, no other page has a main banner
      window.location.pathname === "/libraries" ||
      window.location.pathname === "/libraries/"
    ) {
      // big hassle, map wont scale correctly if transitions are applied
      if (mainHeader.classList.contains("headerHidden")) {
        mainHeader.classList.toggle("transitionTrue");
        mainHeader.style = "";
        setTimeout(function () {
          mainHeader.classList.toggle("transitionTrue");
        }, 150);
      } else {
        mainHeader.classList.toggle("transitionTrue");
        mainHeader.style = "height: 0";
        setTimeout(function () {
          mainHeader.classList.toggle("transitionTrue");
        }, 150);
      }
      mainHeader.classList.toggle("headerHidden");
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
  // most of these can be refactored, just accept id and validate fields
  // Specific edit form validation
  library(ignore = []) {
    // console.log("---> client side edit form validation running");
    // selecting form elements
    const name = document.querySelector("#name");
    const description = document.querySelector("#description");
    const location = document.querySelector("#location");
    const fee = document.querySelector("#fee");
    const img = document.querySelector("#img");
    const fields = [name, description, location, fee, img];

    // remove ignored fields from validation
    // legacy, as onsubmit is not allowed by content security policy
    if (ignore.length > 0) {
      const fieldKeys = [];
      fields.forEach((field) => fieldKeys.push(field.getAttribute("id"))); // make new array of keys from fields, acts as 1 to 1 index for string comparison
      ignore.forEach((field) => fields.splice(fieldKeys.indexOf(field), 1)); // remove all elements in ignore attr from fields
    }

    const formComplete = this.isRequired(fields);
    if (formComplete === false) {
      // console.log("---> client side form validation failed");
      return false;
    }
    // console.log("---> client side form validation passed");
  },
  // review form validation
  review() {
    const review = document.querySelector("#review");
    const rating = document.querySelector("[name='review[rating]']:checked");
    const fields = [review, rating];
    const formComplete = this.isRequired(fields);
    if (formComplete === false) {
      // console.log("---> client side form validation failed");
      return false;
    }
    // console.log("---> client side form validation passed");
  },
  // login form validation
  user() {
    const username = document.querySelector("#username");
    const password = document.querySelector("#password");
    const fields = [username, password];
    const formComplete = this.isRequired(fields);
    if (formComplete === false) {
      // console.log("---> client side form validation failed");
      return false;
    }
    // console.log("---> client side form validation passed");
  },
  newUser() {
    const username = document.querySelector("#newUsername");
    const email = document.querySelector("#newEmail");
    const password = document.querySelector("#newPassword");
    const fields = [username, password, email];
    const formComplete = this.isRequired(fields);
    if (formComplete === false) {
      // console.log("---> client side form validation failed");
      return false;
    }
    // console.log("---> client side form validation passed");
  },
  // IDEA - make a function which accepts args that are the names, id, class of the elements that needs to be verified and do so
};

// content security policy directive - no inline event workaround for form validation
// inline ver onsubmit="return validateForm.library(['img'])
function attachValidator() {
  // console.log(typeof document.querySelector("video") !== null);
  if (typeof document.querySelector("form") !== null) {
    const forms = document.querySelectorAll("form");
    // console.log(typeof form);
    // console.log(Object.entries(form));
    Object.entries(forms).forEach(function (form) {
      // dataset weirdness, changes the attribute name >:(
      console.log(form[1].dataset.formType);
      // let hey = form[1].dataset.formType;
      // console.log(hey);
      // form[1].style.backgroundColor = "magenta";
      form[1].addEventListener("submit", function (e) {
        // TODO: form submit function
        e.preventDefault();
        console.log(`${form[1].dataset.formType} form clicked`);
        // return false;
      });
    });
    // object.forEach.addEventListener("click", function () {
    //   console.log("click");
    // });
  }
}

// basic functionality to the flash messages, close button
// TODO add failure
// SVG object does not respond to addeventlistener for some reason
function dismissMessage() {
  const closeButton = document.querySelector(".closeButton");
  const flashMessage = document.querySelector(".flashMessage");
  if (closeButton !== null) {
    // note to self, can't place event listener on objects for some reason

    function removeButton() {
      // some simple transition before removing element
      // avoiding animation keyframes by setting transition styling in js
      flashMessage.style.transition = "opacity 500ms ease";
      flashMessage.style.opacity = 0;
      // delete the element after the same amount of time the animation takes
      setTimeout(function () {
        flashMessage.closest("body").removeChild(flashMessage);
      }, 500);
    }

    // closeButton.addEventListener("click", removeButton()); // callback will trigger without input
    // some weirdness about closures?? straight calling the function will always
    // trigger the event listener without input, but calling removeButton with
    // .bind or in another function will not. Do not understand this
    closeButton.addEventListener("click", removeButton.bind(this));

    // auto dismiss message after 5 sec
    setTimeout(removeButton.bind(this), 5000); // same issue here
  }
}

function serveAuthForm() {
  //check if not logged in, then show sign in, else show sign out
  const authButton = document.querySelector("#loginButton");
  const authFormOverlay = document.querySelector(".authFormOverlay");
  const authFormToggleButton = document.querySelector("#authFormToggleButton");
  const signInForm = document.querySelector(".signInForm");
  const registerForm = document.querySelector(".registerForm");

  // auth button click brings up auth overlay
  authButton.addEventListener("click", function () {
    authFormOverlay.style.display = "flex";
    authFormOverlay.focus();
  });
  // if esc or click on other area except form, close overlay
  ["click", "keydown"].forEach((event) => {
    authFormOverlay.addEventListener(event, function (e) {
      if (e.type === "click" && e.target.className === "authFormOverlay") {
        authFormOverlay.style.display = "none";
      } else if (e.key === "Escape") {
        authFormOverlay.style.display = "none";
      }
    });
  });

  // form toggle button
  authFormToggleButton.addEventListener("click", function () {
    registerForm.classList.toggle("hidden");
    signInForm.classList.toggle("hidden");
    if (authFormToggleButton.innerText === "Sign Up") {
      authFormToggleButton.innerText = "Sign In";
    } else if (authFormToggleButton.innerText === "Sign In") {
      authFormToggleButton.innerText = "Sign Up";
    }
  });

  // refactored
  // authFormOverlay.addEventListener("click", function (e) {
  //   console.log(e);
  //   console.dir(e.target.className);
  //   if (e.target.className === "authFormOverlay") {
  //     authFormOverlay.style.display = "none";
  //   }
  // });
  // authFormOverlay.addEventListener("keydown", function (e) {
  //   console.log(e);
  //   console.log(e.key);
  //   if (e.key === "Escape") {
  //     authFormOverlay.style.display = "none";
  //   }
  // });
}

function carousel() {
  // only run on details page
  // regex on every path might not be the most efficient way to do this check
  // makes use of injected results variable from ejs to make an array of the urls
  // console.log(resultExport);
  // console.log(/libraries\/[\w\d]*$/m.test(window.location.pathname));
  // console.log(document.querySelector("#prev") === null);
  // if (/libraries\/[\w\d]*$/m.test(window.location.pathname)) {
  if (document.querySelector("#prev") !== null) {
    // console.log("carousel function ran");
    const previous = document.querySelector("#prev");
    const next = document.querySelector("#next");
    const img = document.querySelector("#img");
    const imgArray = resultExport.images.map((images) => images.url);
    let index = 0; // keep track of position in carousel
    // console.log(imgArray);

    next.addEventListener("click", function () {
      if (index === imgArray.length - 1) {
        index = 0;
      } else {
        index++;
      }
      // console.log(index);
      img.src = imgArray[index];
      // console.log(img.src);
    });

    previous.addEventListener("click", function () {
      if (index === 0) {
        index = imgArray.length - 1;
      } else {
        index--;
      }
      // console.log(index);
      img.src = imgArray[index];
      // console.log(img.src);
    });
  }
}

function showMap() {
  const mapButton = document.querySelector(".mapButton");
  if (mapButton !== null) {
    const mapDiv = document.querySelector("#detailsMap");
    const carousel = document.querySelector(".carousel");
    mapButton.addEventListener("click", () => {
      // mapDiv.style.height = "60%";
      // carousel.style.height = 0;
      mapDiv.classList.toggle("hidden");
      carousel.classList.toggle("hidden");
      if (mapButton.innerText === "VIEW") {
        mapButton.innerText = "HIDE";
      } else {
        mapButton.innerText = "VIEW";
      }
    });
  }
}

// run these functions on every request
function app() {
  // not on home page
  if (window.location.pathname !== "/") {
    navSlide();
    cardLink();
    carousel();
    serveAuthForm();
    showMap();
  }
  // everywhere
  attachValidator();
  dismissMessage();
}

app();

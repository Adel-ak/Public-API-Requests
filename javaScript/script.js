"use strict";

let employeeList = []; //list of all employees on the page
let employeeListFiltered = []; //list of all filtered employees on the page
let addToGallery; //html markup with details of employees to be added to gallery div
let nextPre = null; //will hold a number for next and previous buttons
let prev;//querySelector for prev button used in modalCard function
let next;// ^ same
const mainContainer = document.querySelector(".modal-container");
const galleryField = document.querySelector("#gallery");
const SearchButton = document.querySelector('input[type="submit"]');
const SearchField = document.querySelector('input[type="search"]');
const showMore = document.querySelector("#show-more");

/**
 * event to handle next/prev/close buttons
 * call back modalCard to show next/prev employees by passing in the array object of employeeListFiltered
 * for eg if nextPre value is 1 and next is clicked then employeeListFiltered[2] will show.
 */
mainContainer.addEventListener("click", e => {
  if (e.target.id === "modal-prev" && nextPre >= 1) {
    nextPre -= 1;
    modalCard(employeeListFiltered, nextPre);
  } else if (e.target.id === "modal-next" && nextPre < employeeListFiltered.length - 1) {
    nextPre += 1;
    modalCard(employeeListFiltered, nextPre);
  } else if (
    e.target.id === "modal-close-btn" ||
    e.target.tagName === "STRONG"
  ) {
    document.body.style.overflow = "";
    mainContainer.style.display = "none";
  }
});

/**
 * event to handle search Button
 * callback lookup to show search employees
 */
SearchButton.addEventListener("click", e => {
  e.preventDefault();
  lookup();
});

/**
 * event to handle search field keyup
 * callback lookup to show search employees
 */
SearchField.addEventListener("keyup", () => {
  lookup();
});

/**
 * event to handle showMore/Back button
 * if showMore callback get and append 9 new employees
 * if Back callback get and replace all employees with 12 new ones
 */
showMore.addEventListener("click", e => {
  if (e.target.textContent === "SHOW MORE") {
    get(9, "append");
  } else {
    SearchField.value = "";
    employeeList = [];
    nextPre = null;
    get(12);
  }
});

//invoke get to start fetch on page load
get(12);
"use strict";

let employeeList = [];
let employeeListFiltered = [];
let addToGallery = '';
let addToModal;
let nextPre = null;
const mainContainer = document.querySelector('.modal-container');
const galleryField = document.querySelector("#gallery");
const SearchButton =  document.querySelector('input[type="submit"]');
const SearchField = document.querySelector('input[type="search"]');
const showMore = document.querySelector('#show-more');


showMore.addEventListener('click', (e) => {
  if (e.target.textContent === "SHOW MORE") {
    get(9,'append');
  } else {
    SearchField.value = "";
    employeeList = [];
    nextPre = null;
    get(12);
  }
});

mainContainer.addEventListener('click', (e) => {
if(e.target.id === "modal-prev" && nextPre >= 1){
  nextPre -= 1;
  modalCard(employeeListFiltered,nextPre)
}else if(e.target.id === "modal-next" && nextPre < employeeListFiltered.length-1){
  nextPre += 1;
  modalCard(employeeListFiltered,nextPre)
}else if (e.target.id === "modal-close-btn" || e.target.tagName === "STRONG") {
  $(mainContainer).hide();
  $("body").css("overflow", "");
}
});

SearchButton.addEventListener('click', (e) => {
  e.preventDefault();
  lookup();
});

SearchField.addEventListener('keyup', () => {
  lookup();
});

get(12);
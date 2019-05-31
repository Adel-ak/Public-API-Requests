"use strict";
// global variable
let addToGallery = "";//will hold html markup
let addToModal = "";//will hold html markup
let slideNum;//will hold a number

/*
elements to be used for parallax effect and slogan for main page
parallax form
https://www.youtube.com/watch?v=JttTcnidSdQ&t=755s
*/
$("header").before(
`<div class="pimg1">
  <div class="ptext">
    <p><span class="border">“Hire character.  Train skill.”</span></p>
  </div>
</div>`);

//Search markup to be used to search for specific employee
$(".search-container").append(
`<form action="#" method="get">
  <input type="search" id="search-input" class="search-input" placeholder="Search...">
  <input type="submit" value="&#x1F50D;" id="serach-submit" class="search-submit">
</form>`);

//Modal markup which will have the slideshow markup and next/prev buttons
$("#gallery").after(`
<div class="modal-container">
  <div class="swiper-container">
  <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
    <div class="swiper-wrapper">
    </div>
  </div>
  <div class="swiper-button-prev swiper-button-white"></div>
  <div class="swiper-button-next swiper-button-white"></div>
</div>`);

//hide modal at start of page
$(".modal-container").hide();

//added button after the modal div
$(".modal-container").after(`<button id="show-more">SHOW MORE</button>`);

/* 
swiper.js is a libraries which provides a collection of slide show
first we Initialize it, pass in a class name to the first parameter
second parameter will hold an object key & value
to know more about the object key & value of Swiper and what they do 
visit https://idangero.us/swiper/api/
*/
const mySwiper = new Swiper(".swiper-container", {
  effect: "flip",
  grabCursor: false,
  simulateTouch: false,
  height: '450.2',
  cubeEffect: {
    shadow: true,
    slideShadows: true,
    shadowOffset: 20,
    shadowScale: 0.94
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev"
  },
  keyboard: {
    enabled: true,
    onlyInViewport: false
  }
});

/**
 * Prints/adds to the page
 * @param {string} to pass 'html' or 'append' to select a method 
 * @param {variable} section pass variable which holds html markup to be added to div with id of gallery
 * @param {variable} section2 pass variable which holds html markup to be added to div with class of swiper-wrapper
 */
function print(to, section, section2) {
  if (to === "html") {
    $("#gallery").html(section);
    $(".swiper-wrapper").html(section2);
  } else if (to === "append") {
    $("#gallery").append(section);
    $(".swiper-wrapper").append(section2);
  }
}
/**
 * loop through class of no-skip to get the index of the clicked div 
 * and set the value of slideNum as the index to be used
 * for Swiper to slide to the given
 * form https://stackoverflow.com/questions/8801787/get-index-of-clicked-element-using-pure-javascript
 */
function slide() {
const g = document.querySelectorAll('.no-skip');
  for (let i = 0; i < g.length; i++){
    (function(index){
        g[i].onclick = function(){
          slideNum = index;
        }    
    })(i);
  }
}
 /**
  * API call to get the random users which will be 
  * @param {string} add pass 'html' or 'append' to pass it to the function print
  * @param {number} num to set the amount of employee to get 
  */
function ajax(add, num) {
  addToGallery = "";//rest variable to add new html markup to it
  addToModal = "";
  $.ajax({
    //specified the needed fields in url to get the required details only and passed in the amount of employee needed
    url: `https://randomuser.me/api/?inc=picture,name,email,location,cell,phone,dob&nat=US&results=${num}`,
    success: function(data) {
      const get = data.results;
      get.forEach(element => {
        // regex used to get the patterns needed for birthday
        const regex = /\d+(\d{2})-(\d{2})-(\d{2}).+/;
        const Birthday = element.dob.date.replace(regex, "Birthday: $3/$2/$1");
        //html mark up for gallery cards
        addToGallery += `<div class="card depth no-skip">
            <div class="card-img-container">
              <img class="card-img" src="${element.picture.large}" alt="profile picture">
            </div>
            <div class="card-info-container">
              <h3 id="name" class="card-name cap">${element.name.first} ${element.name.last}</h3>
              <p class="card-text">${element.email}</p>
              <p class="card-text cap">${element.location.city},${element.location.state}</p>
            </div>
          </div>`;

        /*******************************************************/
        //html mark up for modal cards
        addToModal += `<div class="modal swiper-slide">
              <div class="modal-info-container">
                  <img class="modal-img" src="${element.picture.large}" alt="profile picture">
                  <h3 id="name" class="modal-name cap">${element.name.first} ${element.name.last}</h3>
                  <p class="modal-text">${element.email}</p>
                  <p class="modal-text cap">${element.location.city}</p>
                  <hr>
                  <p class="modal-text">${element.phone}</p>
                  <p class="modal-text">${element.location.street},${element.location.state}  ${element.location.postcode}</p>
                  <p class="modal-text">${Birthday}</p>
              </div>
            </div>`;
      });
      //call print to pass in method and variables which holds html markup
      print(add, addToGallery, addToModal);
      slide();//called here to avoid bug
      $("#show-more").text("SHOW MORE");
    }
  });//end
}

/**
 * click event for the search button
 * ~check if the cards name in the screen has the search value 
 *  to show/hide the cards and add/remove no-skip class
 * ~check if the modal name in the screen has the search value 
 *  to show/hide the modal
 * ~check if input is/is not empty to change the text of the show-more button
 */
$('input[type="submit"]').on("click", function(e) {
  e.preventDefault();
  $(".card-name").each(function(index, ele) {
    const $element = $(ele).parent().parent()
    if (ele.textContent.includes($('input[type="search"]').val())) {
      $element.addClass("no-skip").show();
    } else {
      $element.removeClass("no-skip").hide();
    }
  });

  $(".modal-name").each(function(index, ele) {
    const $element = $(ele).parent().parent()
    if (ele.textContent.includes($('input[type="search"]').val())) {
      $element.show();
    } else {
      $element.hide();
    }
  });

  if ($('input[type="search"]').val() !== "") {
    $("#show-more").text("BACK");
  } else {
    $("#show-more").text("SHOW MORE");
  }
});//end

/**
 * keyup event for the search input
 * read comment of click event for the search button.
 * functions the same way
 */
$('input[type="search"]').on("keyup", function(e) {
  // e.preventDefault();
  $(".card-name").each(function(index, ele) {
    const $element = $(ele).parent().parent()
    if (ele.textContent.includes($(e.target).val())) {
      $element.addClass("no-skip").show();
    } else {
      $element.removeClass("no-skip").hide();
    }
  });

  $(".modal-name").each(function(index, ele) {
    const $element = $(ele).parent().parent()
    if (ele.textContent.includes($(e.target).val())) {
      $element.show();
    } else {
      $element.hide();
    }
  });

  if ($(e.target).val() !== "") {
    $("#show-more").text("BACK");
  } else {
    $("#show-more").text("SHOW MORE");
  }
});//end

/**
 * event listener
 * if button text is 'show more' append 9 more employee list to the page
 * if button text is not 'show more' add 12 new employee list to the page
 * update Swiper to avoid effect issues
 */
$("#show-more").click(function() {
  if ($(this).text() === "SHOW MORE") {
    ajax("append", 9);
  } else {
    $('input[type="search"]').val("");
    ajax("html", 12);
  }
});//end

/**
 * event listener gallery div which will fire when card div is clicked
 * slideNum which holds a number and passed to mySwiper.slideTo to start the slide form the selected employee
 * show modal-container which contains the slide show
 * update Swiper to avoid issues/bugs
 * hide scroll to avoid scrolling when modal-container is shown
 */
$("#gallery").on("click", "div", function(e) {
  slide();//called here to avoid bug
  mySwiper.slideTo(slideNum);
  $(".modal-container").show();
  mySwiper.update();
  $("body").css("overflow", "hidden");
});//end

/**
 * event to close modal-container when button/span is clicked and show scrolling once again
 */
$(".modal-container").on("click", function(e) {
  if (e.target.tagName === "BUTTON" || e.target.tagName === "STRONG") {
    $(".modal-container").hide();
    $("body").css("overflow", "");
  }
});//end

ajax("html", 12);
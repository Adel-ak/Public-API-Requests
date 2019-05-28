// https://idangero.us/swiper/

let addToHtml = "";
let addToHtml2 = "";
let lookName = {};
$("header").before(
  `<div class="pimg1">
<div class="ptext">
    <span class="border">
            gaffer.com
    </span>
</div>
</div>`
);

$(".search-container").append(`<form action="#" method="get">
  <input vaule="tom" type="search" id="search-input" class="search-input" placeholder="Search...">
  <input type="submit" value="&#x1F50D;" id="serach-submit" class="search-submit">
</form>`);
$(".modal-container").hide();

$("#gallery").after(`
  <div class="modal-container">
    <div class="swiper-container">
        <div class="swiper-wrapper">
        </div>
    </div>
    <div class="swiper-button-prev swiper-button-white"></div>
    <div class="swiper-button-next swiper-button-white"></div>
  </div>
  <button id="show-more">SHOW MORE</button>`);

$(".modal-container").hide();
function ajax(add, num) {
  addToHtml = "";
  addToHtml2 = "";
  $.ajax({
    url: `https://randomuser.me/api/?inc=picture,name,email,location,cell,phone,dob&results=${num}`,
    // data: {
    //   results: [{
    //     name:{
    //       first:'tom'
    //     }
    //   }]
    // },
    success: function(data) {
      const get = data.results;
      get.forEach(element => {
        const regx = /\d+(\d{2})-(\d{2})-(\d{2}).+/;
        const Brithday = element.dob.date;
        Brithday.replace(regx, "Brithday: $3/$2/$1");
        addToHtml += `<div class="card depth">
            <div class="card-img-container">
              <img class="card-img" src="${element.picture.medium}" alt="profile picture">
            </div>
            <div class="card-info-container">
              <h3 id="name" class="card-name cap">${element.name.first} ${element.name.last}</h3>
              <p class="card-text">${element.email}</p>
              <p class="card-text cap">${element.location.city},${element.location.state}</p>
            </div>
          </div>`;

        /*********************************************************************************/

        addToHtml2 += `<div class="modal swiper-slide">
              <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
              <div class="modal-info-container">
                  <img class="modal-img" src="${element.picture.medium}" alt="profile picture">
                  <h3 id="name" class="modal-name cap">${element.name.first} ${element.name.last}</h3>
                  <p class="modal-text">${element.email}</p>
                  <p class="modal-text cap">${element.location.city}</p>
                  <hr>
                  <p class="modal-text">${element.phone}</p>
                  <p class="modal-text">${element.location.street},${element.location.state}  ${element.location.postcode}</p>
                  <p class="modal-text">${Brithday.replace(regx,"Brithday: $3/$2/$1")}</p>
              </div>
            </div>`;
      });

      if (add === "html") {
        $("#gallery").html(addToHtml);
        $(".swiper-wrapper").html(addToHtml2);
      } else {
        $("#gallery").append(addToHtml);
        $(".swiper-wrapper").append(addToHtml2);
      }
    }
  });
}

$("#show-more").click(function() {
  ajax(undefined, 9);
});

const mySwiper = new Swiper(".swiper-container", {
  effect: "flip",
  grabCursor: false,
  simulateTouch: false,
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

$("#gallery").on("click", "div", function() {
  mySwiper.slideTo($(this).index());
  $(".modal-container").show();
  mySwiper.update();
  $("body").css("overflow", "hidden"); //to hide scroll
});

$(".modal-container").on("click", function(e) {
  if (e.target.tagName === "BUTTON" || e.target.tagName === "STRONG") {
    $(".modal-container").hide();
    $("body").css("overflow", "");
  }
});

ajax("html", 12);

"use strict";

/*
elements to be used for parallax effect and slogan for main page
parallax form
https://www.youtube.com/watch?v=JttTcnidSdQ&t=755s
*/
$("header").before(`
<div class="pimg1">
  <div class="ptext">
    <p><span class="border">“Hire character.  Train skill.”</span></p>
  </div>
</div>`);
  
    //Search markup to be used to search for specific employee
  $(".search-container").append(`
  <form action="#" method="get">
    <input type="search" id="search-input" class="search-input" placeholder="Search...">
    <input type="submit" value="&#x1F50D;" id="serach-submit" class="search-submit">
  </form>`);
  
  //Modal markup which will have the slideshow markup and next/prev buttons
  $("#gallery").after(`<div class="modal-container"></div>`);
  
  //hide modal at start of page
  $(".modal-container").hide();
  
  //added button after the modal div
  $(".modal-container").after(`
  <button id="show-more" style="display:none">SHOW MORE</button>`);




/**
  * fetch to get the random users
  * @param {number} num to set the amount of employee to get 
  * @param {string} method pass in 'html' or 'append' as a sting to add or replace the content in page (default is 'html', string will be passed to print method)
  */

const get = (num,method = 'html') =>{
  const url = `https://randomuser.me/api/?inc=picture,name,email,location,cell,phone,dob&nat=US&results=${num}`;
  fetch(url)
  .then(res => res.json())
  .then(res => {
    const employees = res.results;
    printToGallery(employees,method);
    showMore.textContent = "SHOW MORE";
  })
  .catch(rej => console.error('OOOH NO!!! ' + rej))
}

/**    
  * html mark up for gallery cards
  * @param {Array,object} list of employees
  * @param {string} method pass in 'html' or 'append' as a sting to add or replace the content in page (default is 'html', string will be passed to print method)
  */
const printToGallery = (list,method) => {
  addToGallery = '';
  list.forEach(emp => {
    addToGallery += 
    `<div class="card depth shown">
      <div class="card-img-container">
        <img class="card-img" src="${emp.picture.large}" alt="profile picture">
      </div>
      <div class="card-info-container">
        <h3 id="name" class="card-name cap">${emp.name.first} ${emp.name.last}</h3>
        <p class="card-text">${emp.email}</p>
        <p class="card-text cap">${emp.location.city},${emp.location.state}</p>
      </div>
    </div>`;
    employeeList.push(emp)
  });
  print(addToGallery,method)
  showCard();
  pushfiltered()
  $(showMore).show();
}

/**
 * loop through class of shown to get the index of the clicked div and shows modalCard
 * form https://stackoverflow.com/questions/8801787/get-index-of-clicked-element-using-pure-javascript
 * user Ashwin Krishnamurthy
 */
const showCard = () => {
  const g = document.querySelectorAll('.shown');
  for (let i = 0; i < g.length; i++){
    (function(index){
        g[i].onclick = function(){
          g[i].classList.add('active');
          nextPre = index
          modalCard(employeeListFiltered,nextPre);
        }    
    })(i);
  }
}
/**
 * push the details of shown eemployees from the whole 
 * employeeList array object to employeeListFiltered
 * 
 */
const pushfiltered = () => {
  employeeListFiltered = [];
  $('.card.depth.shown').each((index, ele) => {
    const pushList = employeeList[$(ele).index()];
    employeeListFiltered.push(pushList);
  })
}
/**
 * html mark up for modal card to be display when a specific employee is click on to show more details
 * @param {Array,object} list of employees
 * @param {number} index to select a specific employee from the array of object using bracket notation and getting to the details with dot notation
 */
const modalCard = (list,index) => {
  const regex = /\d+(\d{2})-(\d{2})-(\d{2}).+/;
  const Birthday = list[index].dob.date.replace(regex, "Birthday: $3/$2/$1");
    addToModal = 
    `<div class="modal">
      <div class="modal-info-container">
        <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
          <img class="modal-img" src="${list[index].picture.large}" alt="profile picture">
          <h3 id="name" class="modal-name cap">${list[index].name.first} ${list[index].name.last}</h3>
          <p class="modal-text">${list[index].email}</p>
          <p class="modal-text cap">${list[index].location.city}</p>
          <hr>
          <p class="modal-text">${list[index].phone}</p>
          <p class="modal-text">${list[index].location.street},${list[index].location.state}  ${list[index].location.postcode}</p>
          <p class="modal-text">${Birthday}</p>
      </div>
      <div class="modal-btn-container">
            <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
            <button type="button" id="modal-next" class="modal-next btn">Next</button>
      </div>
    </div>`;
  $(".modal-container").html(addToModal);
  $(".modal-container").show();
  $("body").css("overflow", "hidden");//set overflow of body to hidden to disable scroll when modal container is shown
}
/**
 * To replace/add new content on the page
 * @param {string} markup a string of html markup with employee details to display on the page
 * @param {string} from pass in 'html' or 'append' as a sting to add or replace the content in the page
 */
const print = (markup,from) => {
  if (from == 'html') {
    galleryField.innerHTML = markup;
  } else if(from === 'append'){
    $(galleryField).append(markup);
  }
}

const lookup = () =>{
  nextPre = null;
  const gallaryCards = document.querySelectorAll('.card-name');
  gallaryCards.forEach(card => {
    const element = card.parentElement.parentElement
    if (card.textContent.includes(SearchField.value)) {
      element.style.display = "";
      element.classList.add('shown');
    } else {
      element.style.display = "none";
      element.classList.remove('shown');
    }
  });

  if (SearchField.value !== "") {
    showMore.textContent = "BACK";
  } else {
    showMore.textContent = "SHOW MORE";
  }
  pushfiltered();
  showCard();
}
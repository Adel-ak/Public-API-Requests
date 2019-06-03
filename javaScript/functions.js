"use strict";

/*
elements to be used for parallax effect and slogan for main page
parallax form
https://www.youtube.com/watch?v=JttTcnidSdQ&t=755s
*/
const parallax = `
<div class="pimg1">
  <div class="ptext">
    <p><span class="border">“Hire character.  Train skill.”</span></p>
  </div>
</div>`;


//Search markup to be used to search for specific employee
const searchInput = `
<form action="#" method="get">
  <input type="search" id="search-input" class="search-input" placeholder="Search...">
  <input type="submit" value="&#x1F50D;" id="serach-submit" class="search-submit">
</form>`;

/**
 * 
 * @param {string} selector to locate DOM element using CSS selectors 
 * @param {string} position adding element beforebegin/afterbegin/beforeend or afterend of the selected element
 * @param {string} markup html markup to add to the page
 */
const eleToPage = (selector,position,markup ) => {
  document.querySelector(selector)
  .insertAdjacentHTML(position,markup);
}

/**
 * fetch to get the random users
 * @param {number} num to set the amount of employee to get
 * @param {string} method pass in 'html' or 'append' as a sting to add or replace the content in page (default is 'html', string will be passed to print method)
 * callback printToGallery to print employee cards to page one fetch is done
 */
const get = (num, method = "html") => {
  const url = `https://randomuser.me/api/?inc=picture,name,email,location,cell,phone,dob&nat=US&results=${num}`;
  fetch(url)
    .then(res => res.json())
    .then(res => {
      const employees = res.results;
      printToGallery(employees, method);
      showMore.textContent = "SHOW MORE";
    })
    .catch(rej => console.error("OOOH NO!!! " + rej));
};

/**
 * html mark up for gallery cards
 * @param {Array,object} list of employees
 * @param {string} method pass in 'html' or 'append' as a sting to add or replace the content in page (default is 'html', string will be passed to print method)
 * callback print to pass html make up and pass in method type
 * callback showCard to update oneclick for new divs with shown class
 * callback pushfiltered to update new filtered list
 */
const printToGallery = (list, method) => {
  addToGallery = "";//clear addToGallery to add new content to it 
  list.forEach(emp => {
    addToGallery += `<div class="card depth shown">
      <div class="card-img-container">
        <img class="card-img" src="${emp.picture.large}" alt="profile picture">
      </div>
      <div class="card-info-container">
        <h3 id="name" class="card-name cap">${emp.name.first} ${emp.name.last}</h3>
        <p class="card-text">${emp.email}</p>
        <p class="card-text cap">${emp.location.city},${emp.location.state}</p>
      </div>
    </div>`;
    employeeList.push(emp);
  });
  print(addToGallery, method);
  showCard();
  pushfiltered();
  showMore.style.display = '';
};

/**
 * loop through class of shown to get the index of the clicked div and show modal card by calling modalCard
 * form https://stackoverflow.com/questions/8801787/get-index-of-clicked-element-using-pure-javascript
 * user Ashwin Krishnamurthy
 * callback modalCard to pass the details of the clicked employee and show card
 */
const showCard = () => {
  const g = document.querySelectorAll(".shown");
  for (let i = 0; i < g.length; i++) {
    (function(index) {
      g[i].onclick = function() {
        g[i].classList.add("active");
        nextPre = index;
        modalCard(employeeListFiltered, nextPre);
        mainContainer.style.display = ""; //shown main container once innerHTML is set
        document.body.style.overflow = "hidden"; //set overflow of body to hidden to disable scroll when modal container is shown
      };
    })(i);
  }
};

/**
 * push the details of shown employees from the whole
 * employeeList array object to employeeListFiltered
 * jQuery index() equivalent in Vanilla JS
 * https://stackoverflow.com/questions/28229564/jquery-index-equivalent-in-vanilla-js/28230003
 */
const pushfiltered = () => {
  const shownCards = document.querySelectorAll('.shown');
  const gallery = document.querySelector('#gallery');
  employeeListFiltered = [];
/*
get the index of shownCards to push employeeList array index to employeeListFiltered
Note:- the employee cards and employeeList are in a matching line 
for eg if employee card number 3 is named tom then the array employeeList[3] 
has an object of that employee with his/her details
*/
  for(var i = 0; i < shownCards.length; i++){
    const index = Array.from(gallery.children).indexOf(shownCards[i]);
    const pushList = employeeList[index];
    employeeListFiltered.push(pushList);
  }
};

/**
 * html mark up for modal card to be display when a specific employee is click on to show more details
 * @param {Array,object} list of employees
 * @param {number} index to select a specific employee from the array of object using bracket notation and getting to the details with dot notation
 */
const modalCard = (list, index) => {
  const regex = /\d+(\d{2})-(\d{2})-(\d{2}).+/;
  const Birthday = list[index].dob.date.replace(regex, "Birthday: $3/$2/$1");
  const addToModal = `
  <div class="modal">
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
  mainContainer.innerHTML = addToModal; //set innerHTML to selected employee by next/prev or onlick event
  //Note:- implementing hidden in click event will hide buttons only at button click
  //the goal is to hide once the card is card changed 
  prev = document.querySelector("#modal-prev");
  next = document.querySelector("#modal-next");
  //hide prev button if card is at first employee
  if(nextPre === 0){
  prev.style.visibility = 'hidden';
  }//hide next button if card is at last employee
  else if(nextPre === employeeListFiltered.length-1){
  next.style.visibility = 'hidden';
  }
  //hide both button if only one employee is shown
  if(employeeListFiltered.length === 1){
    prev.style.visibility = 'hidden';
    next.style.visibility = 'hidden';
  }
};

/**
 * To replace/add new content on the page
 * @param {string} markup a string of html markup with employee details to display on the page
 * @param {string} from pass in 'html' or 'append' as a sting to add or replace the content in the page
 */
const print = (markup, from) => {
  if (from == "html") {
    galleryField.innerHTML = markup;
  } else if (from === "append") {
    galleryField.insertAdjacentHTML('beforeend',markup);
  }
};

/**
 * looks for employees names from the SearchField value and displays matched one and hides the rest
 * changes textContent of showMore button when SearchField is empty or not
 * callback pushfiltered to update new filtered list
 * callback showCard to update oneclick for new divs with shown class
 */
const lookup = () => {
  const employeeNames = document.querySelectorAll(".card-name");
  employeeNames.forEach(card => {
    const element = card.parentElement.parentElement;
    if (card.textContent.toLowerCase().includes(SearchField.value.toLowerCase())) {
      element.style.display = "";
      element.classList.add("shown");
    } else {
      element.style.display = "none";
      element.classList.remove("shown");
    }
  });

  if (SearchField.value !== "") {
    showMore.textContent = "BACK";
  } else {
    showMore.textContent = "SHOW MORE";
  }
  pushfiltered();
  showCard();
};


//add parallax markup before header 
eleToPage('header','beforebegin',parallax)
//add search input and button at the end of search container
eleToPage(".search-container",'beforeend',searchInput)
//add modal-container markup after gallery
eleToPage("#gallery",'afterend',`<div class="modal-container"></div>`)
document.querySelector('.modal-container').style.display = 'none';
//add button after the modal div
eleToPage(".modal-container",'afterend',`<button id="show-more" style="display:none">SHOW MORE</button>`)
//invoke get to start fetch on page load
get(12);
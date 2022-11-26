let fooddata = getFoodList()
let orderList = [];
let prepareList = [];
let totalcost = 0;

/*********** Menu and navbar ************/
let menu = document.getElementById("menu");

/******* Food tab  ********/
let foodTabList = document.getElementsByClassName('foodorder');
for (let i = 0; i < foodTabList.length; i++) {
   let plusbtn = foodTabList[i].getElementsByClassName('plus-food')[0];
   let minusbtn = foodTabList[i].getElementsByClassName('minus-food')[0];
   let foodNum = foodTabList[i].getElementsByClassName('ordernum')[0];
   let id = foodTabList[i].id

   plusbtn.addEventListener('click', plusOnclick(foodNum, minusbtn, id));
   minusbtn.addEventListener('click', minusOnclick(foodNum, minusbtn, id));
}

/********* navbar **********/
let categoryNav = document.getElementsByClassName('category');
for (let i = 0; i < categoryNav.length; i++) {
   categoryNav[i].addEventListener('click', onClickTypeNav);
}

/************  Modal ************/
// Get the modal
var cartmodal = document.getElementById("cartModal");
let cartmain = document.getElementById('cartmain');
var penmodal = document.getElementById("penModal");
let tracemodal = document.getElementById("traceModal");
let billtmodal = document.getElementById("billModal");
let alertmodal = document.getElementById("alert");

// Get the button that opens the modal
let cartbtn = document.getElementById("cartBtn");
let penbtn = document.getElementById("penBtn");
let billbtn = document.getElementById("billBtn");
let tracebtn = document.getElementById("traceBtn");
//
let donebtn = document.getElementById('done');
let preparebtn = document.getElementById('prepare');
let addReqbtn = document.getElementById('addsreq');

//
let searchbar = document.getElementById('searchbar');
let costspan = document.getElementById('totalcost');

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close");
console.log(span)

// cart modal
cartbtn.onclick = function () {
   let chooselist = document.getElementById("choose-list")
   if (chooselist) chooselist.remove();
   chooselist = document.createElement('div');
   chooselist.id = 'choose-list'

   orderList.forEach(order => {
      if (order.sl > 0) {
         food = fooddata[order.id];
         food.sl = order.sl;
         let foodTag = createFoodModal(food, order.id)
         chooselist.appendChild(foodTag);
      }
   })

   prepareList.forEach(order => {
      let f = true;
      for (let i = 0; i < orderList.length; i++) {
         if (order.id == orderList[i].id) {
            f = false;
            break;
         }
      }

      if (f) {
         food = fooddata[order.id];
         food.sl = 0;
         let foodTag = createFoodModal(food, order.id)
         chooselist.appendChild(foodTag);
      }
   })

   cartmain.appendChild(chooselist)
   cartmodal.style.display = "block";
}

// prepare button

preparebtn.addEventListener('click', () => {
   // pull to server

   //
   cartmodal.style.display = "none";
   popUpAlert('Prepare all sucessfully');
   updatePrepareList();
   cleanOrderList();
})

// pen modal
penbtn.onclick = function () {
   penmodal.style.display = "block";
}

addReqbtn.addEventListener('click', () => {
   // pull to server

   //
   penmodal.getElementsByTagName('textarea')[0].value = ''
   penmodal.style.display = "none";
   popUpAlert('add requirement sucessfully')
})

// bill modal
billbtn.onclick = function () {
   billtmodal.style.display = "block"
}

// trace modal
tracebtn.onclick = function () {
   tracemodal.style.display = "block"
}

// alert modal
function popUpAlert(message, color = "black") {
   alertmodal.getElementsByClassName('alert')[0].innerHTML = message;
   alertmodal.style.display = "block";
   alertmodal.style.color = color;
   setTimeout(() => {
      alertmodal.style.display = "none";
   }, 500)
}

// When the user clicks on <span> Cancle or OK, close the modal
for (let i = 0; i < span.length; i++) {
   span[i].onclick = function () {
      if (cartmodal.style.display == "block") {
         cartmodal.style.display = "none";
      }
      else if (penmodal.style.display == "block") {
         penmodal.style.display = "none";
      }
      else if (tracemodal.style.display == "block") {
         tracemodal.style.display = "none";
      }
      else if (billtmodal.style.display == "block") {
         billtmodal.style.display = "none";
      }
   }
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
   if (event.target == cartmodal) {
      cartmodal.style.display = "none";
   } else if (event.target == penmodal) {
      penmodal.style.display = "none";
   }
   else if (event.target == tracemodal) {
      tracemodal.style.display = "none";
   }
   else if (event.target == billtmodal) {
      billtmodal.style.display = "none";
   }
}

// search bar
searchbar.onkeyup = () => {
   let filter = searchbar.value.toLowerCase();
   let foods = menu.children

   // Loop through all list items, and hide those who don't match the search query
   for (i = 0; i < foods.length; i++) {
      if (foods[i].id == 'sample') continue;
      let foodName = fooddata[foods[i].id].name;

      if (foodName.toLowerCase().indexOf(filter) > -1) {
         foods[i].style.display = "";
      } else {
         foods[i].style.display = "none";
      }
   }
};

// Done button
donebtn.addEventListener('click', () => {

})

/******** function *********/
function changeCartSummary(cost) {
   costspan.innerHTML = numberWithDot(cost);
}

function minusOnclick(foodNum, minusbtn, id) {
   for (let i = 0; i < orderList.length; i++) {
      if (orderList[i].id == id) {
         orderList[i].sl -= 1;
         foodNum.innerHTML = parseInt(foodNum.innerHTML) - 1;

         // hide minus button and so luong food
         if (orderList[i].sl == 0) {
            minusbtn.style.display = 'none';
            foodNum.style.display = 'none';
         }
         break;
      }
   }

   // change total cost
   totalcost -= fooddata[id].cost;
   changeCartSummary(totalcost);
}

function plusOnclick(foodNum, minusbtn, id) {
   let flag = true;
   for (let i = 0; i < orderList.length; i++) {
      if (orderList[i].id == id) {
         orderList[i].sl += 1;
         flag = false;
         break;
      }
   }

   // change total cost
   totalcost += fooddata[id].cost;
   changeCartSummary(totalcost);

   // display minus button and so luong food
   if (flag) orderList.push({ id: id, sl: 1 });
   foodNum.innerHTML = parseInt(foodNum.innerHTML) + 1;
   minusbtn.style.display = 'inline';
   foodNum.style.display = 'inline';
}

function updateFoodTag(id, sl) {
   let foodTag = document.getElementById(id);
   let foodNum = foodTag.getElementsByClassName('ordernum')[0];
   foodNum.innerHTML = sl;

   if (sl == '0') {
      foodNum.style.display = 'none';
      foodTag.getElementsByClassName('minus-food')[0].style.display = 'none';
   }
}

function updatePrepareList() {
   orderList.forEach(order => {
      if (order.sl > 0) {
         let flag = true;
         for (let i = 0; i < prepareList.length; i++) {
            if (prepareList[i].id == order.id) {
               prepareList[i].sl += order.sl
               flag = false;
            }
         }

         if (flag) {
            prepareList.push({ id: order.id, sl: order.sl })
         }
      }
   })
}

function cleanOrderList() {
   orderList.forEach(order => {
      updateFoodTag(order.id, 0);
   })
   orderList = [];
}

function onClickTypeNav(event) {
   // filter
   let type = event.target.id;
   let foodTags = menu.children

   for (let j = 0; j < foodTags.length; j++) {
      if (type == 'all' && foodTags[j].id != 'sample') {
         foodTags[j].style.display = 'flex';
      }
      else if (!foodTags[j].classList.contains(type)) {
         foodTags[j].style.display = 'none';
      }
      else {
         foodTags[j].style.display = 'flex';
      }
   }

   // active
   var current = document.getElementsByClassName("active");
   current[0].className = current[0].className.replace("active", "");
   this.className += " active";
}

function createFoodModal(food, idx) {
   let sample = document.getElementById('samplemodal');
   let foodTag = sample.cloneNode(true);
   foodTag.style.display = 'flex';

   foodTag.classList.add(food.type)
   foodTag.getElementsByTagName('img')[0].src = food.img;
   foodTag.getElementsByClassName('name')[0].innerHTML = food.name;
   foodTag.getElementsByClassName('cost')[0].innerHTML = "đ " + numberWithDot(food.cost);

   let plusbtn = foodTag.getElementsByClassName('plus-food')[0];
   let minusbtn = foodTag.getElementsByClassName('minus-food')[0];
   let foodNum = foodTag.getElementsByClassName('ordernum')[0];
   foodNum.innerHTML = food.sl;

   plusbtn.addEventListener('click', () => {
      plusOnclick(foodNum, minusbtn, idx);
      updateFoodTag(idx, foodNum.innerHTML);
   })

   minusbtn.addEventListener('click', () => {
      minusOnclick(foodNum, minusbtn, idx);
      updateFoodTag(idx, foodNum.innerHTML);
   });

   if (food.sl == 0) {
      minusbtn.style.display = 'none';
      foodNum.style.display = 'none';
   }

   return foodTag;
}
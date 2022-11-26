
//foodlist
const foodSample = document.getElementById('samplefood');
const foodContainer = document.getElementById('foodlist');
//bill
const billContainer = document.getElementById('bill');
const billlist = document.getElementById('billlist');
const allTotal = document.getElementById('allTotal');
//navtag
const foodspan = document.getElementById('foodTag');
const billspan = document.getElementById('billTag');
//buttons
const confirmPaidbtn = document.getElementById('confirmPaid');
const availablebtn = document.getElementById('available');

/****** Content change *******/
let menuTable = document.getElementById('menu-table');
let manageTable = document.getElementById('manage-table');
let managebtn = document.getElementById('managebtn');
let menubtn = document.getElementById('menubtn');

// table data
const table = getInfoTable();
let preparedList = getPreparedList();

//initialize
fillTableInfo(table);
createFoodTab(preparedList);

// managebtn and menubtn onclick
managebtn.addEventListener('click', () => {
   if (manageTable.style.display == 'none') {
      preparedList = getPreparedList();
      createFoodTab(preparedList);
      manageTable.style.display = 'block';
      menuTable.style.display = 'none';
      menubtn.classList.remove('active')
      managebtn.classList.add('active')
   }
})

menubtn.addEventListener('click', () => {
   manageTable.style.display = 'none';
   menuTable.style.display = 'block';
   menubtn.classList.add('active')
   managebtn.classList.remove('active')
})

// food and bill tab onclick
foodspan.addEventListener('click', () => {
   onClickActive(foodspan);
   displayFoodOrBill('flex', 'none');
});
billspan.addEventListener('click', () => {
   createBill(preparedList);
   onClickActive(billspan);
   displayFoodOrBill('none', 'block');
});

// buttons on click
confirmPaidbtn.addEventListener('click', () => {
   // push to server

   // change state
   let state = document.getElementById('state');
   let statestr = 'paid';

   table.state = 'paid';
   state.innerHTML = stateMap[statestr];
   state.parentNode.classList.add(statestr);

   // change buttons
   confirmPaidbtn.style.display = 'none';
   availablebtn.style.display = 'block';
})

availablebtn.addEventListener('click', () => {
   // push to server
})

/****** function ******/

function onClickActive(span) {
   // active
   let types = document.getElementById('types')
   var current = types.getElementsByClassName("cam");
   current[0].className = current[0].className.replace("cam", "");
   span.className += " cam";
}

function clearFoodContainer() {
   foodContainer.textContent = null
}

function createFoodTab(preparedList) {
   clearFoodContainer()
   preparedList.forEach((order, idx) => {
      let foodTab = foodSample.cloneNode(true);
      let popuptext = foodTab.getElementsByClassName('popuptext')[0];
      foodTab.style.display = 'flex'

      foodTab.id = 'order' + idx;
      foodTab.getElementsByTagName('img')[0].src = order.img;
      foodTab.getElementsByClassName('food-name')[0].innerHTML = order.name;
      // foodTab.getElementsByClassName('food-cost-12')[0].innerHTML = numberWithDot(order.cost) + ' VND';
      if (order.excuted == true) {
         foodTab.getElementsByClassName('excute')[0].classList.add('done');
      }

      // Mark as Served btn
      foodTab.getElementsByClassName('mark')[0].addEventListener('click', () => {
         if (order.excuted == false) {
            popUpAlert('Food is not excuted', 'red') // from menu.js
         }
         else {
            order.served = !order.served;
            foodTab.getElementsByClassName('serve')[0].classList.toggle('done');
         }
         popuptext.classList.toggle('show');
      })

      // Cancle order btn
      foodTab.getElementsByClassName('cancle')[0].addEventListener('click', () => {
         if (order.excuted == true) {
            popUpAlert('Food was excuted', 'red') // from menu.js
         }
         else {
            order.cancle = true;
            foodTab.style.display = 'none';
         }
         popuptext.classList.toggle('show');
      })

      // Popup
      foodTab.getElementsByClassName('food')[0].addEventListener('click', () => {
         popuptext.classList.toggle('show');
      })

      foodContainer.appendChild(foodTab);
   });
}

function displayFoodOrBill(fooddis, billdis) {
   foodContainer.style.display = fooddis;
   billContainer.style.display = billdis;
}

function createBill(preparedList) {
   let tbody = billlist.getElementsByTagName('tbody')[0];
   if (tbody) tbody.remove();
   tbody = document.createElement('tbody');

   let th = createTrBill('th', 'Tên món', 'Giá', 'Số lượng', 'Thành tiền (VND)');
   tbody.appendChild(th);

   let totalCost = 0;
   preparedList.forEach(order => {
      if (order.excuted) {
         let tr = tbody.getElementsByClassName('bill' + order.id)[0]
         if (!tr) {
            let tr = createTrBill('td', order.name, numberWithDot(order.cost), 1, numberWithDot(order.cost));
            tr.classList.add('bill' + order.id)
            tbody.appendChild(tr);
         }
         else {
            let sl = tr.getElementsByClassName('sl')[0];
            let total = tr.getElementsByClassName('total')[0];

            sl.innerHTML = parseInt(sl.innerHTML) + 1;
            total.innerHTML = numberWithDot(parseInt(sl.innerHTML) * order.cost);
         }

         totalCost += order.cost;
      }
   })

   allTotal.innerHTML = numberWithDot(totalCost) + ' VND';
   billlist.appendChild(tbody);

}

function createTrBill(tcol, name, cost, sl, total) {
   let tr = document.createElement('tr');
   let namet = document.createElement(tcol);
   let costt = document.createElement(tcol);
   let slt = document.createElement(tcol);
   let totalt = document.createElement(tcol);

   namet.innerHTML = name;
   costt.innerHTML = cost;
   slt.innerHTML = sl;
   if (tcol == 'td') slt.classList.add('sl');
   totalt.innerHTML = total;
   if (tcol == 'td') totalt.classList.add('total');

   tr.appendChild(namet);
   tr.appendChild(costt);
   tr.appendChild(slt);
   tr.appendChild(totalt);

   return tr;
}

/**** Fetch function *******/
function getInfoTable() {
   let table = {
      num: 3,
      group: 4,
      dineIn: "4:15pm",
      state: 'unorder'
   }

   return table
}

function getPreparedList() {
   let preparedList = [
      {
         id: 1,
         name: "Nem rán Hà Nội",
         cost: 99000,
         img: imgPath + 'f5.png',
         excuted: true,
         served: false,
         cancle: false
      },
      {
         id: 1,
         name: "Nem rán Hà Nội",
         cost: 99000,
         img: imgPath + 'f5.png',
         excuted: true,
         served: false,
         cancle: false
      },
      {
         id: 2,
         name: "Bao tử cá",
         cost: 129000,
         img: imgPath + 'f6.png',
         excuted: true,
         served: false,
         cancle: false
      },
      {
         id: 4,
         name: "Chả cá đế vương 1",
         cost: 129000,
         img: imgPath + 'f8.jpg',
         excuted: false,
         served: false,
         cancle: false
      },
      {
         id: 6,
         name: "Chảo cá nhỏ",
         cost: 89000,
         img: imgPath + 'f10.png',
         excuted: true,
         served: false,
         cancle: false
      },

   ]

   return preparedList
}
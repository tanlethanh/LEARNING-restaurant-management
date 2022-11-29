import { getMenu, getOrderItems, addOrderItems, updateOrderItemQuantity, markOrderDone } from "./fetch-menu.js";

/*********** Menu and navbar ************/
let menu = document.getElementById("menu");
let foodTabList = document.getElementsByClassName('foodorder');
let categoryNav = document.getElementsByClassName('category');
// Get the modal
var cartmodal = document.getElementById("cartModal");
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
let paidbtn = document.getElementById('paid');

//
let searchbar = document.getElementById('searchbar');
let costspan = document.getElementById('totalcost');
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close");

let pathname = window.location.pathname
let order_id = pathname.slice(pathname.lastIndexOf('/') + 1)
let fooddata = []
let orderItems = [];
let orderList = [];
let foodMap = {}
let totalcost = 0;

function numberWithDot(x) {
   return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/******** function *********/

function popUpAlert(message, color = "black") {
   alertmodal.getElementsByClassName('alert')[0].innerHTML = message;
   alertmodal.style.display = "block";
   alertmodal.style.color = color;
   setTimeout(() => {
      alertmodal.style.display = "none";
   }, 500)
}

function changeCartSummary(cost) {
   costspan.innerHTML = numberWithDot(cost);
}

function minusOnclick(foodNum, minusbtn, idx) {
   for (let i = 0; i < orderList.length; i++) {
      if (orderList[i].id == fooddata[idx].id) {
         orderList[i].quantity -= 1;
         foodNum.innerHTML = parseInt(foodNum.innerHTML) - 1;

         // hide minus button and so luong food
         if (orderList[i].quantity == 0) {
            minusbtn.style.display = 'none';
            foodNum.style.display = 'none';
         }
         break;
      }
   }

   // change total cost
   totalcost -= fooddata[idx].price;
   changeCartSummary(totalcost);
   console.log(orderList)
}

function plusOnclick(foodNum, minusbtn, idx) {
   let flag = true;
   for (let i = 0; i < orderList.length; i++) {
      if (orderList[i].id == fooddata[idx].id) {
         orderList[i].quantity += 1;
         flag = false;
         break;
      }
   }

   // change total cost
   totalcost += fooddata[idx].price;
   changeCartSummary(totalcost);

   // display minus button and so luong food
   if (flag) orderList.push({ idx: idx, id: fooddata[idx].id, quantity: 1 });
   foodNum.innerHTML = parseInt(foodNum.innerHTML) + 1;
   minusbtn.style.display = 'inline';
   foodNum.style.display = 'inline';

   console.log(orderList)
}

function plusPanelOnClick(orderitem, panel, type) {
   let numElement = panel.getElementsByClassName(type)[0]
   let num = parseInt(numElement.innerHTML)

   if (num < orderitem.totalQuantity - orderitem.servedQuantity) {
      numElement.innerHTML = num + 1;
   }
}

function deletePanelOnClick(panel, type) {
   let numElement = panel.getElementsByClassName(type)[0]
   let num = parseInt(numElement.innerHTML)

   if (num > 0) {
      numElement.innerHTML = num - 1;
   }
}

function updatefoodTab(id, sl) {
   let foodTab = document.getElementById(id);
   let foodNum = foodTab.getElementsByClassName('ordernum')[0];
   foodNum.innerHTML = sl;

   if (sl == '0') {
      foodNum.style.display = 'none';
      foodTab.getElementsByClassName('minus-food')[0].style.display = 'none';
   }
}

function cleanOrderList() {
   orderList.forEach(order => {
      updatefoodTab(order.id, 0);
   })
   orderList = [];
}

function onClickTypeNav(event) {
   // filter
   let categoryId = event.target.id;
   let foodTabs = menu.children
   console.log(categoryId)

   for (let j = 0; j < foodTabs.length; j++) {
      if (categoryId == 'allnav') {
         foodTabs[j].style.display = 'flex';
      }
      else {
         let idx = foodMap[j]

         if (fooddata[idx].categoryId != categoryId) {
            foodTabs[j].style.display = 'none';
         }
         else {
            foodTabs[j].style.display = 'flex';
         }
      }
   }

   // active
   var current = document.getElementsByClassName("active");
   current[0].className = current[0].className.replace("active", "");
   this.className += " active";
}

function createFoodTabCart(food, quantity, idx) {
   let sample = document.getElementById('sample-cart-food');
   let foodTab = sample.cloneNode(true);
   foodTab.style.display = 'flex';

   foodTab.getElementsByTagName('img')[0].src = '../../../../../public/images/foods/' + food.images[0].url;
   foodTab.getElementsByClassName('name')[0].innerHTML = food.name;
   foodTab.getElementsByClassName('cost')[0].innerHTML = "đ " + numberWithDot(food.price);

   let plusbtn = foodTab.getElementsByClassName('plus-food')[0];
   let minusbtn = foodTab.getElementsByClassName('minus-food')[0];
   let foodNum = foodTab.getElementsByClassName('ordernum')[0];
   foodNum.innerHTML = quantity;

   plusbtn.addEventListener('click', () => {
      plusOnclick(foodNum, minusbtn, idx);
      updatefoodTab(fooddata[idx].id, foodNum.innerHTML);
   })

   minusbtn.addEventListener('click', () => {
      minusOnclick(foodNum, minusbtn, idx);
      updatefoodTab(fooddata[idx].id, foodNum.innerHTML);
   });

   if (quantity == 0) {
      minusbtn.style.display = 'none';
      foodNum.style.display = 'none';
   }

   return foodTab;
}

function createFoodTabManage(food, orderitem) {
   let sample = document.getElementById('sample-manage-food');
   let foodTab = sample.cloneNode(true);
   foodTab.style.display = 'flex';

   foodTab.getElementsByTagName('img')[0].src = '../../../../../public/images/foods/' + food.images[0].url;
   foodTab.getElementsByClassName('name')[0].innerHTML = food.name;
   foodTab.getElementsByClassName('quantity')[0].innerHTML = "Số lượng: " + numberWithDot(orderitem.totalQuantity);
   foodTab.getElementsByClassName('prepare')[0].innerHTML = "Đang làm: " + numberWithDot(orderitem.preparingQuantity);
   foodTab.getElementsByClassName('served')[0].innerHTML = "Đã lên: " + numberWithDot(orderitem.servedQuantity);

   const panels = foodTab.getElementsByClassName('panel')
   for (let i = 0; i < 2; i++) {
      let showBtn = panels[i].getElementsByClassName('showBtn')
      let plusbtn = panels[i].getElementsByClassName('plus-food')[0];
      let minusbtn = panels[i].getElementsByClassName('minus-food')[0];
      let type = 'serve-num'
      if (panels[i].classList.contains('delete-panel')) {
         type = 'delete-num'
      }

      showBtn[0].addEventListener('click', () => {
         panels[i].classList.toggle('active')
      })

      plusbtn.addEventListener('click', () => {
         plusPanelOnClick(orderitem, panels[i], type)
      })

      minusbtn.addEventListener('click', () => {
         deletePanelOnClick(panels[i], type)
      })
   }

   let upBtn = foodTab.getElementsByClassName('serve')[0];
   let deletebtn = foodTab.getElementsByClassName('delete')[0];

   upBtn.addEventListener('click', async () => {
      let servePanel = foodTab.getElementsByClassName('serve-panel')[0]
      await serve(foodTab, servePanel, orderitem)
   })

   deletebtn.addEventListener('click', async () => {
      let deletePanel = foodTab.getElementsByClassName('delete-panel')[0]
      await deleteItem(foodTab, deletePanel, orderitem)
   })

   return foodTab;
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

   console.log('create')
   return tr;
}

function createBill(orderList) {
   let billlist = document.getElementById('billlist')
   let tbody = billlist.getElementsByTagName('tbody')[0];
   if (tbody) tbody.remove();
   tbody = document.createElement('tbody');

   let th = createTrBill('th', 'Tên món', 'Giá', 'Số lượng', 'Thành tiền (VND)');
   tbody.appendChild(th);

   let totalCost = 0;
   orderList.forEach(orderitem => {
      let food = fooddata.find(food => food.id == orderitem.foodItemId)
      let tr = createTrBill('td', food.name, numberWithDot(food.price), orderitem.totalQuantity, numberWithDot(food.price * orderitem.totalQuantity));
      tbody.appendChild(tr);

      totalCost += food.price * orderitem.totalQuantity;
   })

   allTotal.innerHTML = numberWithDot(totalCost) + ' VND';
   billlist.appendChild(tbody);
}

async function serve(foodTab, servePanel, orderitem) {
   let serveNum = servePanel.getElementsByClassName('serve-num')[0]
   let num = parseInt(serveNum.innerHTML)
   if (orderitem.totalQuantity == orderitem.servedQuantity) return

   let order_item = {
      food_id: orderitem.foodItemId,
      quantity: {
         totalQuantity: 0,
         preparingQuantity: 0,
         servedQuantity: num
      }
   }

   try {
      let orderItemRes = await updateOrderItemQuantity(order_id, order_item)
      foodTab.getElementsByClassName('quantity')[0].innerHTML = "Số lượng: " + numberWithDot(orderItemRes.totalQuantity);
      foodTab.getElementsByClassName('prepare')[0].innerHTML = "Đang làm: " + numberWithDot(orderItemRes.preparingQuantity);
      foodTab.getElementsByClassName('served')[0].innerHTML = "Đã lên: " + numberWithDot(orderItemRes.servedQuantity);
   } catch (error) {
      console.log(error)
   }
   finally {
      serveNum.innerHTML = 0
   }
}

async function deleteItem(foodTab, deletePanel, orderitem) {
   let deleteNum = deletePanel.getElementsByClassName('delete-num')[0]
   let num = parseInt(deleteNum.innerHTML)
   if (orderitem.totalQuantity == orderitem.servedQuantity || orderitem.totalQuantity == orderitem.preparingQuantity) return

   let order_item = {
      food_id: orderitem.foodItemId,
      quantity: {
         totalQuantity: -num,
         preparingQuantity: 0,
         servedQuantity: 0
      }
   }

   try {
      let orderItemRes = await updateOrderItemQuantity(order_id, order_item)
      foodTab.getElementsByClassName('quantity')[0].innerHTML = "Số lượng: " + numberWithDot(orderItemRes.totalQuantity);
      foodTab.getElementsByClassName('prepare')[0].innerHTML = "Đang làm: " + numberWithDot(orderItemRes.preparingQuantity);
      foodTab.getElementsByClassName('served')[0].innerHTML = "Đã lên: " + numberWithDot(orderItemRes.servedQuantity);
   } catch (error) {
      console.log(error)
   }
   finally {
      deleteNum.innerHTML = 0
   }
}

// set up function
function setUpModal() {
   // cart modal
   cartbtn.onclick = async () => {
      orderItems = await getOrderItems(order_id)
      let chooselist = document.getElementById("choose-list")
      chooselist.innerHTML = ""

      orderList.forEach(order => {
         if (order.quantity > 0) {
            let foodTab = createFoodTabCart(fooddata[order.idx], order.quantity, order.idx)
            chooselist.appendChild(foodTab);
         }
      })

      orderItems.forEach(orderItem => {
         let f = true;
         for (let i = 0; i < orderList.length; i++) {
            if (orderList[i].quantity > 0 && orderItem.foodItemId == orderList[i].id) {
               f = false;
               break;
            }
         }

         if (f) {
            let idx = fooddata.findIndex(food => food.id == orderItem.foodItemId)
            let foodTab = createFoodTabCart(fooddata[idx], 0, idx)
            chooselist.appendChild(foodTab);
         }
      })

      cartmodal.style.display = "block";
   }

   // pen modal
   penbtn.onclick = function () {
      penmodal.style.display = "block";
   }

   // bill modal
   billbtn.onclick = function () {
      createBill(orderItems);
      billtmodal.style.display = "block"
   }

   // trace modal
   tracebtn.onclick = async function () {
      orderItems = await getOrderItems(order_id)
      let orderItemlist = document.getElementById("orderitem-list")
      orderItemlist.innerHTML = ""

      console.log(orderItems)
      orderItems.forEach(orderItem => {
         if (orderItem.totalQuantity > 0) {
            let idx = fooddata.findIndex(food => food.id == orderItem.foodItemId)
            let foodTab = createFoodTabManage(fooddata[idx], orderItem)
            orderItemlist.appendChild(foodTab);
         }
      })

      tracemodal.style.display = "block"
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
}

function setUpFoodTab() {
   for (let i = 0; i < foodTabList.length; i++) {
      let plusbtn = foodTabList[i].getElementsByClassName('plus-food')[0];
      let minusbtn = foodTabList[i].getElementsByClassName('minus-food')[0];
      let foodNum = foodTabList[i].getElementsByClassName('ordernum')[0];
      let idx = -1

      for (let j = 0; j < fooddata.length; j++) {
         if (foodTabList[i].id == fooddata[j].id) {
            idx = j
            foodMap[i] = j
            break
         }
      }

      plusbtn.addEventListener('click', () => {
         plusOnclick(foodNum, minusbtn, idx)
      });
      minusbtn.addEventListener('click', () => {
         minusOnclick(foodNum, minusbtn, idx)
      });
   }
}

function setUpCategoryNav() {
   let allnav = document.getElementById('allnav')
   allnav.addEventListener('click', onClickTypeNav)
   for (let i = 0; i < categoryNav.length; i++) {
      categoryNav[i].addEventListener('click', onClickTypeNav);
   }
}

function setUpSearchBar() {
   searchbar.onkeyup = () => {
      let filter = searchbar.value.toLowerCase();
      let foodTabs = menu.children

      // Loop through all list items, and hide those who don't match the search query
      for (let i = 0; i < foodTabs.length; i++) {
         let idx = foodMap[i]
         let foodName = fooddata[idx].name;

         if (foodName.toLowerCase().indexOf(filter) > -1) {
            foodTabs[i].style.display = "flex";
         } else {
            foodTabs[i].style.display = "none";
         }
      }
   };
}

function setUpButton() {
   // Done button
   donebtn.addEventListener('click', () => {
      if ('referrer' in document) {
         window.location = document.referrer;
         /* OR */
         //location.replace(document.referrer);
      } else {
         window.history.back();
      }
   })

   // prepare button
   preparebtn.addEventListener('click', async () => {
      // pull to server
      let order_items = orderList.map(order => {
         return {
            id: order.id,
            quantity: order.quantity
         }
      })

      try {
         await addOrderItems(order_id, order_items)

         cartmodal.style.display = "none";
         popUpAlert('Prepare all sucessfully');
      } catch (error) {
         console.log(error)

         cartmodal.style.display = "none";
         popUpAlert('Failed');
      } finally {
         cleanOrderList();
      }
   })


   addReqbtn.addEventListener('click', () => {
      // pull to server

      //
      penmodal.getElementsByTagName('textarea')[0].value = ''
      penmodal.style.display = "none";
      popUpAlert('add requirement sucessfully')
   })

   paidbtn.addEventListener('click', async () => {
      try {
         await markOrderDone(order_id)
         let buttons = billtmodal.getElementsByClassName('buttons')[0]
         buttons.style.display = 'none'
      } catch (error) {
         console.log(error)
      }
   })
}

function setUpCartSummary() {
   orderItems.forEach(orderitem => {
      let food = fooddata.find(food => food.id == orderitem.foodItemId)

      totalcost += food.price * orderitem.totalQuantity;
   })

   changeCartSummary(totalcost)
}

async function main() {
   fooddata = await getMenu()
   orderItems = await getOrderItems(order_id)
   console.log(fooddata)

   setUpFoodTab()
   setUpCategoryNav()
   setUpModal()
   setUpSearchBar()
   setUpButton()
   setUpCartSummary()
}

main()
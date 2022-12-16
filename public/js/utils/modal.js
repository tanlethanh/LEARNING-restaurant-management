export function createYesNoModal(
  title,
  yesCallback,
  yesContent = "Chấp nhận",
  noContent = "Quay lại",
  isOneButton = false
) {
  const modalBackground = document.createElement("div");
  const body = document.getElementsByTagName("body")[0];
  body.appendChild(modalBackground);
  modalBackground.classList.add("modal-background");

  // Modal box
  const modalBox = document.createElement("div");
  modalBackground.appendChild(modalBox);
  modalBox.classList.add("modal-box");

  // Title
  const modalTitle = document.createElement("h3");
  modalBox.appendChild(modalTitle);
  modalTitle.classList.add("modal-title");
  modalTitle.innerHTML = title;

  // Button container
  const buttonBox = document.createElement("div");
  modalBox.appendChild(buttonBox);
  buttonBox.classList.add("modal-button");

  // Yes button
  if(!isOneButton){
    const yesButton = document.createElement("button");
    buttonBox.appendChild(yesButton);
    yesButton.classList.add("modal-yes-button");
    yesButton.innerHTML = `${yesContent}`;
    yesButton.addEventListener("click", async (event) => {
      const loading = document.getElementById("loading");
      if (loading.classList.contains("hidden")) {
        loading.classList.remove("hidden");
      }
      await yesCallback(event);
      loading.classList.add("hidden");
      modalBackground.remove();
    });
  }

  // No button
    const noButton = document.createElement("button");
    buttonBox.appendChild(noButton);
    noButton.classList.add("modal-no-button");
    noButton.innerHTML = noContent;
    noButton.addEventListener("click", () => {
      modalBackground.remove();
    });
}

export function createTableModal(table1) {
  const orders = table1.order.orders;
  const table = table1.order;
  console.log("Create detail table modal: ");
  console.log(orders);
  const modalBackground = document.createElement("div");
  const body = document.getElementsByTagName("body")[0];
  body.appendChild(modalBackground);
  modalBackground.classList.add("table-detail-background");

  const tableDetail = document.createElement("div");
  modalBackground.appendChild(tableDetail);
  tableDetail.classList.add("table-detail");

  const closeTable = document.createElement("div");
  tableDetail.appendChild(closeTable);
  closeTable.classList.add("close-table-detail");
  closeTable.innerHTML = "X";

  closeTable.addEventListener("click", () => {
    modalBackground.remove();
  });

  // heading
  const heading = document.createElement("div");
  tableDetail.appendChild(heading);
  heading.classList.add("table-detail-heading");

  const leftHeading = document.createElement("div");
  heading.appendChild(leftHeading);
  leftHeading.classList.add("table-detail-left-heading");

  const tableNumber = document.createElement("h1");
  leftHeading.appendChild(tableNumber);
  tableNumber.innerHTML = "Bàn " + table.tableNumber;

  const newLine = document.createElement("BR");
  heading.appendChild(newLine);

  const tableSeatTitle = document.createElement("span");
  leftHeading.appendChild(tableSeatTitle);
  tableSeatTitle.innerHTML = "Loại bàn: ";
  tableSeatTitle.classList.add("table-detail-numOfTableSeat");

  const tableSeat = document.createElement("span");
  leftHeading.appendChild(tableSeat);
  tableSeat.innerHTML = table.numberOfSeats + " chỗ";

  const rightHeading = document.createElement("div");
  heading.appendChild(rightHeading);
  rightHeading.classList.add("table-detail-right-heading");

  const tableState = document.createElement("span");
  rightHeading.appendChild(tableState);
  if (table.state === "FREE") {
    tableState.classList.add("table-detail-state-free");
    tableState.innerHTML = "Bàn trống";
  } else if (table.state === "LOCKED") {
    tableState.classList.add("table-detail-state-unarrived");
    tableState.innerHTML = "Khách chưa đến";
  } else {
    tableState.classList.add("table-detail-state-free");
    tableState.innerHTML = "Đang có khách";
  }

  const newHr = document.createElement("HR");
  tableDetail.appendChild(newHr);

  // main
  const main = document.createElement("div");
  tableDetail.appendChild(main);
  main.classList.add("table-detail-main-body");

  const leftMain = document.createElement("div");
  main.appendChild(leftMain);
  leftMain.classList.add("table-detail-left-main-body");

  const leftMain1 = document.createElement("p");
  leftMain.appendChild(leftMain1);
  leftMain1.classList.add("table-detail-numOfTableSeat");
  leftMain1.innerHTML = "Khách hàng hiện tại: ";

  const leftMain2 = document.createElement("p");
  leftMain.appendChild(leftMain2);
  leftMain2.classList.add("table-detail-numOfTableSeat");
  leftMain2.innerHTML = "Giờ đặt: ";

  const leftMain3 = document.createElement("p");
  leftMain.appendChild(leftMain3);
  leftMain3.classList.add("table-detail-numOfTableSeat");
  leftMain3.innerHTML = "Dự kiến rời đi: ";

  const rightMain = document.createElement("div");
  main.appendChild(rightMain);
  rightMain.classList.add("table-detail-right-main-body");

  const rightMain1 = document.createElement("p");
  rightMain.appendChild(rightMain1);
  rightMain1.innerHTML = "Không có";

  const rightMain2 = document.createElement("p");
  rightMain.appendChild(rightMain2);
  rightMain2.innerHTML = "Không có";

  const rightMain3 = document.createElement("p");
  rightMain.appendChild(rightMain3);
  rightMain3.innerHTML = "Không có";

  if (table.state === "LOCKED") {
    rightMain1.innerHTML = table.reservations[0].customer.firstName;
    rightMain2.innerHTML =
      table.reservations[0].time.getHours() +
      ":" +
      table.reservations[0].time.getMinutes();
    rightMain3.innerHTML =
      String(table.reservations[0].time.getHours() + 1) +
      ":" +
      table.reservations[0].time.getMinutes();
  } else if (table.state === "INPROGRESS") {
    // new customer
    if (orders[0].customer.newCustomer) {
      rightMain1.innerHTML = "Customer " + orders[0].customer.newCustomer.ordinamNumber;
    } else {
      // reservation
      rightMain1.innerHTML = orders[0].customer.bookedCustomer.firstName;
    }
    const curTime = new Date(orders[0].arrivalTime) //Date(table.orders[0].arrivalTime);
    console.log(curTime);
    rightMain2.innerHTML = curTime.getHours() + ":" + curTime.getMinutes();
    rightMain3.innerHTML = String(curTime.getHours()+1) + ":" + curTime.getMinutes();
  }

  tableDetail.appendChild(newLine);

  // bottom
  const bottom = document.createElement("div");
  tableDetail.appendChild(bottom);
  bottom.classList.add("table-detail-bottom-body");

  if(table.state === "INPROGRESS"){
    const bottom1 = document.createElement("p");
    bottom.appendChild(bottom1);
    bottom1.classList.add("table-detail-numOfTableSeat");
    bottom1.innerHTML = "Các món gọi";
  
    const bottomTable = document.createElement("table");
    bottom.appendChild(bottomTable);
    bottomTable.classList.add("bottom-order-table")
  
    let bottomTr = document.createElement("tr");
    bottomTable.appendChild(bottomTr);
  
    const bottomTh1 = document.createElement("th");
    bottomTr.appendChild(bottomTh1);
    bottomTh1.innerHTML = "STT";
    bottomTh1.style.width = "7%";
  
    const bottomTh2 = document.createElement("th");
    bottomTr.appendChild(bottomTh2);
    bottomTh2.innerHTML = "Tên món";
    bottomTh2.style.width = "27%";
  
    const bottomTh3 = document.createElement("th");
    bottomTr.appendChild(bottomTh3);
    bottomTh3.innerHTML = "Số lượng";
    bottomTh3.style.width = "13%";
  
    const bottomTh4 = document.createElement("th");
    bottomTr.appendChild(bottomTh4);
    bottomTh4.innerHTML = "Loại";
    bottomTh4.style.width = "10%";
  
    const bottomTh5 = document.createElement("th");
    bottomTr.appendChild(bottomTh5);
    bottomTh5.innerHTML = "Ghi chú";
    bottomTh5.style.width = "28%";
  
    const bottomTh6 = document.createElement("th");
    bottomTr.appendChild(bottomTh6);
    bottomTh6.innerHTML = "Trạng thái";
    bottomTh6.style.width = "15%";
    if(orders[0].orderItems.length>0){
      let bottomTd;

      for(let i=0; i<orders[0].orderItems.length; i++){
        const curOrderFoodItems = orders[0].orderItems[i];

        bottomTr = document.createElement("tr");
        bottomTable.appendChild(bottomTr);

        bottomTd = document.createElement("td");
        bottomTr.appendChild(bottomTd);
        bottomTd.innerHTML = i+1;
      
        bottomTd = document.createElement("td");
        bottomTr.appendChild(bottomTd);
        bottomTd.innerHTML = curOrderFoodItems.foodItem.name;
      
        bottomTd = document.createElement("td");
        bottomTr.appendChild(bottomTd);
        bottomTd.innerHTML = curOrderFoodItems.totalQuantity;
      
        bottomTd = document.createElement("td");
        bottomTr.appendChild(bottomTd);
        bottomTd.innerHTML = curOrderFoodItems.foodItem.category.name;
      
        bottomTd = document.createElement("td");
        bottomTr.appendChild(bottomTd);
        bottomTd.innerHTML = curOrderFoodItems.foodItem.description.slice(0, 50)+"...";
      
        bottomTd = document.createElement("td");
        bottomTr.appendChild(bottomTd);
        let foodState = (curOrderFoodItems.servedQuantity === curOrderFoodItems.totalQuantity)?"Đã lên":"Đang lên"
        bottomTd.innerHTML = foodState;
      }
    }
  }


  const buttonBody = document.createElement("div");
  tableDetail.appendChild(buttonBody);
  buttonBody.classList.add("table-detail-end-body");

  if (table.state === "LOCKED") {
    const loginTableButton = document.createElement("button");
    buttonBody.appendChild(loginTableButton);
    loginTableButton.classList.add("table-detail-button-1");

    const cancelButton = document.createElement("button");
    buttonBody.appendChild(cancelButton);
    cancelButton.classList.add("table-detail-button-2");
  } else if (table.state === "INPROGRESS") {
    const payButton = document.createElement("button");
    payButton.innerHTML="Thanh toán"
    buttonBody.appendChild(payButton);
    payButton.classList.add("table-detail-button-1");
  }
}

export function createFormModal(
  title,
  subMitCallBack
) {
  const modalBackground = document.createElement("div");
  const body = document.getElementsByTagName("body")[0];
  body.appendChild(modalBackground);
  modalBackground.classList.add("modal-background");

  // Modal box
  const modalBox = document.createElement("div");
  modalBackground.appendChild(modalBox);
  modalBox.classList.add("modal-box");

  // Title
  const modalTitle = document.createElement("h3");
  modalBox.appendChild(modalTitle);
  modalTitle.classList.add("modal-title");
  modalTitle.innerHTML = title;

  // Create an input element for NumOfSeats
  var FN = document.createElement("input");
  modalBox.appendChild(FN)
  FN.setAttribute("type", "text");
  FN.setAttribute("id", "addNewCustomerInput");
  FN.setAttribute("name", "NumOfSeats");
  FN.setAttribute("placeholder", "Numbers of seats");

  // Button container
  const buttonBox = document.createElement("div");
  modalBox.appendChild(buttonBox);
  buttonBox.classList.add("modal-button");

  // Submit button
    const submitButton = document.createElement("button");
    buttonBox.appendChild(submitButton);
    submitButton.classList.add("modal-yes-button");
    submitButton.innerHTML = `Submit`;
    submitButton.addEventListener("click", async (event) => {
      const loading = document.getElementById("loading");
      if (loading.classList.contains("hidden")) {
        loading.classList.remove("hidden");
      }
      await subMitCallBack(event);
      loading.classList.add("hidden");
      modalBackground.remove();
    });
}


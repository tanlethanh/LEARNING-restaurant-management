export function createYesNoModal(
  title,
  yesCallback,
  yesContent = "Chấp nhận",
  noContent = "Quay lại"
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
  const yesButton = document.createElement("button");
  buttonBox.appendChild(yesButton);
  yesButton.classList.add("modal-yes-button");
  yesButton.innerHTML = yesContent;
  yesButton.addEventListener("click", async (event) => {
    const loading = document.getElementById("loading");
    if (loading.classList.contains("hidden")) {
      loading.classList.remove("hidden");
    }
    await yesCallback(event);
    loading.classList.add("hidden");
    modalBackground.remove();
  });

  // No button
  const noButton = document.createElement("button");
  buttonBox.appendChild(noButton);
  noButton.classList.add("modal-no-button");
  noButton.innerHTML = noContent;
  noButton.addEventListener("click", () => {
    modalBackground.remove();
  });
}

// export function createTableModal(){
//     const modalBackground = document.createElement('div')
//     const body = document.getElementsByTagName("body")[0]
//     body.appendChild(modalBackground)
//     modalBackground.classList.add("table-detail-background");

//     const tableDetail = document.createElement("div")
//     modalBackground.appendChild(tableDetail)
//     tableDetail.classList.add("table-detail");

//     // heading
//     const heading = document.createElement("div");
//     tableDetail.appendChild(heading)
//     heading.classList.add("table-detail-heading");

//     const leftHeading = document.createElement("div");
//     heading.appendChild(leftHeading)
//     leftHeading.classList.add("table-detail-left-heading");

//     const tableNumber = document.createElement("h1");
//     leftHeading.appendChild(tableNumber)
//     modalTitle.innerHTML = "Ban 1";

//     const tableSeat = document.createElement("p");
//     leftHeading.appendChild(tableSeat)
//     tableSeat.innerHTML = "Loai ban: 4 cho";

//     const rightHeading = document.createElement("div");
//     heading.appendChild(rightHeading)
//     rightHeading.classList.add("table-detail-right-heading");

//     const tableState = document.createElement("p");
//     rightHeading.appendChild(tableSeat)
//     tableState.innerHTML = "Bàn trống";

//     // main
//     const main = document.createElement("div");
//     tableDetail.appendChild(main)
//     main.classList.add("table-detail-main-body");

//     const leftMain = document.createElement("div");
//     main.appendChild(leftMain)
//     leftMain.classList.add("table-detail-left-main-body");

//     const leftMain1 = document.createElement("p");
//     leftMain.appendChild(leftMain1)
//     leftMain1.classList.add("table-detail-numOfTableSeat");
//     leftMain1.innerHTML = "Khách hàng hiện tại: ";

//     const leftMain2 = document.createElement("p");
//     leftMain.appendChild(leftMain2)
//     leftMain2.classList.add("table-detail-numOfTableSeat");
//     leftMain2.innerHTML = "Giờ đặt: ";

//     const leftMain3 = document.createElement("p");
//     leftMain.appendChild(leftMain3)
//     leftMain3.classList.add("table-detail-numOfTableSeat");
//     leftMain3.innerHTML = "Dự kiến rời đi: ";

//     const rightMain = document.createElement("div");
//     main.appendChild(rightMain)
//     rightMain.classList.add("table-detail-right-main-body");

//     const rightMain1 = document.createElement("p");
//     rightMain.appendChild(rightMain1)
//     rightMain1.innerHTML = "Không có";

//     const leftMain2 = document.createElement("p");
//     leftMain.appendChild(leftMain2)
//     leftMain2.classList.add("table-detail-numOfTableSeat");
//     leftMain2.innerHTML = "Giờ đặt: ";

//     const leftMain3 = document.createElement("p");
//     leftMain.appendChild(leftMain3)
//     leftMain3.classList.add("table-detail-numOfTableSeat");
//     leftMain3.innerHTML = "Dự kiến rời đi: ";

// }

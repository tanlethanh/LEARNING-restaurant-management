const url_prefix = 'http://localhost:4040/reservation/';
document.getElementById("make-reservation").addEventListener("click", reservationButtonOnClick);
const closeModalBtn = document.getElementById("close-btn")
if (closeModalBtn) closeModalBtn.addEventListener("click", closeModalButtonOnClick);
// onchange date
const reservationDate = document.getElementById("reservationDate");
if (reservationDate) reservationDate.addEventListener("change", onchangeReservationDate);
// onchange number Person
const numberPerson = document.getElementById("number-person");
if (numberPerson) numberPerson.addEventListener("change", onchangeNumberPerson);

//data list
const timeDataList = document.getElementById("reservation-time-option");
const seatDataList = document.getElementById("number-person-option");

function reservationButtonOnClick() {
    console.log('Get reservation date')
}
function closeModalButtonOnClick() {
    const modalBackground = document.getElementById("notify")
    modalBackground.remove()
}
function onchangeReservationDate() {
    const date = reservationDate.value
    fetch(`http://localhost:4040/reservation/datetime?action=date&value=${date}`)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            seatDataList.innerHTML = '';
            for (let i = 0; i < data.resultList.length; i++) {
                console.log(data.resultList[i])
                const options = document.createElement("option");
                options.value = data.resultList[i]
                seatDataList.appendChild(options)
            }
        })
        .catch(err => console.error(err));
}

function onchangeNumberPerson() {

    const seat = numberPerson.value
    fetch(`http://localhost:4040/reservation/datetime?action=seat&value=${seat}`)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            timeDataList.innerHTML = '';
            for (let i = 0; i < data.resultList.length; i++) {
                console.log(data.resultList[i])
                const options = document.createElement("option");
                options.value = data.resultList[i]
                timeDataList.appendChild(options)
            }
        })
        .catch(err => console.error(err));
}
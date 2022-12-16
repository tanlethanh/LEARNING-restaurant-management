// fetch()api/operations/reservations
const url_prefix = "http://localhost:4040/api/operations/";
// const options = {
//     method: 'POST',
//     headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json;charset=UTF-8'
//     },
//     body: JSON.stringify({
//         name: 'David',
//         age: 45
//     })
// };

export async function fetchAssignTableForReservation(reservationId, tableId) {
  const url =
    url_prefix + `reservations/${reservationId}?action=lock&tableid=${tableId}`;
  const options = {
    method: "POST",
  };

  return fetch(url, options);
}

export async function fetchInitOrder(reservationId, newCustomerId, tableId) {
  const url =
    url_prefix +
    `orders?tableid=${tableId}&newcustomerid=${newCustomerId}&reservationid=${reservationId}`;
  const options = {
    method: "POST",
  };

  return fetch(url, options);
}

export async function fetchTableOrder(tableId) {
  const url = url_prefix + `orders?tableid=${tableId}`;
  const options = {
    method: "GET",
  };

  return fetch(url, options);
}

export async function fetchAddNewCustomer(numOfSeats, ordinamNumber) {
  const url = url_prefix + `customers/newCustomers`;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify({
      numOfSeats: numOfSeats,
      ordinamNumber: ordinamNumber,
    }),
  };
  return fetch(url, options);
}                                                                     
// fetch()api/operations/reservations
const url_prefix = 'http://localhost:4040/api/operations/';
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
    const url = url_prefix + `reservations/${reservationId}?action=lock&tableid=${tableId}`;
    const options = {
        method: 'POST'
    };

    return fetch(url, options)
}

export async function fetchInitOrder(reservationId, tableId) {
    const url = url_prefix + `orders?tableid=${tableId}&reservationid=${reservationId}`;
    const options = {
        method: 'POST'
    };

    return fetch(url, options)
}
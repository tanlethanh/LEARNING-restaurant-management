const url_prefix = 'http://localhost:4040/api/table-management';
export async function getMenu() {
   let response = await fetch(url_prefix + '/menu')
      .then(data => data.json());

   return response.foodItems
}

export async function getOrderItems(order_id) {
   let response = await fetch(url_prefix + `/orderitems?order_id=${order_id}`)
      .then(data => data.json());

   return response.orderItems
}

export async function addOrderItems(order_id, order_items) {
   let body = {
      order_items: order_items
   }

   let response = await fetch(url_prefix + `/orderitems?order_id=${order_id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
   })
      .then(data => data.json());

   if (response.error) throw new Error(response.error)

   return response.orderItems
}

export async function updateOrderItemQuantity(order_id, order_item) {
   let body = {
      order_item: order_item
   }

   let response = await fetch(url_prefix + `/foodstate?order_id=${order_id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
   })
      .then(data => data.json());

   if (response.error) throw new Error(response.error)

   return response.orderItem
}

export async function markOrderDone(order_id) {
   await fetch(url_prefix + `/doneorder?order_id=${order_id}`, {
      method: "POST"
   })
      .then(data => data.json());
}
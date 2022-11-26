import { OrderItem, OrderState, ReservationState, TableState } from '@prisma/client';
import { BookedCustomer, Customer, CustomerType, Table, Reservation } from '@prisma/client';
import CustomerRepository from "../repositories/CustomerRepository"
import ReservationRepository from '../repositories/ReservationRepository';
import TableRepository, { GetTableOption } from "../repositories/TableRepository"
import { isInNowToEndDay } from '../utils/dateUtils';
import { NotFoundError, MissingConditionError, ResourceName } from '../exception/Error';
import OrderRepository from '../repositories/OrderRepository';

class OrderService {

   public async getOrderItems(order_id: string) {
      let orderItems = await OrderRepository.getOrderItems(order_id);
      if (orderItems == null) {
         throw new NotFoundError(ResourceName.ORDER, order_id);
      }

      return orderItems;
   }

   public async addOrderItems(order_items: [], order_id: string) {
      let orderItems;
      order_items.forEach(async (order_item: { id: string, quantity: number }) => {
         let orderItem = await OrderRepository.addOrderItem(order_id, order_item.id, order_item.quantity);
         orderItems.push(orderItem);
      })

      if (orderItems == undefined) return [];

      return orderItems;
   }

   public async updateOrderItemState(order_id: string, order_item: { id: string, served_quantity: number }) {
      let curOrderItem = await OrderRepository.getOrderItem(order_id, order_item.id);
      if (curOrderItem) {
         if (curOrderItem.totalQuantity < curOrderItem.servedQuantity + order_item.served_quantity) {
            throw new MissingConditionError(ResourceName.ORDERITEM, "served food is exceed the total quantity")
         }

         return await OrderRepository.updateServedOrderItem(order_id, order_item.id, order_item.served_quantity);
      }
      else {
         throw new NotFoundError(ResourceName.ORDERITEM, `${order_id}, ${order_item.id}`)
      }
   }

   public async updateOrderState(order_id: string, order_state: OrderState) {
      let order = await OrderRepository.updateOrderState(order_id, order_state)
      return order
   }
}

export default new OrderService
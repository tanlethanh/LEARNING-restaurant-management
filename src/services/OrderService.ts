import { OrderItem, OrderState, ReservationState, TableState } from '@prisma/client';
import { BookedCustomer, Customer, CustomerType, Table, Reservation } from '@prisma/client';
import CustomerRepository from "../repositories/CustomerRepository"
import ReservationRepository from '../repositories/ReservationRepository';
import TableRepository, { GetTableOption } from "../repositories/TableRepository"
import { isInNowToEndDay } from '../utils/dateUtils';
import { NotFoundError, MissingConditionError, ResourceName } from '../exception/Error';
import OrderRepository, { Quantity } from '../repositories/OrderRepository';

class OrderService {

   public async getOrderItems(order_id: string) {
      let orderItems = await OrderRepository.getOrderItems(order_id);
      if (!orderItems) {
         throw new NotFoundError(ResourceName.ORDER, order_id);
      }

      return orderItems;
   }

   public addOrderItems(order_items: [], order_id: string) {
      let query = order_items.map((order_item: { id: string, quantity: number }) => {
         if (order_item.quantity > 0) {
            return OrderRepository.addOrderItem(order_id, order_item.id, order_item.quantity);
         }
      })

      return Promise.all(query)
   }

   public async updateOrderItemQuantity(order_id: string, food_id: string, quantity: Quantity) {
      let curOrderItem = await OrderRepository.getOrderItem(order_id, food_id);
      if (curOrderItem) {
         if (curOrderItem.totalQuantity < curOrderItem.servedQuantity + quantity.servedQuantity) {
            throw new MissingConditionError(ResourceName.ORDERITEM, "served food exceed the total quantity")
         }
         else if (curOrderItem.totalQuantity + quantity.totalQuantity < curOrderItem.servedQuantity ||
            curOrderItem.totalQuantity + quantity.totalQuantity < curOrderItem.preparingQuantity) {
            throw new MissingConditionError(ResourceName.ORDERITEM, "cancled food number exceed preparing quantity")
         }

         return await OrderRepository.updateOrderItemQuantity(order_id, food_id, quantity);
      }
      else {
         throw new NotFoundError(ResourceName.ORDERITEM, `${order_id}, ${food_id}`)
      }
   }

   public async updateOrderState(order_id: string, order_state: OrderState) {
      let order = await OrderRepository.updateOrderState(order_id, order_state)
      return order
   }
}

export default new OrderService
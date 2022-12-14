import { OrderItem, OrderState, ReservationState, TableState } from '@prisma/client';
import { BookedCustomer, Customer, CustomerType, Table, Reservation } from '@prisma/client';
import CustomerRepository from "../repositories/CustomerRepository"
import ReservationRepository from '../repositories/ReservationRepository';
import TableRepository, { GetTableOption } from "../repositories/TableRepository"
import { isInNowToEndDay } from '../utils/dateUtils';
import { NotFoundError, MissingConditionError, ResourceName } from '../exception/Error';
import OrderRepository from '../repositories/OrderRepository';

const DEFAUT_TABLE_ID = null
class TableService {
   public async updateTableState(table_number: number, table_state: TableState) {
      let table = await TableRepository.updateTableState(table_number, table_state)
      return table
   }
}

export default new TableService
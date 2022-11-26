import { OrderState, TableState } from "@prisma/client";
import { Request, Response } from "express";
import { MissingConditionError, NotFoundError, ResourceName } from "../exception/Error";
import Log from "../middlewares/Log";
import FoodRepository from "../repositories/FoodRepository";
import OrderRepository from "../repositories/OrderRepository";
import TableRepository from "../repositories/TableRepository";
import UserRepository from "../repositories/UserRepository";
import OrderService from "../services/OrderService";
import TableManagementService from "../services/OrderService";
import TableService from "../services/TableService";

class TableManagementController {
   public static async getOrderItems(req: Request, res: Response) {
      let { order_id } = req.params;

      try {
         let orderItems = TableManagementService.getOrderItems(order_id);

         return res.json({ orderItems: orderItems })
      }
      catch (error: Error | any) {
         Log.error(error.message)
         return res.status(400).json({
            error: error.message
         })
      }
   }

   public static async addOrderItem(req: Request, res: Response) {
      let { order_id } = req.params;
      let { order_items } = req.body;

      try {
         let orderItems = TableManagementService.addOrderItems(order_items, order_id)

         return res.json({
            orderItems: orderItems
         })
      }
      catch (error: Error | any) {
         Log.error(error.message)
         return res.status(400).json({
            error: error.message
         })
      }
   }

   public static async addSpecialReq(req: Request, res: Response) {

   }

   public static async updateOrderItemState(req: Request, res: Response) {
      let { order_id } = req.params;
      let { order_item } = req.body;

      try {
         let orderItem = TableManagementService.updateOrderItemState(order_id, order_item);

         return res.json({
            orderItem: orderItem
         })
      }
      catch (error: Error | any) {
         Log.error(error.message)
         return res.status(400).json({
            error: error.message
         })
      }
   }

   public static async updateDoneOrderState(req: Request, res: Response) {
      let { order_id, table_number } = req.params;

      try {
         await OrderService.updateOrderState(order_id, OrderState.DONE)
         await TableService.updateTableState(Number(table_number), TableState.FREE)

         return res.json({
            success: true
         })
      }
      catch (error: Error | any) {
         Log.error(error.message)
         return res.status(400).json({
            error: error.message
         })
      }
   }

   public static async getMenuPage(req: Request, res: Response) {
      let { order_id } = req.params;
      const foodList = await FoodRepository.getMenu();
      const categoryList = await FoodRepository.getAllCategory();
      const order = await OrderRepository.getOrderByID(order_id)

      console.log(categoryList)

      return res.render('pages/clerk/menu/menu-page', {
         foodList: foodList,
         categoryList: categoryList,
         order: order
      })
   }

   public static async getMangagePage(req: Request, res: Response) {
      // await TableRepository.generateRandomTables(10)
      // await FoodRepository.generateFoodItemDB()
      // await UserRepository.generateUserDB()
      const tableList = await TableRepository.getAllTable()
      const userList = await UserRepository.getAllUser()

      // for (let i = 0; i < 3; i++) {
      //     await OrderRepository.createOrderDB(tableList[i].id, userList[0].id)
      // }

      // let { clerk_id } = req.params
      let clerk_id = userList[0].id
      const orderList = await OrderRepository.getInprogessOrderList(clerk_id)
      return res.render('pages/clerk/tableList/tableList-page', {
         orderList: orderList,
      })
   }

}

export default TableManagementController
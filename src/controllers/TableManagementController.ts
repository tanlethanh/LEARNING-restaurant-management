import { OrderState, TableState } from "@prisma/client";
import { Request, Response } from "express";
import Log from "../middlewares/Log";
import FoodRepository from "../repositories/FoodRepository";
import OrderRepository from "../repositories/OrderRepository";
import UserRepository from "../repositories/UserRepository";
import OrderService from "../services/OrderService";
import TableManagementService from "../services/OrderService";
import TableService from "../services/TableService";

class TableManagementController {
   public static async getMenu(req: Request, res: Response) {
      try {
         let foodItems = await FoodRepository.getMenu()

         return res.json({ foodItems: foodItems })
      }
      catch (error: Error | any) {
         Log.error(error.message)
         return res.status(400).json({
            error: error.message
         })
      }
   }

   public static async getOrderItems(req: Request, res: Response) {
      let order_id = String(req.query.order_id)

      try {
         let orderItems = await TableManagementService.getOrderItems(order_id);

         return res.json({ orderItems: orderItems })
      }
      catch (error: Error | any) {
         Log.error(error.message)
         return res.status(400).json({
            error: error.message
         })
      }
   }

   public static async addOrderItems(req: Request, res: Response) {
      let order_id = String(req.query.order_id)
      let { order_items } = req.body;

      try {
         let orderItems = await TableManagementService.addOrderItems(order_items, order_id)

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

   public static async updateOrderItemQuantity(req: Request, res: Response) {
      let order_id = String(req.query.order_id)
      let { order_item } = req.body;

      try {
         let orderItem = await TableManagementService.updateOrderItemQuantity(order_id, order_item.food_id, order_item.quantity);

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
      let order_id = String(req.query.order_id)

      try {
         let order = await OrderRepository.getOrderByID(order_id)
         if (!order) {
            return res.json({
               success: false
            })
         }

         await OrderService.updateOrderState(order_id, OrderState.DONE)
         await TableService.updateTableState(order.table.tableNumber, TableState.FREE)

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
      console.log('load menu page')
      let { order_id } = req.params;
      const foodList = await FoodRepository.getMenu();
      const categoryList = await FoodRepository.getAllCategory();
      const order = await OrderRepository.getOrderByID(order_id)

      return res.render('pages/clerk/menu/menu-page', {
         foodList: foodList,
         categoryList: categoryList,
         order: order
      })
   }

   public static async getMangagePage(req: Request, res: Response) {
      console.log('load manage page')
      // await TableRepository.generateRandomTables(10)
      // await FoodRepository.generateFoodItemDB()
      // await UserRepository.generateUserDB()
      // const tableList = await TableRepository.getAllTable()
      const userList = await UserRepository.getAllUser()

      // for (let i = 0; i < 3; i++) {
      //    await OrderRepository.createOrderDB(tableList[i].id, userList[0].id)
      // }

      // let { clerk_id } = req.params
      let clerk_id = userList[0].id
      const user = await UserRepository.getUserName(clerk_id)
      const orderList = await OrderRepository.getInprogessOrderList(clerk_id)
      return res.render('pages/clerk/tableList/tableList-page', {
         orderList: orderList,
         user: user
      })
   }

}

export default TableManagementController
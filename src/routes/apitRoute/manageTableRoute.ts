import express, { Router } from 'express';
import TableManagementController from '../../controllers/TableManagementController';

const manageTableRoute: Router = express.Router()
manageTableRoute
   // lay danh sach mon an da order cua order dang phuc vu
   .get('/orderitems/:order_id/', TableManagementController.getOrderItems)
   // them mon an vao order
   .post('/orderitems/:order_id/', TableManagementController.addOrderItem)
   // them special requirement
   .post('/requirement/:order_id', TableManagementController.addSpecialReq)
   // cap nhat trang thai cua mon an (served)
   .post('/foodstate/:order_id', TableManagementController.updateOrderItemState)
   // cap nhat trang thai cua order (DONE), table(free)
   .post('/orderstate/:table_number/:order_id', TableManagementController.updateDoneOrderState)


export default manageTableRoute
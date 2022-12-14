import express, { Router } from 'express';
import TableManagementController from '../../controllers/TableManagementController';

const manageTableRoute: Router = express.Router()

manageTableRoute.route('/menu')
   .get(TableManagementController.getMenu)

manageTableRoute.route('/orderitems')
   .get(TableManagementController.getOrderItems)
   .post(TableManagementController.addOrderItems)

manageTableRoute.route('/requirement')
   .post(TableManagementController.addSpecialReq)

manageTableRoute.route('/foodstate')
   // cap nhat trang thai cua mon an (served)
   .post(TableManagementController.updateOrderItemQuantity)

manageTableRoute.route('/doneorder')
   // cap nhat trang thai cua order (DONE), table(free)
   .post(TableManagementController.updateDoneOrderState)


export default manageTableRoute
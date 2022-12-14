import PrismaDB from "../prisma/PrismaDB";
import { OrderState, Prisma } from "@prisma/client";
import IQuantityOrder from "../interfaces/IRepository/IOrderRepository";


class OrderRepository {

    public async createNewOrder(tableId: string, customerId: string) {
        const orderData: Prisma.OrderCreateInput = {
            state: "INPROGRESS",
            table: {
                connect: {
                    id: tableId
                }
            },
            customer: {
                connect: {
                    id: customerId
                }
            },
            employee: undefined
        }

        return await PrismaDB.order.create({
            data: orderData,
            include: {
                table: true,
                customer: true,
                employee: true
            }
        })

    }

    public async createOrderDB(tableId: string, userId: string) {
        const orderData: Prisma.OrderCreateInput = {
            state: "INPROGRESS",
            table: {
                connect: {
                    id: tableId
                }
            },
            employee: {
                connect: {
                    id: userId
                }
            }
        }

        return await PrismaDB.order.create({
            data: orderData,
            include: {
                table: true,
                employee: true
            }
        })

    }

    // lay thong tin ban
    public async getOrderByID(order_id: string) {
        const order = await PrismaDB.order.findUnique({
            where: {
                id: order_id
            },
            select: {
                arrivalTime: true,
                table: {
                    select: {
                        numberOfSeats: true,
                        tableNumber: true
                    }
                }
            }
        });

        return order;
    }

    // lay danh sach ban phuc vu cua nhan vien
    async getInprogessOrderList(employee_id: string) {
        const orderList = await PrismaDB.order.findMany({
            where: {
                employeeId: employee_id,
                state: OrderState.INPROGRESS
            },
            select: {
                id: true,
                arrivalTime: true,
                state: true,
                table: {
                    select: {
                        numberOfSeats: true,
                        tableNumber: true
                    }
                }
            }
        });

        return orderList;
    }

    // lay danh sach mon an da order cua ban dang phuc vu
    async getOrderItems(order_id: string) {
        const orderItems = await PrismaDB.orderItem.findMany({
            where: {
                orderId: order_id
            }
        });

        return orderItems;
    }

    // lay danh sach mon an da order cua ban dang phuc vu
    async getOrderItem(order_id: string, foodItem_id: string) {
        const orderItem = await PrismaDB.orderItem.findUnique({
            where: {
                orderId_foodItemId: {
                    orderId: order_id,
                    foodItemId: foodItem_id,
                }
            }
        });

        return orderItem;
    }

    // them cac mon an vao order
    async addOrderItem(order_id: string, foodItem_id: string, quantity: number) {
        let foodItem = await PrismaDB.foodItem.findUnique({
            where: {
                id: foodItem_id
            },
            select: {
                discount: true,
                price: true
            }
        })

        if (foodItem) {
            const orderItem = await PrismaDB.orderItem.upsert({
                where: {
                    orderId_foodItemId: {
                        orderId: order_id,
                        foodItemId: foodItem_id,
                    }
                },
                update: {
                    totalQuantity: {
                        increment: quantity
                    }
                },
                create: {
                    totalQuantity: quantity,
                    servedQuantity: 0,
                    preparingQuantity: 0,
                    price: foodItem.price,
                    discount: foodItem?.discount,
                    foodItem: {
                        connect: {
                            id: foodItem_id
                        }
                    },
                    order: {
                        connect: {
                            id: order_id
                        }
                    }
                }
            });

            return orderItem;
        }

        return null;
    }

    async updateOrderState(order_id: string, state: OrderState) {
        const order = await PrismaDB.order.update({
            where: {
                id: order_id
            },
            data: {
                state: state
            }
        })

        return order;
    }

    async updateOrderItemQuantity(order_id: string, foodItem_id: string, quantity: IQuantityOrder) {
        const quantityData: Prisma.OrderItemUpdateInput = {
            totalQuantity: {
                increment: quantity.totalQuantity
            },
            preparingQuantity: {
                increment: quantity.preparingQuantity
            },
            servedQuantity: {
                increment: quantity.servedQuantity
            }
        }

        const orderitem = await PrismaDB.orderItem.update({
            where: {
                orderId_foodItemId: {
                    orderId: order_id,
                    foodItemId: foodItem_id
                }
            },
            data: quantityData
        })

        return orderitem;
    }
}

export default new OrderRepository
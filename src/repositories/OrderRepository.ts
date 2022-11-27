import PrismaDB from "../prisma/PrismaDB";
import { Prisma } from "@prisma/client";

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

}

export default new OrderRepository
import { BookedCustomer, CustomerType, Prisma, ReservationState, Table } from '@prisma/client';
import PrismaDB from "../prisma/PrismaDB";
import { randomPhoneNumbers } from 'random-phone-numbers';
const random_name = require('node-random-name')


class CustomerRepository {
    public async generateRandomBookedCustomers(count: number) {
        const customers: BookedCustomer[] = []
        for (let index = 0; index < count; index++) {

            const customerData: Prisma.BookedCustomerCreateInput = {
                phoneNumber: randomPhoneNumbers.generate('VN'),
                firstName: random_name({ random: Math.random }).split(" ")[0],
                lastName: random_name({ random: Math.random }).split(" ")[0],
                customer: {
                    create: {
                        type: CustomerType.BOOKED
                    }
                }
            }
            const customer = await PrismaDB.bookedCustomer.create({
                data: customerData
            })
            customers.push(customer)
        }
        return customers
    }

    public addNewReservation(time: Date, numberOfPeople: number, customerId: string, tableId: string) {
        const reservationData: Prisma.ReservationCreateInput = {
            createdDate: '',
            updatedDate: '',
            numberOfPeople:  numberOfPeople,
            state: ReservationState.INIT,
            assignedTable: {
                connect: {id: tableId}
            },
            customer: {
                connect: {customerId: customerId}
            }
        }
    }

}

export default new CustomerRepository
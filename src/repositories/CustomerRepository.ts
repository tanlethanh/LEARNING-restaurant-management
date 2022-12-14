import ICustomerRepository from "../interfaces/IRepository/ICustomerRepository";
import { BookedCustomer, Customer, CustomerType, Prisma, ReservationState } from "@prisma/client";
import PrismaDB from "../prisma/PrismaDB";
import { randomPhoneNumbers } from 'random-phone-numbers';
const random_name = require('node-random-name')


class CustomerRepository implements ICustomerRepository {
    
    /**
     * @author Tan Le <https://github.com/tanlethanh>
     * @param count: number of the fake customers want to create
     * @returns list of booked customers
     */
    //  public async generateRandomCustomers(count: number) {
        
    //     const customers: Customer[] = []
    //     for (let index = 0; index < count; index++) {

    //         const customerData: Prisma.CustomerCreateInput = {
    //             id: (index+1).toString(),
    //             type: CustomerType.NEW
    //         }
    //         const customer = await PrismaDB.bookedCustomer.create({
    //             data: customerData,
    //             include: {
    //                 reservations: true
    //             }
    //         })

    //         customers.push(customer)
    //     }
    //     return customers
    // }
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
                data: customerData,
                include: {
                    reservations: true
                }
            })

            customers.push(customer)
        }
        return customers
    }

    public async getAllBookedCustomer() {
        return await PrismaDB.bookedCustomer.findMany({})
    }

    public async getCustomerById(id: string) {
        return await PrismaDB.customer.findUnique({
            where: {
                id: id
            },
            include: {
                bookedCustomer: true,
                newCustomer: true
            }
        })
    }

}

export default new CustomerRepository
import ICustomerRepository from "../interfaces/IRepository/ICustomerRepository";
import { BookedCustomer, CustomerType, NewCustomer, Prisma, ReservationState, NewCustomerState } from "@prisma/client";
import PrismaDB from "../prisma/PrismaDB";
import { randomPhoneNumbers } from 'random-phone-numbers';
const random_name = require('node-random-name')


class CustomerRepository implements ICustomerRepository {
    /**
     * @author Tan Le <https://github.com/tanlethanh>
     * @param count: number of the fake customers want to create
     * @returns list of booked customers
     */
    public async generateRandomBookedCustomers(count: number) {
        console.log("Generating random customers")
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

    public async generateRandomNewCustomers(count: number) {
        console.log("Generating random new customers")
        const customers: NewCustomer[] = []
        for (let index = 0; index < count; index++) {

            const customerData: Prisma.NewCustomerCreateInput = {
                ordinamNumber: index,
                numOfSeats : Math.round(Math.random()*7)+1,
                date: new Date(),
                state : NewCustomerState.UNASSIGNED,
                customer: {
                    create: {
                        type: CustomerType.NEW
                    }
                }
            }
            const customer = await PrismaDB.newCustomer.create({
                data: customerData,
            })

            customers.push(customer)
        }
        return customers
    }

    public async generateNewCustomers(numOfSeats: number, ordinamNumber:number) {
        console.log("Generating one new customers")
        const customerData: Prisma.NewCustomerCreateInput = {
                ordinamNumber: ordinamNumber,
                numOfSeats : numOfSeats,
                date: new Date(),
                state : NewCustomerState.UNASSIGNED,
                customer: {
                    create: {
                        type: CustomerType.NEW
                    }
                }
            }
            const customer = await PrismaDB.newCustomer.create({
                data: customerData,
            })
        return customer;
    }

    public async getAllNewCustomer() {
        return await PrismaDB.newCustomer.findMany({
            orderBy:{
                ordinamNumber : "asc"
            }
        })
    }

    public async updateNewCustomerState(id: string){
        return await PrismaDB.newCustomer.update({
            where: {
                customerId: id
            },
            data: {
                state : NewCustomerState.ASSIGNED
            }
        })
    }
}

export default new CustomerRepository
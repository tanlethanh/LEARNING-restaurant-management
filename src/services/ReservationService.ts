import { ReservationState, TableState } from '@prisma/client';
import { BookedCustomer, Customer, CustomerType, Table, Reservation } from '@prisma/client';
import ReservationRepository from '../repositories/ReservationRepository';
import CustomerRepository from '../repositories/CustomerRepository';

class ReservationService{
    public async createReservation(date: Date, time: Date, name: string, phoneNumber: string, numberOfPeople: number ){
        let bookedCustomer = await CustomerRepository.CreateBookedCustomer(name, phoneNumber)
        let bookedDate = new Date();
        bookedDate.setFullYear(date.getFullYear(),date.getMonth(), date.getDate())
        bookedDate.setHours(time.getHours(),time.getMinutes())
        let reservation = await ReservationRepository.createNewReservation(bookedDate,numberOfPeople,bookedCustomer.customerId)
        console.log("helloooo")
        return reservation
    }
}
export default new ReservationService
import { ReservationState, TableState } from '@prisma/client';
import { BookedCustomer, Customer, CustomerType, Table, Reservation } from '@prisma/client';
import ReservationRepository from '../repositories/ReservationRepository';
import CustomerRepository from '../repositories/CustomerRepository';

class ReservationService{
    public async createReservation(date: Date, name: string, phoneNumber: string, numberOfPeople: number ){
        let bookedCustomer = await CustomerRepository.CreateBookedCustomer(name, phoneNumber)
        let reservation = await ReservationRepository.createNewReservation(date,numberOfPeople,bookedCustomer.customerId)
        console.log("helloooo")
        return reservation
    }
    
}
export default new ReservationService
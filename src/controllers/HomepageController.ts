import { Request, Response } from "express";
import TableRepository from "../repositories/TableRepository";
import ReservationService from "../services/ReservationService";
import Log from "../middlewares/Log";

const listSeat = ["2", "4", "8"]

const listTime = [
    "07:00",
    "07:30",
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00"
]

const slots: { [key: string]: { [key: string]: number } } = {
    "2": {
        "07:00": 0,
        "07:30": 0,
        "08:00": 0,
        "08:30": 0,
        "09:00": 0,
        "09:30": 0,
        "10:00": 0,
        "10:30": 0,
        "11:00": 0,
        "11:30": 0,
        "12:00": 0,
        "12:30": 0,
        "13:00": 0,
        "13:30": 0,
        "14:00": 0
    }
    ,
    "4": {
        "07:00": 0,
        "07:30": 0,
        "08:00": 0,
        "08:30": 0,
        "09:00": 0,
        "09:30": 0,
        "10:00": 0,
        "10:30": 0,
        "11:00": 0,
        "11:30": 0,
        "12:00": 0,
        "12:30": 0,
        "13:00": 0,
        "13:30": 0,
        "14:00": 0
    },
    "8": {
        "07:00": 0,
        "07:30": 0,
        "08:00": 0,
        "08:30": 0,
        "09:00": 0,
        "09:30": 0,
        "10:00": 0,
        "10:30": 0,
        "11:00": 0,
        "11:30": 0,
        "12:00": 0,
        "12:30": 0,
        "13:00": 0,
        "13:30": 0,
        "14:00": 0
    }
}

class HomepageController {
    static async postReservation(req: Request, res: Response) {

        const tables = await TableRepository.getAllSortedTables()

        const num_seats: { [key: string]: number } = {
            "2": 0,
            "4": 0,
            "8": 0
        }

        tables?.forEach((ele) => {
            num_seats[ele.numberOfSeats.toString()]++;
        })

        const default_threshold = 0.7
        const date = req.body.date
        const time = req.body.reservationTime
        const people = req.body.numberOfPerson

        if (!listTime.includes(time) || !listSeat.includes(people)) {
            return res.json({
                "message": "Invalid data"
            })
        }

        const numSlot = slots[people][time]


        console.log(numSlot, num_seats[people])
        if (numSlot >= num_seats[people] * default_threshold) {
            return res.json({
                "message": "Invalid"
            })
        }

        return res.render('pages/homepage/homepage-reservation', { withModal: true , date: date, people: people})
    }

    public static async initReservation(req: Request, res: Response) {
        const name = req.body.name
        const phoneNumber = req.body.phone_number
        const time = req.body.reservationTime
        const numberOfPeople = parseInt(req.body.numberOfPerson)
        const date = req.body.date
        try {
            // let reservation = await ReservationService.createReservation(date, time, name,phoneNumber,numberOfPeople);
   
            return res.json({ date: name })
         }
         catch (error: Error | any) {
            Log.error(error.message)
            return res.status(400).json({
               error: error.message
            })
         }
    }

    public static async getReservationHoursAt(req: Request, res: Response) {

    }

    public static async getHomepageView(req: Request, res: Response, next: Function) {
        return res.render('pages/homepage/homepage')
    }

    public static async getHomepageReservationView(req: Request, res: Response, next: Function) {
        return res.render('pages/homepage/homepage-reservation', { withModal: false })
    }
}

export default HomepageController
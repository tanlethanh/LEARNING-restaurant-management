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

const time_slots: { [key: string]: boolean } = {
    "07:00": true,
    "07:30": true,
    "08:00": true,
    "08:30": true,
    "09:00": true,
    "09:30": true,
    "10:00": true,
    "10:30": true,
    "11:00": true,
    "11:30": true,
    "12:00": true,
    "12:30": true,
    "13:00": true,
    "13:30": true,
    "14:00": true
}

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
        const action = req.body.action
        if (action == "getForm") {
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
                return res.render('pages/homepage/homepage-reservation', { withModal: false, withNotify: true, isError: true })
            }

            const numSlot = slots[people][time]
            console.log(numSlot, num_seats[people])
            if (numSlot >= num_seats[people] * default_threshold) {
                return res.render('pages/homepage/homepage-reservation', { withModal: false, withNotify: true, isError: true })
            }
            return res.render('pages/homepage/homepage-reservation', { withModal: true, withNotify: false, isError: false, date: date, people: people, time: time })
        }
        else if (action == "postForm") {
            const name = req.body.name
            const phoneNumber = req.body.phone_number
            const numberOfPeople = parseInt(req.body.numberOfPerson)
            const date = new Date(req.body.date + " " + req.body.reservationTime)
            date.setTime(date.getTime() - new Date().getTimezoneOffset() * 60 * 1000);
            try {
                let reservation = await ReservationService.createReservation(date, name, phoneNumber, numberOfPeople);
                slots[numberOfPeople][req.body.reservationTime]++;
                return res.render('pages/homepage/homepage-reservation', { withModal: false, withNotify: true, isError: false })
            }
            catch (error: Error | any) {
                Log.error(error.message)
                return res.render('pages/homepage/homepage-reservation', { withModal: false, withNotify: true, isError: true })
            }
        }
    }

    public static async getDateTimeReservation(req: Request, res: Response) {
        const action = (req.query.action)
        const default_threshold = 0.7
        const value = new String(req.query.value)
        const resultList = []
        if (action == "date") {
            const tables = await TableRepository.getAllSortedTables()
            const num_seats: { [key: string]: number } = {
                "2": 0,
                "4": 0,
                "8": 0
            }
            tables?.forEach((ele) => {
                num_seats[ele.numberOfSeats.toString()]++;
            })
            for (let i = 0, seatLen = listSeat.length; i < seatLen; i++)
                for (let j = 0, timeLen = listTime.length; j < timeLen; j++) {
                    if (slots[listSeat[i]][listTime[j]] < num_seats[listSeat[i]] * default_threshold) {
                        resultList.push(listSeat[i])
                        break
                    }
                }
        }
        if (action == "seat") {
            const tables = await TableRepository.getAllSortedTables()
            const num_seats: { [key: string]: number } = {
                "2": 0,
                "4": 0,
                "8": 0
            }
            tables?.forEach((ele) => {
                num_seats[ele.numberOfSeats.toString()]++;
            })
            for (let i = 0, timeLen = listTime.length; i < timeLen; i++) {
                console.log(value.toString())
                if (slots[value.toString()][listTime[i]] < num_seats[value.toString()] * default_threshold) {
                    resultList.push(listTime[i])
                }
            }
        }
        // const time = await ReservationService.
        return res.json({
            resultList: resultList
        })
    }
    public static async getHomepageView(req: Request, res: Response, next: Function) {
        return res.render('pages/homepage/homepage')
    }

    public static async getHomepageReservationView(req: Request, res: Response, next: Function) {
        return res.render('pages/homepage/homepage-reservation', { withModal: false, withNotify: false, isError: false })
    }
}

export default HomepageController
import OrderRepository from "../repositories/OrderRepository";
import PrismaDB from "../prisma/PrismaDB";
import { randomNumber } from "../utils/mathUtils";


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

function getDaysInMonth(month: number, year: number) {
    var date = new Date(year, month, 1);
    var days = [];
    while (date.getMonth() === month) {
        days.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }
    return days;
}

export async function createSampleData() {
    for (let i = 0; i < 12; i++) {

        const tables = await PrismaDB.table.findMany()

        let count_2 = 0
        let count_4 = 0
        let count_8 = 0

        tables.forEach(table => {
            if (table.numberOfSeats == 2) {
                count_2++
            }
            if (table.numberOfSeats == 4) {
                count_4++
            }
            if (table.numberOfSeats == 8) {
                count_8++
            }
        })

        console.log(tables)

        const curDate = new Date();

        // 70% dat truoc
        //// 50% la khach cu
        //// 50% la khach moi

        // Moi thang
        for (let i = 0; i < 12; i++) {
            const listDates = getDaysInMonth(i, curDate.getFullYear());

            listDates.forEach((d) => {
                
            });
        }

        // 30% khong dat truoc

        // Trend
        // Chả cá đế vương 1
        // Lẩu cá lăng
        // Chả cá đế vương 2
        // Rượu vang
        // Bao tử cá
    }

}
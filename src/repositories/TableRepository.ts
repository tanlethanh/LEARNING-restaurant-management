import { Prisma, TableState } from '@prisma/client';
import PrismaDB from "../prisma/PrismaDB";

const tableSeats = [2, 4, 8]

function randomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class TableRepository {

    public async generateRandomTables(count: number) {
        const tables: Prisma.TableCreateInput[] = []

        const tableSeatsLength = tableSeats.length
        for (let index = 0; index < count; index++) {
            const newTable: Prisma.TableCreateInput = {
                numberOfSeats: tableSeats[randomNumber(0, tableSeatsLength - 1)],
                state: TableState.FREE
            }
            tables.push(newTable)
        }

        const createdTables = await PrismaDB.table.createMany({
            data: tables
        })

        return createdTables
    }

    public async getAllSortedTables() {
        return await PrismaDB.table.findMany({
            orderBy: {
                tableNumber: "asc"
            }
        })
    }

}

export default new TableRepository
import { OrderState, Prisma, ReservationState, TableState } from '@prisma/client';
import PrismaDB from "../prisma/PrismaDB";
import { randomNumber } from '../utils/mathUtils';

const tableSeats = [2, 4, 8]
export enum GetTableOption {
    FULL,
    NORMAL
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

    public async getAllSortedTables(option: GetTableOption = GetTableOption.NORMAL) {
        if (option == GetTableOption.NORMAL) {
            return await PrismaDB.table.findMany({
                orderBy: {
                    tableNumber: "asc"
                }
            })
        }
        else if (option == GetTableOption.FULL) {
            return await PrismaDB.table.findMany({
                orderBy: {
                    tableNumber: "asc"
                },
                include: {
                    reservations: {
                        where: {
                            state: ReservationState.LOCKED
                        },
                        include: {
                            customer: true
                        }
                    },
                    orders: {
                        where: {
                            state: OrderState.INPROGRESS
                        },
                        include: {
                            customer: true
                        }
                    }
                }
            })
        }

    }

    public async getTableWithReservationsById(id: string) {
        return await PrismaDB.table.findUnique({
            where: {
                id: id
            },
            include: {
                reservations: true
            }
        })
    }

    public async updateTableStateById(id: string, state: TableState) {
        return await PrismaDB.table.update({
            where: {
                id: id
            },
            data: {
                state: state
            },
            include: {
                reservations: {
                    where: {
                        state: ReservationState.READY
                    }
                }
            }
        })
    }

    public async updateAllTableStates(state: TableState) {
        return await PrismaDB.table.updateMany({
            data: {
                state: state
            }
        })

    }
    
    async updateTableState(table_number: number, state: TableState) {
        const table = await PrismaDB.table.update({
            where: {
                tableNumber: table_number
            },
            data: {
                state: state
            }
        });

        return table;
    }

    /////////////////
    async getAllTable() {
        const tableList = await PrismaDB.table.findMany();
        return tableList;
    }

}

export default new TableRepository
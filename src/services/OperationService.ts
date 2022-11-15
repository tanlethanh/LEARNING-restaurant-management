import TableRepository from "../repositories/TableRepository"

class OperationService {

    public async getAllTables() {
        return await TableRepository.getAllSortedTables()
    }


}

export default new OperationService
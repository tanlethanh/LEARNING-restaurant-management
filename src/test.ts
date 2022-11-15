
import { table } from "console";
import TableRepository from "./repositories/TableRepository";
import CustomerRepository from "./repositories/CustomerRepository";

// TableRepository.generateRandomTables(10)
//     .then(tables => {
//         console.log(tables)
//     })

// TableRepository.getAllSortedTables()
//     .then(tables => {
//         console.log(tables)
//     })

CustomerRepository.generateRandomBookedCustomers(10)
    .then(customers => {
        console.log(customers)
    })
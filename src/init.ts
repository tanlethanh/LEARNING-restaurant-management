
import FoodRepository from "./repositories/FoodRepository";
import TableRepository from "./repositories/TableRepository";
import UserRepository from "./repositories/UserRepository";
import CustomerRepository from "./repositories/CustomerRepository";

export function init() {
    console.log("\n-------------------- Init data --------------------\n")
    console.log("\t Table data")
    TableRepository.generateRandomTables(30)
    console.log("\t Table data -> done")
    console.log("\t Customer data")
    CustomerRepository.generateRandomBookedCustomers(20)
    console.log("\t Customer data -> done")
    console.log("\t User data")
    UserRepository.generateUserDB()
    console.log("\t User data -> done")
    console.log("\t Menu data")
    FoodRepository.generateFoodItemDB()
    console.log("\t Menu data -> done")
    console.log("\n---------------------------------------------------\n")
}

init()

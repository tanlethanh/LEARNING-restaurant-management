
import FoodRepository from "./repositories/FoodRepository";
import TableRepository from "./repositories/TableRepository";
import UserRepository from "./repositories/UserRepository";
import CustomerRepository from "./repositories/CustomerRepository";

export function init() {
    // TableRepository.generateRandomTables(30)
    // CustomerRepository.generateRandomBookedCustomers(20)
    UserRepository.generateUserDB()
    FoodRepository.generateFoodItemDB()
}
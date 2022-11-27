import { FoodItem, Prisma } from "@prisma/client";
import PrismaDB from "../prisma/PrismaDB";
import { foodDatas } from "../data/foodData";

class FoodRepository {
   public async generateFoodItemDB() {

      const foodItems: FoodItem[] = []
      for (let index = 0; index < foodDatas.length; index++) {

         const foodData: Prisma.FoodItemCreateInput = {
            name: foodDatas[index].name,
            description: foodDatas[index].description,
            category: foodDatas[index].category,
            discount: Math.random(),
            price: foodDatas[index].price,
            images: {
               create: {
                  url: foodDatas[index].img
               }
            }
         }

         const foodItem = await PrismaDB.foodItem.create({
            data: foodData,
            include: {
               images: true
            }
         })

         foodItems.push(foodItem)
      }
      return foodItems
   }
}

export default new FoodRepository
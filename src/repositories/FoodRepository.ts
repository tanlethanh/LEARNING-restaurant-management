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
            discount: Math.random(),
            price: foodDatas[index].price,
            category: {
               connectOrCreate: {
                  where: {
                     name: foodDatas[index].category
                  },
                  create: {
                     name: foodDatas[index].category
                  }
               }
            },
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

   async getMenu() {
      const foodList = await PrismaDB.foodItem.findMany({
         include: {
            category: {
               select: {
                  name: true
               }
            },
            images: {
               select: {
                  url: true
               }
            }
         }
      });
      return foodList
   }

   async getAllCategory() {
      const categoryList = await PrismaDB.category.findMany({
         select: {
            name: true
         }
      });

      return categoryList
   }
}

export default new FoodRepository
import { Prisma, User } from "@prisma/client";
import PrismaDB from "../prisma/PrismaDB";
import { userDatas } from "../data/userData";

class UserRepository {
   public async generateUserDB() {
      const Users: User[] = []
      for (let index = 0; index < userDatas.length; index++) {

         const userData: Prisma.UserCreateInput = {
            firstName: userDatas[index].firstName,
            lastName: userDatas[index].lastName,
            username: userDatas[index].username,
            password: userDatas[index].password,
            role: userDatas[index].role
         }

         const user = await PrismaDB.user.create({
            data: userData
         })

         Users.push(user)
      }

      return Users
   }

   ////////////////
   async getAllUser() {
      const userList = await PrismaDB.user.findMany();
      return userList;
   }
}

export default new UserRepository
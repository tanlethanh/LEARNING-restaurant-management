import { Prisma, User, UserRole } from "@prisma/client";
import PrismaDB from "../prisma/PrismaDB";
import { userDatas } from "../data/userData";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

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

   public async getUserByUsername(username: string) {
      return await PrismaDB.user.findUnique({
         where: {
            username: username,
         }
      })
   }
   public async createUser(username: string, password: string, firstName: string, lastName: string, role: UserRole) {
      // hashing password
      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);

      const userData: Prisma.UserCreateInput = {
         username: username,
         password: password,
         firstName: firstName,
         lastName: lastName,
         role: role
      }
      const user = await PrismaDB.user.create({
         data: userData
      })
      return user;
   }
   public async checkPassword(password: string, loginPassword: string) {
      const isMatch = await bcrypt.compare(loginPassword, password);
      return isMatch;
   }

   public async getAllUser() {
      const userList = await PrismaDB.user.findMany();
      return userList;
   }

   public async getUserName(id: string) {
      const user = await PrismaDB.user.findUnique({
         where: {
            id: id
         },
         select: {
            firstName: true,
            lastName: true
         }
      });
      return user;
   }
}

export default new UserRepository
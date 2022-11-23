import PrismaDB from "../prisma/PrismaDB";
import { Prisma, Order, UserRole } from "@prisma/client"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

class UserRepository {
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

}

export default new UserRepository
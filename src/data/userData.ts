import { UserRole } from "@prisma/client";

export const userDatas = [
   {
      username: "thuc123",
      password: "1",
      firstName: "thuc",
      lastName: "nguyen",
      role: UserRole.CLERK
   },
   {
      username: "hung123",
      password: "1",
      firstName: "hung",
      lastName: "le",
      role: UserRole.CLERK
   },
   {
      username: "tan123",
      password: "1",
      firstName: "tan",
      lastName: "le",
      role: UserRole.MANAGER
   },
   {
      username: "hung_wibu123",
      password: "1",
      firstName: "hung",
      lastName: "wibu",
      role: UserRole.ADMIN
   },
]
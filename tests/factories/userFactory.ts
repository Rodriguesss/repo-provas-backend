import { prisma } from "../../src/database.js";
import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";

interface User {
  email: string,
  password: string
}

export default async function createUser(data: User) {
  const hashedPassword = bcrypt.hashSync(data.password, 10);
  await prisma.user.create({
    data: {
      ...data, password: hashedPassword
    }
  });

  return data;
}

export const newUser = {
  email: faker.internet.email(),
  password: "123456"
}
import { prisma } from "../../src/database.js";

async function create() {
  await prisma.user.create({
    data: {
      email: 'viniciusrdefreitas@gmail.com',
      password: '123456'
    }
  })
}

function userExists() {
  return {
    email: 'viniciusrdefreitas@gmail.com',
    password: '123456',
  }
}

export default { create, userExists };
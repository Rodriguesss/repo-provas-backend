import { prisma } from "../database.js";

async function findMany() {
  return prisma.discipline.findMany();
}

export default {
  findMany,
};

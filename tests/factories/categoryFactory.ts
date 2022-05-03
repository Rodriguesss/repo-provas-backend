import { prisma } from "../../src/database.js";

export async function categoryFactory() {
  const category = await prisma.category.findMany();
  return category[0];
}
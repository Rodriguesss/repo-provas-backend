import { prisma } from "../../src/database.js";

export async function disciplineFactory() {
  const disciplines = await prisma.discipline.findMany();
  return disciplines[0];
}
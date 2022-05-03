import { prisma } from "../../src/database.js";

export async function teacherFactory() {
  const teachers = await prisma.teacher.findMany();
  return teachers[0];
}
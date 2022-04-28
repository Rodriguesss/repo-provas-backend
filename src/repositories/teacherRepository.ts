import { prisma } from "../database.js";

async function findMany(disciplineId: number) {
  return prisma.teacherDiscipline.findMany({
    where: {
      disciplineId
    },
    select: {
      teacher: true
    }
  });
}

async function findDiscipline(teacherId: number, disciplineId: number) {
  return prisma.teacherDiscipline.findMany({
    select: {
      id: true
    }, 
    where: {
      disciplineId,
      teacherId
    }
  })
}

export default {
  findMany,
  findDiscipline
};

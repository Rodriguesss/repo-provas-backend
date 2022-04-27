import { prisma } from "../database.js";

async function findMany(disciplineId: number) {
  return prisma.teacher.findMany({
    select: {
      teacherDisciplines: {
        select: {
          teacher: {
            select: {
              name: true,
              id: true
            }
          },
        },
        where: {
          disciplineId,
        }
      }
    }
  });
}

export default {
  findMany,
};

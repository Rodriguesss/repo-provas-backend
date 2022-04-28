import { prisma } from "../database.js";
import { CreateDataTest } from "../services/testService.js";

async function getTestsByDiscipline() {
  return prisma.term.findMany({
    include: {
      disciplines: {
        include: {
          teacherDisciplines: {
            include: {
              teacher: true,
              tests: {
                include: {
                  category: true,
                },
              },
            },
          },
        },
      },
    },
  });
}

async function getTestsByTeachers() {
  return prisma.teacherDiscipline.findMany({
    include: {
      teacher: true,
      discipline: true,
      tests: {
        include: {
          category: true,
        },
      },
    },
  });
}

async function create(createDataTest: CreateDataTest) {
  return prisma.test.create({
    data: createDataTest
  })
}

async function findOne(name: string, categoryId: number, teacherDisciplineId: number) {
  return prisma.test.findMany({
    where: {
      name,
      categoryId,
      teacherDisciplineId
    }
  })
}

export default {
  getTestsByDiscipline,
  getTestsByTeachers,
  create,
  findOne
};

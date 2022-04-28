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

async function findName(name: string, categoryId: number, teacherDisciplineId: number) {
  return prisma.test.findMany({
    where: {
      name,
      categoryId,
      teacherDisciplineId
    }
  })
}

async function findOne(id: number) {
  return prisma.test.findUnique({
    where: {
      id
    }
  })
}

async function addView(id: number, views: number) {
  return prisma.test.update({
    where: {
      id
    },
    data: {
      views
    }
  })
}

export default {
  getTestsByDiscipline,
  getTestsByTeachers,
  create,
  findName,
  findOne,
  addView
};

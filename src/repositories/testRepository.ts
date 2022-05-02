import { prisma } from "../database.js";
import { CreateDataTest } from "../services/testService.js";

async function getTestsByDiscipline(q?: string) {
  return prisma.term.findMany({
    include: {
      disciplines: {
        include: {
          teacherDisciplines: {
            select: {
              teacher: true,
              tests: {
                include: {
                  category: true,
                },
              },
            },
            where: {
              teacher: {
                name: q
              }
            }
          },
        },
      },
    },
  });
}

async function getTestsByTeachers(q?: string) {
  return prisma.teacherDiscipline.findMany({
    select: {
      teacher: true,
      discipline: true,
      tests: {
        include: {
          category: true,
        },
      },
    },
    where: {
      teacher: {
        name: {
          mode: 'insensitive',
          contains: q,
        }
      }
    }
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

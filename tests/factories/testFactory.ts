import { prisma } from "../../src/database.js";

export async function testFactory(teacherId: number, disciplineId: number, categoryId: number, pdfUrl: string, name: string) {
  const { id: teacherDisciplineId } = await prisma.teacherDiscipline.create({
    data: {
      disciplineId,
      teacherId
    }
  });

  const test = await prisma.test.create({
    data: {
      name,
      pdfUrl,
      categoryId,
      teacherDisciplineId
    }
  })

  return test;
}

export async function testBodyFactory(teacherId: number, disciplineId: number, categoryId: number, pdfUrl: string, name: string) {
  const { id: teacherDisciplineId } = await prisma.teacherDiscipline.create({
    data: {
      disciplineId,
      teacherId
    }
  });

  return {
    name,
    pdfUrl,
    categoryId,
    disciplineId,
    teacherId
  };
}
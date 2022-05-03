import { prisma } from "../../src/database.js";

interface TeacherDiscipline {
  teacherId: number;
  disciplineId: number;
}

export default async function createTeacherDiscipline(data: TeacherDiscipline) {
  await prisma.teacherDiscipline.create({
    data: {
      teacherId: data.teacherId,
      disciplineId: data.disciplineId
    }
  });

  return data;
}

export const newTeacherDiscipline = (teacherId: number, disciplineId: number) => {
  return { teacherId, disciplineId }
}
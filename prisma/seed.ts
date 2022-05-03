import { prisma } from "../src/database.js";
import { Term, Discipline, Teacher, TeacherDiscipline, Category } from "@prisma/client";

type CreateTermData = Omit<Term, "id">;
type CreateDisciplineData = Omit<Discipline, "id">;
type CreateTeacherData = Omit<Teacher, "id">;
type CreateTeacherDisciplineData = Omit<TeacherDiscipline, "id">;
type CreateCategoryData = Omit<Category, "id">;

const term: CreateTermData = { number: 1 };
const discipline: CreateDisciplineData = { name: 'Lógica de programação', termId: 1 }
const teacher: CreateTeacherData = { name: 'Dina' };
const teacherDiscipline: CreateTeacherDisciplineData = { teacherId: 1, disciplineId: 1 };
const category: CreateCategoryData = { name: 'P1' };

async function main() {
  await prisma.term.upsert({
    where: { number: term.number },
    update: {},
    create: { ...term },
  });

  await prisma.discipline.upsert({
    where: { name: discipline.name },
    update: {},
    create: { ...discipline }
  });

  await prisma.teacher.upsert({
    where: { name: teacher.name },
    update: {},
    create: { ...teacher }
  })

  await prisma.teacherDiscipline.upsert({
    where: { id: 1 },
    update: {},
    create: { ...teacherDiscipline }
  })

  await prisma.category.upsert({
    where: { name: category.name },
    update: {},
    create: { ...category }
  })
}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
import teacherRepository from "../repositories/teacherRepository.js";

async function findMany(disciplineId: number) {
  const teachers = [];
  const response = await teacherRepository.findMany(disciplineId);
  response.forEach((teacher) => {
    if (teacher?.teacherDisciplines.length > 0) teachers.push(teacher?.teacherDisciplines);
  })

  /*teachers.forEach((teacher) => {
    if (teachers.length == 1)
  });*/
  return teachers;
}

export default {
  findMany,
};

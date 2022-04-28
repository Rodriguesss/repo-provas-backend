import teacherRepository from "../repositories/teacherRepository.js";

async function findMany(disciplineId: number) {
  const teachers = [];
  const response = await teacherRepository.findMany(disciplineId);

  response.forEach((item) => {
    teachers.push(item.teacher);
  });

  return teachers;
}

export default {
  findMany,
};

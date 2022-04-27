import disciplineRepository from "../repositories/disciplineRepository.js";

async function findMany() {
  return disciplineRepository.findMany();
}

export default {
  findMany,
};

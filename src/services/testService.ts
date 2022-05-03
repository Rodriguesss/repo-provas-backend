import { Test } from "@prisma/client";
import testRepository from "../repositories/testRepository.js";
import categoryRepository from "../repositories/categoryRepository.js";
import { badRequestError, conflictError, wrongSchemaError } from "../utils/errorUtils.js";
import teacherRepository from "../repositories/teacherRepository.js";

export type CreateDataTest = Omit<Test, "id">;
type RequestDataTest = {
  name: string;
  pdfUrl: string;
  categoryId: number;
  disciplineId: number;
  teacherId: number;
}

interface Filter {
  groupBy: "disciplines" | "teachers";
}

async function find(filter: Filter, q?: string) {
  const query = q === undefined || q === 'undefined' ?  "" : q.toLowerCase();

  if (filter.groupBy === "disciplines") {
    return testRepository.getTestsByDiscipline(query);
  } else if (filter.groupBy === "teachers") {
    return testRepository.getTestsByTeachers(query);
  }
}

async function create(requestDataTest: RequestDataTest) {
  const { name, pdfUrl: url, categoryId, teacherId, disciplineId } = requestDataTest;

  console.log(requestDataTest);

  if (!name || !url || !categoryId || !teacherId || !disciplineId) throw wrongSchemaError('Preencha todos os campos.');

  const pdfUrl = checkUrl(url);

  const existingCategory = await categoryRepository.findOne(categoryId);
  if (!existingCategory) throw badRequestError("Chosen category does not exist");

  const existingTeacherDiscipline = await teacherRepository.findDiscipline(teacherId, disciplineId);
  if (!(existingTeacherDiscipline.length > 0)) throw badRequestError("There is no teacher linked to this subject");

  const teacherDisciplineId = existingTeacherDiscipline[0].id;

  await checkNameTestExists(name, categoryId, teacherDisciplineId);

  const createDataTest: CreateDataTest = {
    name,
    pdfUrl,
    categoryId,
    teacherDisciplineId,
    views: 0
  }

  await testRepository.create(createDataTest);
}

export function checkUrl(str: string) {
  try {
    let url = new URL(str);
    return url.toString();
  } catch (err) {
    throw wrongSchemaError('Url invalid.');
  }
}

export async function checkNameTestExists(name: string, categoryId: number, teacherDisciplineId: number) {
  const testNameExists = await testRepository.findName(name, categoryId, teacherDisciplineId);

  if (testNameExists.length > 0) throw conflictError('Test name exists');
}

export async function addView(testId: number) {
  if (!testId) throw wrongSchemaError('Id da prova não informado.');

  const testExists = await testRepository.findOne(testId);
  if (!testExists) throw badRequestError('Prova não encontrada.');

  const views = testExists.views + 1;

  await testRepository.addView(testId, views);
}

export default {
  find,
  create,
  addView
};

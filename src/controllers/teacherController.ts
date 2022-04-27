import { Request, Response } from "express";
import teacherService from "../services/teacherService.js";

async function findMany(req: Request, res: Response) {
  const { disciplineId } = req.params;
  console.log(disciplineId);
  const teachers = await teacherService.findMany(Number(disciplineId));
  console.log(teachers);
  res.send({ teachers });
}

export default {
  findMany,
};

import { Request, Response } from "express";
import teacherService from "../services/teacherService.js";

async function findMany(req: Request, res: Response) {
  const { disciplineId } = req.params;
  const teachers = await teacherService.findMany(Number(disciplineId));
  res.send({ teachers });
}

export default {
  findMany,
};

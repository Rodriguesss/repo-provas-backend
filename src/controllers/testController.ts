import { Request, Response } from "express";
import testService from "../services/testService.js";

type RequestQuery = {
  groupBy: string,
  q: string
}

async function find(req: Request, res: Response) {
  const { groupBy, q } = req.query as RequestQuery;

  if (groupBy !== "disciplines" && groupBy !== "teachers") {
    return res.sendStatus(400);
  }

  const tests = await testService.find({ groupBy }, q);
  res.send({ tests });
}

async function create(req: Request, res: Response) {
  const body = req.body;

  await testService.create(body);

  res.sendStatus(200);
}

async function addView(req: Request, res) {
  const { testId } = req.params;

  await testService.addView(Number(testId));

  res.sendStatus(200);
}

export default {
  find,
  create,
  addView
};

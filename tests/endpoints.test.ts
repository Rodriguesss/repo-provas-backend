import app from '../src/app.js';
import supertest from 'supertest';
import { prisma } from "../src/database.js";
import userFactory from './factories/userFactory.js';

describe("POST /sign-up", () => {
  beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE users;`;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("given a valid task it should return 201", async () => {
    const body = userFactory.userExists();

    const result = await supertest(app).post("/sign-up").send(body);
    const status = result.status;

    expect(status).toEqual(201);
  });

  it("given a valid task it should return 409", async () => {
    userFactory.create();
    const body = userFactory.userExists();

    const result = await supertest(app).post("/sign-up").send(body);
    const status = result.status;

    expect(status).toEqual(409);

  });
});
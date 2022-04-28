import app from '../src/app.js';
import supertest from 'supertest';
import { prisma } from "../src/database.js";
import userFactory from './factories/userFactory.js';

describe("POST /sign-up", () => {
  beforeEach(async () => {
    dropDatabase();
  });

  afterAll(async () => {
    disconnect();
  });

  it("given a valid task it should return 201", async () => {
    const body = userFactory.userExists();

    const result = await supertest(app).post("/sign-up").send(body);
    const user = await prisma.user.findUnique({
      where: {
        email: body.email
      }
    });

    const status = result.status;

    expect(status).toEqual(201);
    expect(user).not.toBeNull();
  });

  it("given a valid task it should return 409", async () => {
    userFactory.create();
    const body = userFactory.userExists();

    const result = await supertest(app).post("/sign-up").send(body);
    const status = result.status;

    expect(status).toEqual(409);

  });

  it("given a valid task it should return 422", async () => {
    const body = {};

    const result = await supertest(app).post("/sign-up").send(body);
    const status = result.status;

    expect(status).toEqual(422);
  });
});

/*describe("POST /sign-in", () => {
  beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE users;`;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should return 200", async () => {
    userFactory.create();
    const body = userFactory.userExists();

    const result = await supertest(app).post("/sign-in").send(body);
    const status = result.status;

    expect(status).toEqual(200);
  });
});*/

async function disconnect() {
  await prisma.$disconnect();
}

async function dropDatabase() {
  await prisma.$executeRaw`TRUNCATE TABLE users;`;
}
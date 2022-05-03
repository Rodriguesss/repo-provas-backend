import app from '../src/app.js';
import supertest from 'supertest';
import { prisma } from "../src/database.js";
import createUser, { newUser } from './factories/userFactory.js';
import { disciplineFactory } from './factories/disciplineFactory.js';
import { teacherFactory } from './factories/teacherFactory.js';
import { testBodyFactory, testFactory } from './factories/testFactory.js';
import { categoryFactory } from './factories/categoryFactory.js';

async function disconnect() {
  await prisma.$disconnect();
}

async function dropUsers() {
  await prisma.$executeRaw`TRUNCATE TABLE users;`;
}

async function dropTests() {
  await prisma.$executeRaw`TRUNCATE TABLE tests;`;
}

describe("POST /sign-up", () => {
  beforeEach(async () => {
    dropUsers();
  });

  afterAll(async () => {
    disconnect();
  });

  it("given a valid task it should return 201", async () => {
    const { status } = await supertest(app).post("/sign-up").send(newUser);
    const user = await prisma.user.findUnique({
      where: {
        email: newUser.email
      }
    });

    expect(status).toEqual(201);
    expect(user).not.toBeNull();
  });

  it("given a valid task it should return 409", async () => {
    const userFactory = await createUser(newUser);

    const { status } = await supertest(app).post("/sign-up").send(userFactory);

    expect(status).toEqual(409);
  });

  it("given a valid task it should return 422", async () => {
    const emptyUser = {};

    const { status } = await supertest(app).post("/sign-up").send(emptyUser);

    expect(status).toEqual(422);
  });
});

describe("POST /sign-in", () => {
  beforeEach(async () => {
    dropUsers();
  });

  afterAll(async () => {
    disconnect();
  });

  it("should return 200", async () => {
    const userFactory = await createUser(newUser);

    const { status, body } = await supertest(app).post("/sign-in").send(userFactory);

    expect(status).toEqual(200);
    expect(body.token.length).toBeGreaterThan(0);
  });

  it("body with empty email should return 422", async () => {
    const userFactory = await createUser(newUser);

    const { status } = await supertest(app).post("/sign-in").send({ ...userFactory, email: '' });

    expect(status).toEqual(422);
  })

  it("body with empty password should return 422", async () => {
    const userFactory = await createUser(newUser);

    const { status } = await supertest(app).post("/sign-in").send({ ...userFactory, password: '' });

    expect(status).toEqual(422);
  })
});

describe("GET /tests", () => {
  beforeEach(async () => {
    dropUsers();
  });

  afterAll(async () => {
    disconnect();
  });

  it("token not set, should return 401", async () => {
    const token = await login(expect);

    const { status } = await supertest(app).get("/tests?");
    expect(status).toEqual(401);
  });

  it("invalid token, should return 401", async () => {
    await login(expect);

    const { status } = await supertest(app).get("/tests?").set('Authorization', '123456');
    expect(status).toEqual(401);
  });

  it("request parameter empty, should return 400", async () => {
    const token = await login(expect);

    const { status } = await supertest(app).get("/tests?").set('Authorization', token);

    expect(status).toEqual(400);
  });

  it("request parameter contains an invalid value, should return 400", async () => {
    const token = await login(expect);

    const { status } = await supertest(app).get("/tests?groupBy=teacher").set('Authorization', token);

    expect(status).toEqual(400);
  });

  it("should return 200", async () => {
    const token = await login(expect);

    const discipline = await disciplineFactory();

    const { status, body } = await supertest(app).get(`/tests?groupBy=disciplines&q=${discipline.name}`).set('Authorization', token);

    expect(status).toEqual(200);
    expect(body.tests.length).toBeGreaterThan(0);
  });

  it("should return 200", async () => {
    const token = await login(expect);

    const teacher = await teacherFactory();

    const { status, body } = await supertest(app).get(`/tests?groupBy=teachers&q=${teacher.name}`).set('Authorization', token);

    expect(status).toEqual(200);
    expect(body.tests.length).toBeGreaterThan(0);
  });
});

describe("POST /tests/:testId/views", () => {
  beforeEach(async () => {
    dropUsers();
  });

  beforeEach(async () => {
    dropTests();
  });

  afterAll(async () => {
    disconnect();
  });

  it("should 200", async () => {
    const teacher = await teacherFactory();
    const disciplines = await disciplineFactory();
    const category = await categoryFactory();

    const test = await testFactory(teacher.id, disciplines.id, category.id, "https://pt-br.reactjs.org/", "Prova React");

    const { status } = await supertest(app).post(`/tests/${test.id}/views`);

    expect(status).toEqual(200);
  });

  it("should 200", async () => {
    const { status } = await supertest(app).post(`/tests/50/views`);

    expect(status).toEqual(400);
  });
})

describe("POST /test", () => {
  beforeEach(async () => {
    dropUsers();
  });

  beforeEach(async () => {
    dropTests();
  });

  afterAll(async () => {
    disconnect();
  });

  it("should 200", async () => {
    const token = await login(expect);
    
    const teacher = await teacherFactory();
    const disciplines = await disciplineFactory();
    const category = await categoryFactory();
  
    const body = await testBodyFactory(teacher.id, disciplines.id, category.id, "https://pt-br.reactjs.org/", "Prova React");

    const { status } = await supertest(app).post(`/tests`).set('Authorization', token).send(body);

    expect(status).toEqual(200);
  });

  it("should 422", async () => {
    const token = await login(expect);
  
    const body = {};

    const { status } = await supertest(app).post(`/tests`).set('Authorization', token).send(body);

    expect(status).toEqual(422);
  })
});

async function login(expect: jest.Expect) {
  const userFactory = await createUser(newUser);

  const { status, body } = await supertest(app).post("/sign-in").send(userFactory);

  expect(status).toEqual(200);
  expect(body.token.length).toBeGreaterThan(0);

  return `Bearer ${body.token}`;
}
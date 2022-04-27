import { prisma } from "../src/database.js";

async function main() {
  await prisma.user.upsert({
    where: {},
    update: {},
    create: {
      email: "vinicius@gmail.com",
      password: "miojo123"
    },
  });
}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
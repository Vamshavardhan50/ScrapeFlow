import prisma from "../lib/prisma";

async function main() {
  try {
    await prisma.$connect();
    console.log("Database connection successful");
    const count = await prisma.workflow.count();
    console.log(`Found ${count} workflows`);
  } catch (e) {
    console.error("Database connection failed", e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

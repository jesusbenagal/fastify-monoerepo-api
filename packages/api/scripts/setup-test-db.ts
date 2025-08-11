import { PrismaClient } from "@app/db";

const prisma = new PrismaClient();

async function setupTestDatabase() {
  try {
    console.log("🔧 Setting up test database...");

    // Limpiar la base de datos
    await prisma.post.deleteMany();
    await prisma.user.deleteMany();

    console.log("✅ Test database setup complete!");
  } catch (error) {
    console.error("❌ Error setting up test database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

setupTestDatabase();

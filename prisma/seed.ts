import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create a hashed password for the default user
  const hashedPassword = await bcrypt.hash('defaultpassword123', 10);

  // Create default user with all required fields
  const user = await prisma.user.upsert({
    where: { email: 'default@example.com' },
    update: {},
    create: {
      id: 'default-user',
      email: 'default@example.com',
      password: hashedPassword,
      name: 'Default User',
      balance: 100000, // Starting with $100,000
    },
  });

  console.log('Seeded default user:', user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.create({
    data: {
      name: 'Super Admin',
      email: 'admin@ph-cr-traker.com',
      password: hashedPassword,
      role: 'admin',
      status: 'ACTIVE',
    },
  });

  console.log('Super Admin created successfully:');
  console.log(admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

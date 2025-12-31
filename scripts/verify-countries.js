const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const count = await prisma.country.count();
    console.log(`Total countries in DB: ${count}`);
    const sample = await prisma.country.findFirst();
    console.log('Sample country:', sample);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());

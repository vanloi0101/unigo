import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.count();
  const products = await prisma.product.count();
  const orders = await prisma.order.count().catch(() => 'N/A');
  const categories = await prisma.category.count().catch(() => 'N/A');

  console.log('=== Data trên Railway DB ===');
  console.log('Users:', users);
  console.log('Products:', products);
  console.log('Orders:', orders);
  console.log('Categories:', categories);
}

main().catch(console.error).finally(() => prisma.$disconnect());

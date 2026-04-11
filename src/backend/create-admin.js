import 'dotenv/config.js';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  try {
    const user = await prisma.user.upsert({
      where: { email: 'admin@unigo.com' },
      update: {},
      create: {
        email: 'admin@unigo.com',
        password: hashedPassword,
        name: 'Admin User',
        role: 'ADMIN'
      }
    });
    
    console.log('✅ Admin user created successfully:');
    console.log('Email:', user.email);
    console.log('Role:', user.role);
    console.log('\n📝 Login credentials:');
    console.log('Email: admin@unigo.com');
    console.log('Password: admin123');
    
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();

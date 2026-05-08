import 'dotenv/config';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

/**
 * Tạo hoặc cập nhật user ADMIN (idempotent).
 * Mặc định: admin@unigo.com / admin123
 * Production: đặt ADMIN_EMAIL, ADMIN_PASSWORD (và tùy chọn ADMIN_NAME) trong env rồi chạy: npm run seed:admin
 */
async function createAdmin() {
  const email = (process.env.ADMIN_EMAIL || 'admin@unigo.com').toLowerCase().trim();
  const plainPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const name = (process.env.ADMIN_NAME || 'Admin').trim() || 'Admin';

  if (plainPassword.length < 6) {
    console.error('❌ ADMIN_PASSWORD phải có ít nhất 6 ký tự (giống rule đăng nhập).');
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        password: hashedPassword,
        name,
        role: 'ADMIN',
      },
      create: {
        email,
        password: hashedPassword,
        name,
        role: 'ADMIN',
      },
    });

    console.log('✅ Tài khoản admin đã sẵn sàng trong database:');
    console.log('   Email:', user.email);
    console.log('   Role:', user.role);
    console.log('\n📝 Đăng nhập:');
    console.log('   Email:', email);
    if (process.env.ADMIN_PASSWORD) {
      console.log('   Password: khớp với biến ADMIN_PASSWORD bạn đã đặt');
    } else {
      console.log('   Password: admin123 (mặc định — trên production hãy đặt ADMIN_PASSWORD và chạy lại)');
    }
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();

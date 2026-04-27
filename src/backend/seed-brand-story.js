import 'dotenv/config';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

const BRAND_STORY_CONTENT = `Chúng tôi bắt đầu từ những ngày còn là sinh viên, khi việc tìm một chiếc vòng tay giá rẻ nhưng vẫn có ý nghĩa và cá tính không hề dễ. Những sản phẩm đẹp thường quá đắt, còn những chiếc vòng đơn giản lại thiếu câu chuyện.

Vì vậy, chúng tôi tạo ra Unigo – những chiếc vòng tay mang phong cách trẻ trung, dành cho học sinh, sinh viên, nhưng vẫn chứa đựng văn hoá Việt Nam trong từng chi tiết nhỏ.

Chúng tôi tin rằng, như tinh thần mà Thép Mới từng thể hiện, lòng yêu nước bắt đầu từ những điều giản dị. Không cần lớn lao, chỉ cần mỗi ngày mang theo một phần bản sắc của mình.

Unigo không chỉ là vòng tay.
Đó là cách thế hệ trẻ kết nối với văn hoá Việt, thể hiện cá tính và lan toả giá trị theo cách riêng.`;

async function seedBrandStory() {
  try {
    // Tìm hoặc tạo author mặc định
    let author = await prisma.author.findFirst({ where: { isActive: true } });

    if (!author) {
      author = await prisma.author.upsert({
        where: { slug: 'unigo-team' },
        update: {},
        create: {
          name: 'Unigo Team',
          slug: 'unigo-team',
          bio: 'Đội ngũ sáng lập Unigo',
          isActive: true,
        },
      });
      console.log('✅ Tạo author:', author.name);
    }

    // Upsert bài brand-story
    const post = await prisma.post.upsert({
      where: { slug: 'brand-story' },
      update: {
        title: 'Mỗi chiếc vòng,\nmột câu chuyện.',
        shortDescription: 'Câu chuyện ra đời của Unigo – thương hiệu vòng tay handmade mang văn hoá Việt.',
        content: BRAND_STORY_CONTENT,
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
      create: {
        title: 'Mỗi chiếc vòng,\nmột câu chuyện.',
        slug: 'brand-story',
        shortDescription: 'Câu chuyện ra đời của Unigo – thương hiệu vòng tay handmade mang văn hoá Việt.',
        content: BRAND_STORY_CONTENT,
        status: 'PUBLISHED',
        publishedAt: new Date(),
        authorId: author.id,
      },
    });

    console.log('✅ Bài brand-story đã được tạo/cập nhật:');
    console.log('   Slug:', post.slug);
    console.log('   Title:', post.title.replace('\n', ' '));
    console.log('   Status:', post.status);
    console.log('\n📝 Để chỉnh sửa: vào Admin → Bài đăng → tìm "brand-story"');
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

seedBrandStory();

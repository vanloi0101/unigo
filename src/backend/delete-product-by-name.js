import prisma from "./src/config/database.js";

const productName = "Vòng tay Phong thủy";

(async () => {
  try {
    console.log(`🔍 Đang tìm sản phẩm: "${productName}"...`);

    // Find product by name
    const product = await prisma.product.findFirst({
      where: {
        name: {
          contains: productName,
          mode: "insensitive",
        },
      },
    });

    if (!product) {
      console.log(`❌ Không tìm thấy sản phẩm: "${productName}"`);
      const allProducts = await prisma.product.findMany({
        select: { id: true, name: true },
      });
      console.log("\n📋 Danh sách sản phẩm hiện tại:");
      allProducts.forEach((p) => console.log(`  - ID ${p.id}: ${p.name}`));
      process.exit(0);
    }

    console.log(`\n✅ Tìm thấy sản phẩm:`);
    console.log(`  ID: ${product.id}`);
    console.log(`  Tên: ${product.name}`);
    console.log(`  Giá: ${product.price}`);
    console.log(`  Kho: ${product.stock}`);

    // Delete the product
    console.log(`\n🗑️  Đang xóa sản phẩm...`);
    const deleted = await prisma.product.delete({
      where: { id: product.id },
    });

    console.log(`✅ Xóa thành công sản phẩm ID ${deleted.id}: "${deleted.name}"`);
  } catch (error) {
    console.error(`❌ Lỗi:`, error.message);
  } finally {
    await prisma.$disconnect();
  }
})();

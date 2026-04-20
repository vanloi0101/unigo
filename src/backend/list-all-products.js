import prisma from "./src/config/database.js";

(async () => {
  try {
    console.log("📋 Danh sách tất cả sản phẩm hiện tại:\n");

    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        stock: true,
        category: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (products.length === 0) {
      console.log("❌ Không có sản phẩm nào trong database");
      process.exit(0);
    }

    console.log(`Tổng cộng: ${products.length} sản phẩm\n`);
    console.log("┌─────┬─────────────────────────────────┬──────────┬──────┬──────────────┐");
    console.log("│ ID  │ Tên sản phẩm                    │ Giá      │ Kho  │ Danh mục     │");
    console.log("├─────┼─────────────────────────────────┼──────────┼──────┼──────────────┤");

    products.forEach((p) => {
      const nameDisplay = p.name.length > 31 ? p.name.substring(0, 28) + "..." : p.name;
      const priceDisplay = p.price.toString().padEnd(8);
      const categoryDisplay = (p.category || "N/A").padEnd(12);
      
      console.log(
        `│ ${p.id.toString().padEnd(3)} │ ${nameDisplay.padEnd(31)} │ ${priceDisplay} │ ${p.stock.toString().padEnd(4)} │ ${categoryDisplay} │`
      );
    });

    console.log("└─────┴─────────────────────────────────┴──────────┴──────┴──────────────┘\n");

    // Tìm các sản phẩm có tên chứa "Phong"
    const phongProducts = products.filter((p) =>
      p.name.toLowerCase().includes("phong")
    );
    
    if (phongProducts.length > 0) {
      console.log("🔍 Sản phẩm có tên chứa 'Phong':");
      phongProducts.forEach((p) => {
        console.log(`  - ID ${p.id}: ${p.name}`);
      });
    } else {
      console.log(
        "❌ Không tìm thấy sản phẩm nào có tên chứa 'Phong'"
      );
    }
  } catch (error) {
    console.error("❌ Lỗi:", error.message);
  } finally {
    await prisma.$disconnect();
  }
})();

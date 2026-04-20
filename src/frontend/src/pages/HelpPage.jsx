import React from 'react';
import { FaRuler, FaTruck, FaExchangeAlt, FaQuestionCircle, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import SEO from '../components/common/SEO';

export default function HelpPage() {
  return (
    <>
      <SEO
        title="Hỗ trợ - Món Nhỏ Handmade"
        description="Hướng dẫn đo size, chính sách vận chuyển và đổi trả tại Món Nhỏ Handmade"
      />

      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Trung tâm hỗ trợ</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Tìm hiểu thêm về cách chọn size, chính sách vận chuyển và đổi trả tại Món Nhỏ Handmade
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Size Guide */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-brand-pink/30 rounded-xl flex items-center justify-center">
                <FaRuler className="text-xl text-brand-purple" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Hướng dẫn đo size</h2>
            </div>
            
            <div className="space-y-6 text-gray-600">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Vòng tay</h3>
                <p className="mb-3">Để chọn size vòng tay phù hợp, bạn có thể đo chu vi cổ tay bằng thước dây hoặc dây ruy băng:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Size S: Chu vi cổ tay 14-15cm</li>
                  <li>Size M: Chu vi cổ tay 15-16cm</li>
                  <li>Size L: Chu vi cổ tay 16-17cm</li>
                  <li>Size XL: Chu vi cổ tay 17-18cm</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Nhẫn</h3>
                <p className="mb-3">Đo chu vi ngón tay và tra bảng size:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Size 5: Chu vi 49mm</li>
                  <li>Size 6: Chu vi 52mm</li>
                  <li>Size 7: Chu vi 54mm</li>
                  <li>Size 8: Chu vi 57mm</li>
                </ul>
              </div>
              
              <p className="text-sm text-gray-500 italic">
                💡 Nếu bạn không chắc chắn về size, hãy liên hệ với chúng tôi qua Zalo để được tư vấn miễn phí!
              </p>
            </div>
          </section>

          {/* Shipping Policy */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <FaTruck className="text-xl text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Chính sách vận chuyển</h2>
            </div>
            
            <div className="space-y-4 text-gray-600">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">🚚 Giao hàng tiêu chuẩn</h3>
                  <p>3-5 ngày làm việc</p>
                  <p className="text-brand-purple font-medium">Phí: 25.000đ</p>
                  <p className="text-sm text-green-600 mt-2">✓ Miễn phí với đơn từ 300.000đ</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">⚡ Giao hàng nhanh</h3>
                  <p>1-2 ngày làm việc</p>
                  <p className="text-brand-purple font-medium">Phí: 35.000đ</p>
                  <p className="text-sm text-gray-500 mt-2">Chỉ áp dụng TP.HCM</p>
                </div>
              </div>
              
              <p className="text-sm text-gray-500">
                * Thời gian giao hàng có thể thay đổi tùy thuộc vào địa điểm và điều kiện thực tế.
              </p>
            </div>
          </section>

          {/* Return Policy */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FaExchangeAlt className="text-xl text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Chính sách đổi trả</h2>
            </div>
            
            <div className="space-y-4 text-gray-600">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Điều kiện đổi trả</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Sản phẩm còn nguyên tem, nhãn mác</li>
                  <li>Chưa qua sử dụng, còn trong bao bì gốc</li>
                  <li>Đổi trả trong vòng 7 ngày kể từ ngày nhận hàng</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Trường hợp được đổi trả miễn phí</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Sản phẩm bị lỗi do nhà sản xuất</li>
                  <li>Giao nhầm sản phẩm</li>
                  <li>Sản phẩm không đúng mô tả</li>
                </ul>
              </div>
              
              <div className="bg-yellow-50 rounded-xl p-4 mt-4">
                <p className="text-yellow-800 font-medium">
                  ⚠️ Lưu ý: Các sản phẩm đặt riêng (custom) sẽ không được đổi trả, trừ trường hợp lỗi từ shop.
                </p>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <FaQuestionCircle className="text-xl text-brand-purple" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Câu hỏi thường gặp</h2>
            </div>
            
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <h3 className="font-semibold text-gray-800 mb-2">Tôi có thể thanh toán bằng những hình thức nào?</h3>
                <p className="text-gray-600">Món Nhỏ hỗ trợ thanh toán COD (nhận hàng trả tiền) và chuyển khoản ngân hàng.</p>
              </div>
              
              <div className="border-b border-gray-100 pb-4">
                <h3 className="font-semibold text-gray-800 mb-2">Làm sao để theo dõi đơn hàng?</h3>
                <p className="text-gray-600">Sau khi đặt hàng, bạn sẽ nhận được mã vận đơn qua Zalo hoặc SMS để theo dõi.</p>
              </div>
              
              <div className="border-b border-gray-100 pb-4">
                <h3 className="font-semibold text-gray-800 mb-2">Sản phẩm có bảo hành không?</h3>
                <p className="text-gray-600">Tất cả sản phẩm của Món Nhỏ được bảo hành 6 tháng về lỗi kỹ thuật và chất liệu.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Tôi có thể đặt hàng số lượng lớn không?</h3>
                <p className="text-gray-600">Có, chúng tôi nhận đơn hàng số lượng lớn với giá ưu đãi. Vui lòng liên hệ Zalo để được báo giá.</p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-gradient-to-br from-brand-purple to-brand-dark rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Cần hỗ trợ thêm?</h2>
            <p className="mb-6 text-white/80">Đội ngũ Món Nhỏ luôn sẵn sàng hỗ trợ bạn!</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://zalo.me/0346450546"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white text-brand-purple px-6 py-3 rounded-full font-semibold hover:bg-brand-pink hover:text-white transition-all shadow-lg"
              >
                <FaPhoneAlt /> Zalo: 0346.450.546
              </a>
              <a
                href="mailto:monnho.handmade@gmail.com"
                className="inline-flex items-center justify-center gap-2 bg-white/20 text-white px-6 py-3 rounded-full font-semibold hover:bg-white/30 transition-all"
              >
                <FaEnvelope /> Email hỗ trợ
              </a>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

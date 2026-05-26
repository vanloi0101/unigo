import React from 'react';
import { Link } from 'react-router-dom';
import monNhoLogo from '../assets/mon-nho-logo.png';
import { FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa';
import { SiShopee } from 'react-icons/si';
import SEO from '../components/common/SEO';
import useFadeUp from '../hooks/useFadeUp';

const CORE_VALUES = [
  {
    icon: '💎',
    title: 'Chất lượng',
    desc: 'Sản phẩm được kiểm tra kỹ lưỡng trước khi bán. Đổi trả miễn phí trong 7 ngày nếu có lỗi từ nhà sản xuất.',
  },
  {
    icon: '💜',
    title: 'Cảm xúc',
    desc: 'Mỗi sản phẩm mang một câu chuyện riêng — tên gọi, ý nghĩa và lời nhắn gửi được chọn lọc kỹ càng.',
  },
  {
    icon: '🤝',
    title: 'Kết nối',
    desc: 'Xây dựng cộng đồng khách hàng gần gũi, hiểu được tâm lý và nhu cầu của giới trẻ.',
  },
  {
    icon: '🌿',
    title: 'Tận tâm',
    desc: 'Luôn lắng nghe và phản hồi nhanh chóng. Hỗ trợ khách hàng qua Zalo, Facebook và TikTok mỗi ngày.',
  },
];

const PHASES = [
  {
    icon: '🌱',
    title: 'Những ngày đầu',
    subtitle: 'Bắt đầu từ vài chiếc vòng nhỏ và thật nhiều sự chân thành.',
    color: 'bg-green-100 text-green-800',
  },
  {
    icon: '💌',
    title: 'Những người đồng hành',
    subtitle: 'Mỗi lượt follow, mỗi đơn hàng đều giúp Món Nhỏ lớn lên từng ngày.',
    color: 'bg-pink-100 text-pink-800',
  },
  {
    icon: '✨',
    title: 'Chặng đường phía trước',
    subtitle: 'Hy vọng một ngày nào đó, Món Nhỏ sẽ xuất hiện trong những khoảnh khắc đẹp nhất của bạn.',
    color: 'bg-purple-100 text-purple-800',
  },
];

export default function AboutPage() {
  useFadeUp();

  return (
    <>
      <SEO
        title="Về Chúng Tôi"
        description="Câu chuyện thương hiệu Món Nhỏ — Handmade jewelry dành cho giới trẻ Việt Nam. Tầm nhìn, sứ mệnh và giá trị cốt lõi."
      />

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="relative pt-36 pb-24 px-6 overflow-hidden bg-gradient-to-br from-brand-cream via-white to-purple-50">
        {/* Decor blobs */}
        <div className="absolute top-10 right-10 w-72 h-72 bg-brand-pink/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-brand-purple/10 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 fade-up">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-brand-purple/60 mb-5">
            Câu chuyện thương hiệu
          </span>
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-brand-dark leading-tight mb-8">
            Về <span className="text-gradient">Món Nhỏ</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Không phải ngẫu nhiên chúng tôi chọn tên <strong className="text-brand-purple">Món Nhỏ</strong>.
            Trong cuộc sống, có những khoảnh khắc mà một món quà nhỏ lại mang ý nghĩa lớn hơn bất cứ điều gì.
          </p>
        </div>
      </section>

      {/* ── QR BIO - CONNECT WITH US ─────────────────────── */}
      <section className="py-16 px-6 bg-gradient-to-r from-brand-purple/5 via-transparent to-brand-pink/5 border-y-2 border-brand-purple/20">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-center gap-12">
            {/* Logo */}
            <div className="flex flex-col items-center fade-up">
              <p className="text-sm font-bold uppercase tracking-widest text-brand-purple/70 mb-4">Món Nhỏ</p>
              <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-brand-purple/20 hover:shadow-xl transition-all">
                <img 
                  src={monNhoLogo} 
                  alt="Món Nhỏ Logo" 
                  className="w-[180px] h-[180px] object-contain hover:scale-105 transition-transform"
                />
              </div>
              <p className="text-xs text-gray-500 mt-4 text-center max-w-[180px]">
                Handmade Jewelry
              </p>
            </div>

            {/* Social Links */}
            <div className="flex-1">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-dark mb-2">
                Kết nối với Món Nhỏ
              </h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Theo dõi chúng mình trên các nền tảng xã hội để nhận cập nhật sản phẩm mới, khuyến mãi độc quyền và câu chuyện thương hiệu.
              </p>
              
              <div className="flex flex-wrap gap-4">
                {/* Facebook */}
                <a
                  href="https://www.facebook.com/monnhohandmade"
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-3 px-5 py-3 bg-blue-50 border-2 border-blue-200 rounded-xl hover:bg-blue-100 hover:border-blue-400 transition-all hover:shadow-md"
                >
                  <FaFacebook className="text-2xl text-blue-600 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold text-gray-700">Facebook</span>
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/monnhohandmade/"
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-3 px-5 py-3 bg-pink-50 border-2 border-pink-200 rounded-xl hover:bg-pink-100 hover:border-pink-400 transition-all hover:shadow-md"
                >
                  <FaInstagram className="text-2xl text-pink-600 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold text-gray-700">Instagram</span>
                </a>

                {/* TikTok */}
                <a
                  href="https://www.tiktok.com/@mon_nho_unigo"
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-3 px-5 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl hover:bg-gray-100 hover:border-gray-500 transition-all hover:shadow-md"
                >
                  <FaTiktok className="text-2xl text-gray-800 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold text-gray-700">TikTok</span>
                </a>

                {/* Shopee */}
                <a
                  href="https://vn.shp.ee/qZ7pkfa4"
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-3 px-5 py-3 bg-orange-50 border-2 border-orange-300 rounded-xl hover:bg-orange-100 hover:border-orange-400 transition-all hover:shadow-md"
                >
                  <SiShopee className="text-2xl text-orange-600 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold text-gray-700">Shopee</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CÂU CHUYỆN THÀNH LẬP ─────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 items-center">
          {/* Quote callout */}
          <div className="flex-1 fade-up">
            <div className="bg-brand-cream rounded-3xl p-10 border-l-8 border-brand-purple shadow-sm">
              <p className="font-serif text-2xl md:text-3xl text-brand-dark leading-relaxed font-medium mb-6">
                "Không cần quá lớn lao, chỉ cần đúng lúc và đúng người — một Món Nhỏ thôi cũng đủ tạo nên kỷ niệm."
              </p>
              <span className="text-sm font-semibold text-brand-purple/70 uppercase tracking-widest">
                — Thông điệp thương hiệu
              </span>
            </div>
          </div>

          {/* Story text */}
          <div className="flex-1 fade-up">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-dark mb-6">
              Tại sao lại là Món Nhỏ?
            </h2>
            <p className="text-gray-600 leading-relaxed mb-5 text-lg">
              Chúng tôi bắt đầu từ một niềm đam mê đơn giản: tìm những chiếc vòng tay giá rẻ nhưng vẫn có 
              ý nghĩa và cá tính. Những sản phẩm đẹp thường quá đắt, còn những chiếc vòng đơn giản lại 
              thiếu câu chuyện. Vì vậy, Món Nhỏ ra đời.
            </p>
            <p className="text-gray-600 leading-relaxed mb-5 text-lg">
              Vì vậy, Món Nhỏ ra đời — để biến những khoảnh khắc bình thường thành kỷ niệm đáng nhớ.
              Một chiếc vòng tặng bạn thân nhân sinh nhật, một sợi dây trao cho người yêu vào ngày đặc biệt,
              hay chỉ đơn giản là <em>"Tao nghĩ đến mày"</em> thể hiện qua một món nhỏ xinh trên cổ tay.
            </p>
            <p className="text-gray-600 leading-relaxed text-lg">
              Không đơn thuần là một chiếc vòng tay — mỗi sản phẩm của Món Nhỏ đều mang một câu chuyện,
              một cảm xúc hoặc một lời nhắn gửi dành cho người nhận.
            </p>
          </div>
        </div>
      </section>

      {/* ── TẦM NHÌN & SỨ MỆNH ───────────────────────────── */}
      <section className="py-20 px-6 bg-gradient-to-b from-purple-50 to-brand-cream">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 fade-up">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-dark">
              Định hướng & Sứ mệnh
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Tầm nhìn */}
            <div className="fade-up bg-white rounded-3xl p-10 shadow-sm border border-brand-pink/20 hover:shadow-md transition-all">
              <div className="text-4xl mb-5">🎯</div>
              <h3 className="font-bold text-xl text-brand-dark mb-4">Tầm nhìn</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Xây dựng Món Nhỏ trở thành thương hiệu quà tặng handmade dành cho giới trẻ Việt Nam
                với hình ảnh <strong>gần gũi, tinh tế và giàu cảm xúc</strong>.
              </p>
            </div>
            {/* Sứ mệnh */}
            <div className="fade-up bg-white rounded-3xl p-10 shadow-sm border border-brand-pink/20 hover:shadow-md transition-all">
              <div className="text-4xl mb-5">💫</div>
              <h3 className="font-bold text-xl text-brand-dark mb-4">Sứ mệnh</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Mang đến những sản phẩm handmade chất lượng với giá thành hợp lý, giúp khách hàng
                dễ dàng <strong>trao gửi cảm xúc</strong> thông qua những món quà nhỏ nhưng ý nghĩa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── GIÁ TRỊ CỐT LÕI ──────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 fade-up">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-dark mb-4">
              Giá trị cốt lõi
            </h2>
            <p className="text-gray-500 text-lg">Những điều chúng tôi cam kết với mỗi khách hàng</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CORE_VALUES.map((v, i) => (
              <div
                key={i}
                className="fade-up text-center bg-brand-cream rounded-2xl p-8 border border-brand-pink/20 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <div className="text-5xl mb-4">{v.icon}</div>
                <h3 className="font-bold text-brand-dark text-lg mb-3">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── KHÁCH HÀNG MỤC TIÊU ──────────────────────────── */}
      <section className="py-20 px-6 bg-gradient-to-b from-brand-cream to-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 fade-up">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-dark mb-4">
              Dành cho ai?
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Món Nhỏ được tạo ra cho những người trẻ yêu cái đẹp, thích trao gửi cảm xúc qua những điều giản dị.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 fade-up">
            <div className="bg-white rounded-2xl p-7 shadow-sm border border-brand-pink/20 text-center">
              <div className="text-3xl mb-3">🎓</div>
              <h4 className="font-bold text-brand-dark mb-2">Học sinh & Sinh viên</h4>
              <p className="text-gray-500 text-sm">16 – 25 tuổi, ngân sách hợp lý, thích sản phẩm có ý nghĩa</p>
            </div>
            <div className="bg-white rounded-2xl p-7 shadow-sm border border-brand-pink/20 text-center">
              <div className="text-3xl mb-3">🎁</div>
              <h4 className="font-bold text-brand-dark mb-2">Người muốn tặng quà</h4>
              <p className="text-gray-500 text-sm">Tìm kiếm món quà nhỏ có ý nghĩa cho bạn bè, người thân, người yêu</p>
            </div>
            <div className="bg-white rounded-2xl p-7 shadow-sm border border-brand-pink/20 text-center">
              <div className="text-3xl mb-3">✨</div>
              <h4 className="font-bold text-brand-dark mb-2">Người yêu handmade</h4>
              <p className="text-gray-500 text-sm">Trân trọng sản phẩm thủ công, thẩm mỹ tự nhiên và câu chuyện đằng sau từng món đồ</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── ĐỊNH HƯỚNG PHÁT TRIỂN ────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 fade-up">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-dark mb-4">
              Hành trình chúng mình cùng nhau
            </h2>
            <p className="text-gray-500 text-lg">Từng bước nhỏ để tạo nên một thương hiệu đầy cảm xúc</p>
          </div>
          <div className="flex flex-col md:flex-row gap-6">
            {PHASES.map((p, i) => (
              <div
                key={i}
                className={`fade-up flex-1 rounded-2xl p-8 ${p.color}`}
              >
                <div className="text-4xl mb-4">{p.icon}</div>
                <h3 className="font-bold text-xl mb-3 font-serif">{p.title}</h3>
                <p className="text-sm leading-relaxed opacity-90">{p.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-gradient-to-br from-brand-purple to-brand-dark text-white text-center">
        <div className="max-w-2xl mx-auto fade-up">
          <p className="font-serif text-2xl md:text-3xl font-bold mb-4 leading-relaxed">
            "Mỗi chiếc vòng là một Món Nhỏ — nhưng cảm xúc nó mang lại thì không hề nhỏ."
          </p>
          <p className="text-white/70 mb-10 text-lg">
            monnho.com &nbsp;|&nbsp; TikTok & Shopee: Món Nhỏ
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="bg-white text-brand-purple font-bold px-8 py-4 rounded-full hover:bg-brand-cream transition-colors shadow-lg"
            >
              Xem sản phẩm ngay
            </Link>
            <a
              href="https://zalo.me/0346450546"
              target="_blank"
              rel="noreferrer"
              className="border-2 border-white text-white font-bold px-8 py-4 rounded-full hover:bg-white/10 transition-colors"
            >
              Liên hệ tư vấn Zalo
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

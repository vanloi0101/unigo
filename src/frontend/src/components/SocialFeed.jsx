import React from 'react';

export default function SocialFeed() {
  return (
    <section className="py-16 bg-gradient-to-br from-white to-brand-light">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-brand-dark">Theo Dõi Chúng Tôi</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Cập nhật những xu hướng mới, review sản phẩm, và những khoảnh khắc đặc biệt từ Món Nhỏ Handmade
        </p>

        {/* Social Media Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* TikTok Column */}
          <div className="flex flex-col">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">TikTok</h3>
            <div className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300 backdrop-blur-sm bg-white/80 border border-white/20">
              <iframe
                src="https://www.tiktok.com/embed/v2"
                width="100%"
                height="600"
                frameBorder="0"
                allowFullScreen
                className="w-full"
              ></iframe>
              {/* Placeholder khi iframe không tải */}
              <div className="w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-lg">
                <div className="text-center">
                  <p className="text-gray-600 font-semibold">📱 TikTok @MonnhoHandmade</p>
                  <p className="text-gray-500 text-sm mt-2">Nhảy vào để xem video mới nhất</p>
                </div>
              </div>
            </div>
          </div>

          {/* Facebook Column */}
          <div className="flex flex-col">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Facebook</h3>
            <div className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300 backdrop-blur-sm bg-white/80 border border-white/20">
              <iframe
                src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FMonnhoHandmade&tabs=timeline&width=500&height=600&small_header=false&adapt_container_width=true&hide_cover=true&show_facepile=true&appId="
                width="100%"
                height="600"
                frameBorder="0"
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                className="w-full"
              ></iframe>
              {/* Placeholder khi iframe không tải */}
              <div className="w-full h-96 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center rounded-lg">
                <div className="text-center">
                  <p className="text-blue-600 font-semibold">f Món Nhỏ Handmade</p>
                  <p className="text-blue-500 text-sm mt-2">Theo dõi trang Facebook của chúng tôi</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Bạn có thích vòng tay của Món Nhỏ không?</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a
              href="https://www.tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition font-semibold"
            >
              Follow TikTok
            </a>
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition font-semibold"
            >
              Like Facebook
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

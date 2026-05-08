import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import logoImg from '../assets/logo_unigo.png';

const FALLBACK = {
  title: 'Món Nhỏ không chỉ\nlà vòng tay.',
  paragraphs: [
    'Chúng tôi bắt đầu từ những ngày còn là sinh viên, khi việc tìm một chiếc vòng tay giá rẻ nhưng vẫn có ý nghĩa và cá tính không hề dễ. Những sản phẩm đẹp thường quá đắt, còn những chiếc vòng đơn giản lại thiếu câu chuyện.',
    'Vì vậy, Món Nhỏ ra đời – những chiếc vòng tay handmade mang phong cách trẻ trung, dành cho học sinh và sinh viên, với mức giá phù hợp nhưng vẫn đủ tinh tế để làm người nhận cảm động.',
    'Không đơn thuần là một chiếc vòng tay, mỗi sản phẩm của Món Nhỏ đều đại diện cho một câu chuyện, một cảm xúc hoặc một lời nhắn gửi dành cho người nhận.',
    '"Không cần quá lớn lao, chỉ cần đúng lúc và đúng người — một Món Nhỏ thôi cũng đủ tạo nên kỷ niệm."',
  ],
  thumbnail: null,
};

export default function About() {
  const [story, setStory] = useState(null);

  useEffect(() => {
    axiosClient.get('/posts/brand-story')
      .then((res) => {
        const post = res?.data || res?.post || res;
        if (post?.title) setStory(post);
      })
      .catch(() => {
        // dùng fallback, không cần log lỗi
      });
  }, []);

  // Chia content thành các đoạn theo dòng trống
  const paragraphs = story?.content
    ? story.content.split(/\n\s*\n/).filter(Boolean)
    : FALLBACK.paragraphs;

  const title = story?.title || FALLBACK.title;
  const thumbnail = story?.thumbnail || FALLBACK.thumbnail;

  return (
    <section id="about" className="py-24 px-6 bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center gap-16">
        {/* Ảnh */}
        <div className="flex-1 relative fade-up">
          <div className="absolute -inset-4 bg-brand-pink/20 rounded-[3rem] transform -rotate-3"></div>
          <img
            src={thumbnail || logoImg}
            alt="Câu chuyện thương hiệu Món Nhỏ"
            className="relative rounded-[2.5rem] shadow-xl w-full object-contain aspect-square bg-[#FFF8F5] p-6"
          />
        </div>

        {/* Nội dung */}
        <div className="flex-1 fade-up">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-brand-dark mb-6 whitespace-pre-line">
            {title}
          </h2>
          {paragraphs.map((para, i) =>
            i === paragraphs.length - 1 ? (
              <p key={i} className="text-lg font-semibold text-brand-purple mt-8 mb-0 leading-relaxed border-l-4 border-brand-purple pl-4">
                {para.trim()}
              </p>
            ) : (
              <p key={i} className="text-lg text-gray-600 mb-6 leading-relaxed">
                {para.trim()}
              </p>
            )
          )}
        </div>
      </div>
    </section>
  );
}

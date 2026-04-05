import React from 'react';
import { FaArrowUp, FaCommentDots } from 'react-icons/fa';

export default function FloatingAction() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      <button onClick={scrollTop} className="w-12 h-12 bg-white text-brand-dark rounded-full shadow-lg border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-all" aria-label="Lên đầu trang">
        <FaArrowUp />
      </button>
      <a href="https://zalo.me/0346450546" target="_blank" rel="noreferrer" className="w-12 h-12 bg-[#0068FF] text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform animate-bounce" aria-label="Chat Zalo">
        <FaCommentDots />
      </a>
    </div>
  );
}

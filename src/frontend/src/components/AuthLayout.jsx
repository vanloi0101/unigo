import React from 'react';
import { Link } from 'react-router-dom';
import { FaGem } from 'react-icons/fa';

/**
 * AuthLayout — shared shell for Login and Register pages.
 * Provides: brand-cream background, back link, logo header, and centred max-w-md container.
 *
 * Props:
 *   title      — main h1 text (Playfair, text-brand-dark)
 *   subtitle   — small line below h1
 *   children   — form content
 */
export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-brand-cream flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Back to home */}
      <div className="absolute top-6 left-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-brand-purple hover:text-brand-dark transition-colors font-medium text-sm"
        >
          ← Trang chủ
        </Link>
      </div>

      <div className="w-full max-w-md">
        {/* Logo + Title */}
        <div className="mb-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-serif font-bold text-2xl text-brand-purple mb-8 hover:text-brand-dark transition-colors"
          >
            <FaGem className="text-brand-pink text-xl" /> Món Nhỏ
          </Link>
          <h1 className="font-serif text-4xl font-bold text-brand-dark">{title}</h1>
          {subtitle && (
            <p className="mt-2 text-brand-purple/70 text-sm">{subtitle}</p>
          )}
        </div>

        {/* Form card */}
        <div className="bg-white py-8 px-6 shadow-sm rounded-2xl border border-brand-pink/20">
          {children}
        </div>
      </div>
    </div>
  );
}

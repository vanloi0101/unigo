import React from 'react';

/**
 * Logo chữ M cách điệu dạng ribbon 100% giống thiết kế mới trong ảnh
 */
export default function BraceletLogo({ size = 48, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Món Nhỏ Logo"
    >
      {/* Đường nét màu đen làm viền ngoài cho chữ M */}
      <path
        d="M 25 88 C 20 55, 23 20, 42 20 C 53 20, 56 48, 50 63 C 44 75, 38 63, 44 48 C 50 33, 53 20, 64 20 C 81 20, 78 55, 75 88"
        stroke="#000000"
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Đường nét màu trắng bên trong tạo hiệu ứng ribbon rỗng giống hệt ảnh */}
      <path
        d="M 25 88 C 20 55, 23 20, 42 20 C 53 20, 56 48, 50 63 C 44 75, 38 63, 44 48 C 50 33, 53 20, 64 20 C 81 20, 78 55, 75 88"
        stroke="#FFFFFF"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

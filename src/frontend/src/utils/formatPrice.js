/**
 * Format số thành định dạng tiền Việt Nam Đồng
 * Ví dụ: 120000 -> "120.000 ₫"
 */
export const formatPrice = (price) => {
  if (!price && price !== 0) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

/**
 * Format số với dấu chấm ngăn cách hàng nghìn
 * Ví dụ: 120000 -> "120.000"
 */
export const formatNumber = (number) => {
  if (!number && number !== 0) return '0';
  return new Intl.NumberFormat('vi-VN').format(number);
};

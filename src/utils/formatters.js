/**
 * Capitalize the first letter of a string - Hàm viết hoa chữ cái đầu tiên
 */
export const capitalizeFirstLetter = (val) => {
  if (!val) return ''
  return `${val.charAt(0).toUpperCase()}${val.slice(1)}`
}

/*
        * Cách xử lí bug trong thư viên dnd-kit khi column rổng:
         * Phía FE sẽ tạo ra một card đặc biệt, Placeholder Card, không liên quan đên backend
         * Card đặc biệt này sẽ được ẩn ở giao diện người dùng
         * Cấu trúc của Card này là unique đơn giản, không cần phải random
         * "columnId-placeholder-card (Mỗi column chỉ có  tối đa một placeholderCard)"
         * phải đảm bảo đầy đủ: _id, boardId, columnId, FE_PlaceholderCard
        */

export const generatePlaceholderCard = (column) => {
  return {
    _id: `${column._id}-placeholder-card`,
    boardId: column.boardId,
    columnId: column._id,
    FE_PlaceholderCard: true
  }
}

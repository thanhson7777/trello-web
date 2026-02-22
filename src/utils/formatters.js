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

// Kỹ thuật dùng css pointer-event để chặn user spam click tại bất kỳ chỗ nào có hành động click gọi api
export const interceptorLoadingElements = (calling) => {
  // DOM lấy ra toàn bộ phần tử trên page hiện tại có className là 'interceptor-loading'
  const elements = document.querySelectorAll('.interceptor-loading')
  for (let i = 0; i < elements.length; i++) {
    if (calling) {
      // Nếu đang trong thời gian chờ gọi API (calling === true) thì sẽ làm mờ phần tử và chặn click bằng css pointer-events
      elements[i].style.opacity = '0.5'
      elements[i].style.pointerEvents = 'none'
    } else {
      // Ngược lại thì trả về như ban đầu, không làm gì cả
      elements[i].style.opacity = 'initial'
      elements[i].style.pointerEvents = 'initial'
    }
  }
}

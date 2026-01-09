import axios from 'axios'
import { API_ROOT } from '~/utils/constants'

// Trong các function này sẽ không cần try-catch để bắt lỗi vì ở phía front end không cần thiết phải bắt lỗi quá nhiều sẽ gây dư thừa code, sẽ catch lỗi tập trung tại Interceptors của axios
// Boards
export const fetchBoardDetailsAPI = async (boardId) => {
  const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
  // Lưu ý: axios trả về kết quả qua property của nó là data
  return response.data
}

// Columns
export const createNewColumnAPI = async (newColumnData) => {
  const response = await axios.post(`${API_ROOT}/v1/columns`, newColumnData)
  return response.data
}

// Cards
export const createNewCardAPI = async (newCardData) => {
  const response = await axios.post(`${API_ROOT}/v1/cards`, newCardData)
  return response.data
}

import axios from 'axios'
import { API_ROOT } from '~/utils/constants'


// Trong các function này sẽ không cần try-catch để bắt lỗi vì ở phía front end không cần thiết phải bắt lỗi quá nhiều sẽ gây dư thừa code, sẽ catch lỗi tập trung tại Interceptors của axios
export const fetchBoardDetailsAPI = async (boardId) => {
  const response = await axios.get(`${API_ROOT}/v1/board/${boardId}`)
  // Lưu ý: axios trả về kết quả qua property của nó là data
  return response.data
}
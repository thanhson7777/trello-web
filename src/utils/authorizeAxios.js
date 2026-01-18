import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from '~/utils/formatters'

// Khởi tạo đối tượng Axios (authorizeAxiosInstance) để custom và cấu hình chung của dự án
const authorizeAxiosInstance = axios.create()
// Thời gian chờ tối đa của 1 request là 10p
authorizeAxiosInstance.defaults.timeout = 1000 * 60 * 10
// withCredentials: Tự động gửi cookie trong mỗi request lên backend (lưu JWT token )
authorizeAxiosInstance.defaults.withCredentials = true

// Cấu hình interceptors
// Interceptors request là can thiện vào những request API
authorizeAxiosInstance.interceptors.request.use((config) => {
  // Dùng kỹ thuât chặn spam click
  interceptorLoadingElements(true)
  return config
}, function (error) {
  return Promise.reject(error)
})

// Interceptors request là can thiện vào những respone nhận về
authorizeAxiosInstance.interceptors.response.use((response) => {
  // Dùng kỹ thuât chặn spam click
  interceptorLoadingElements(false)
  return response
}, (error) => {
  // error là những status code ngoài phạm vi từ 200 đên 299
  // Dùng kỹ thuât chặn spam click
  interceptorLoadingElements(false)
  // Xử lí lỗi tập trung một lần trả về từ API
  // console.log('🚀 ~ error:', error)
  let errorMessage = error?.message
  if (error.response?.data?.message) {
    errorMessage = error.response?.data?.message
  }
  // Dùng toastify để hiển thị tất cả các lỗi (trừ mã 410)

  if (error.response?.status !== 410) {
    toast.error(errorMessage)
  }

  return Promise.reject(error)
})

export default authorizeAxiosInstance

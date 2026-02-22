import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from '~/utils/formatters'
import { refreshTokenAPI } from '~/apis'
import { logoutUserAPI } from '~/redux/user/userSlice'

// Không thể import { store } from '~/redux/store bởi vì nó không phải là components của react
// Phải dùng kĩ thuật injectStore

let axiosReduxStore

export const injectStore = mainStore => { axiosReduxStore = mainStore }

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

// Khởi tạo promise cho việc gọi API refresh_token
let refreshTokenPromise = null


// Interceptors respone là can thiện vào những respone nhận về
authorizeAxiosInstance.interceptors.response.use((response) => {
  // Dùng kỹ thuât chặn spam click
  interceptorLoadingElements(false)
  return response
}, (error) => {
  // error là những status code ngoài phạm vi từ 200 đên 299
  // Dùng kỹ thuât chặn spam click
  interceptorLoadingElements(false)

  // Xử lý refresh token tự đọng
  // Nếu nhận lỗi 401 từ backend, thì gọi api đăng xuất
  if (error.response?.status === 401) {
    axiosReduxStore.dispatch(logoutUserAPI(false))
  }

  // Nếu nhận lỗi 410 từ backend, gọi api refresh token để làm mới lại access token
  // Lấy các request api đang bị lỗi thông qua error.config
  const originalRequests = error.config
  // console.log('🚀 ~ originalRequests:', originalRequests)

  if (error.response?.status === 410 && !originalRequests._retry) {
    originalRequests._retry = true

    // Nếu chưa có refreshTokenPromise thì gọi api refresh_token và gán vào refreshTokenPromise
    if (!refreshTokenPromise) {
      refreshTokenPromise = refreshTokenAPI()
        .then(data => {
          // accessToken đã có trong httpOnly cookie
          return data?.accessToken
        })
        .catch((_error) => {
          // Nếu api refreshToken bị lỗi thì cho logout
          axiosReduxStore.dispatch(logoutUserAPI(false))
          return Promise.reject(_error)
        })
        .finally(() => {
          // Gán refreshTokenPromise về null như lúc đầu
          refreshTokenPromise = null
        })
    }

    // eslint-disable-next-line no-unused-vars
    return refreshTokenPromise.then(accessToken => {
      // Gọi lại api ban đầu bị lỗi
      return authorizeAxiosInstance(originalRequests)
    })
  }
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

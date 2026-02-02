import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authorizeAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'
import { mapOrder } from '~/utils/sorts'
import { isEmpty } from 'lodash'
import { generatePlaceholderCard } from '~/utils/formatters'

// Khởi tạo giá trị state của một slice trong redux
const initialState = {
  currentActiveBoard: null
}

// Các hành động gọi api (bất đồng bộ) và cập nhật dữ liệu vào redux, dùng Middleware create asyncThunk đi kèm với extraReducers
export const fetchBoardDetailsAPI = createAsyncThunk(
  'activeBoard/fetchBoardDetailsAPI',
  async (boardId) => {
    const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/boards/${boardId}`)
    // Lưu ý: axios trả về kết quả qua property của nó là data
    return response.data
  }
)

// Tạo slice trong kho lưu trữ - redux Store
export const activeBoardSlice = createSlice({
  name: 'activeBoard',
  initialState,
  // Reducers là nơi xử lí dữ liệu đồng bộ
  reducers: {
    updateActiveCurrentBoard: (state, action) => {
      // action.payload là chuẩn đặt tên nhận dữ liệu vào reducer
      const board = action.payload

      // Xử lý dữ liệu (nếu cần)

      // update lại dữ liệu của currentActiveBoard
      state.currentActiveBoard = board
    },
    UpdateCardInBoard: (state, action) => {
      // Update nested data
      const incommingCard = action.payload

      // Tìm từ Board -> Column -> Card
      const column = state.currentActiveBoard.columns.find(i => i._id === incommingCard.columnId)
      if (column) {
        const card = column.cards.find(i => i._id === incommingCard._id)
        if (card) {
          // card.title = incommingCard.title
          // card['title'] = incommingCard['title']

          // Lấy toàn bộ key của incommingCard, Object.keys trả về mảng, xong mình dùng forEach để lặp qua các key và cập nhật vào trong card
          Object.keys(incommingCard).forEach(key => {
            card[key] = incommingCard[key]
          })
        }
      }
    }
  },

  // Nơi xử lí các dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(fetchBoardDetailsAPI.fulfilled, (state, action) => {
      // action.payload là respone.data trả về ở hàm function fetchBoardDetailsAPI
      let board = action.payload

      // Thành viên trong board sẽ được gộp từ 2 mảng (owners, members)
      board.FE_allUsers = board.owners.concat(board.members)

      // Xử lý dữ liệu (nếu cần)
      // Sắp xếp dữ liệu  thứ tự các colum trước khi đưa xuống bên dưới
      board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')

      board.columns.forEach(column => {
        // Cần xử lí vấn đề column rỗng thì không thẻ kéo card vào được
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        } else {
          // Sắp xếp dữ liệu  thứ tự các card trước khi đưa xuống bên dưới
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
        }
      })

      // update lại dữ liệu của currentActiveBoard
      state.currentActiveBoard = board
    })
  }
})

// action là nơi cho các components bên dưới gọi bằng dispatch() tới để cập nhật lại dữ liệu thông qua reducer (đồng bộ)
// action này được tạo tự động theo tên của reducer
export const { updateActiveCurrentBoard, UpdateCardInBoard } = activeBoardSlice.actions

// Selector là nơi dành cho các components bên dưới gọi bằng hook useSelector() để lấy dữ liệu trong kho redux store ra sử dụng
export const selectCurrentActiveBoard = (state) => {
  return state.activeBoard.currentActiveBoard
}

// Cần export Reducer, nhưng tên file hiện tại là activeBoardSlice
// export default activeBoardSlice.reducer
export const activeBoardReducer = activeBoardSlice.reducer

import { createSlice } from '@reduxjs/toolkit'

// Khởi tạo một giá trị  của slice trong redux
const initialState = {
  currentActiveCard: null,
  isShowModalActiveCard: false
}

// Khởi tạo một slice trong kho lưu trữ (redux store)
export const activeCardSlice = createSlice({
  name: 'activeCard',
  initialState,

  // Nơi xử lí dữ liệu đồng bộ
  reducers: {
    showModalActiveCard: (state) => {
      state.isShowModalActiveCard = true
    },

    clearAndHideCurrentActiveCard: (state) => {
      state.currentActiveCard = null
      state.isShowModalActiveCard = false
    },

    updateCurrentActiveCard: (state, action) => {
      const fullCard = action.payload // action.payload là chuẩn đặt tên nhận dữ liệu vào reducer
      //

      state.currentActiveCard = fullCard
    }
  },
  // Xử lí dữ liệu bất đồng bộ
  // eslint-disable-next-line no-unused-vars
  extraReducers: (builder) => { }
})

export const {
  clearAndHideCurrentActiveCard,
  updateCurrentActiveCard,
  showModalActiveCard
} = activeCardSlice.actions

export const selectCurrentActiveCard = (state) => {
  return state.activeCard.currentActiveCard
}

export const selectIShowModalActiveCard = (state) => {
  return state.activeCard.isShowModalActiveCard
}

export const activeCardReducer = activeCardSlice.reducer

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authorizeAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

const initialState = {
  currentNotifications: null
}

// Các hành động bất đồng bộ (gọi api)
export const fetchInvatationsAPI = createAsyncThunk(
  'notifications/fetchInvatationsAPI',
  async () => {
    const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/invitations`)
    return response.data
  }
)

export const updateBoardInvatationsAPI = createAsyncThunk(
  'notifications/updateBoardInvatationsAPI',
  async ({ status, invitationId }) => {
    const response = await authorizeAxiosInstance.put(`${API_ROOT}/v1/invatations/board/${invitationId}`, { status })
    return response.data
  }
)

// Khởi tạo một slice trong kho lưu trữ
export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,

  // Nơi xử lí dữ liệu đồng bộ
  reducers: {
    clearCurrentNotifications: (state) => {
      state.currentNotifications = null
    },
    updateCurrentNotifications: (state, action) => {
      state.currentNotifications = action.payload
    },
    addNotification: (state, action) => {
      const incomingInvitation = action.payload
      state.currentNotifications.unshift(incomingInvitation)
    }
  },

  // Nơi xử lí dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(fetchInvatationsAPI.fulfilled, (state, action) => {
      let incomingInvitations = action.payload

      // Xử lí để hiển thị thông báo mới nhất lên đầu
      state.currentNotifications = Array.isArray(incomingInvitations) ? incomingInvitations.reverse() : []
    })
    builder.addCase(updateBoardInvatationsAPI.fulfilled, (state, action) => {
      const incomingInvitation = action.payload

      // Cập nhật lại  status của boardInvitation
      const getInvitation = state.currentNotifications.find(i => i._id === incomingInvitation._id)
      getInvitation.boardInvitation = incomingInvitation.boardInvitation
    })
  }
})

export const {
  clearCurrentNotifications,
  updateCurrentNotifications,
  addNotification
} = notificationsSlice.actions

export const selectCurrentNotifications = (state) => {
  return state.notifications.currentNotifications
}

export const notificationReducer = notificationsSlice.reducer

import { configureStore } from '@reduxjs/toolkit'
import { activeBoardReducer } from './activeBoard/activeBoardSlice'
import { userReducer } from './user/userSlice'

import { combineReducers } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { activeCardReducer } from './acitveCard/activeCardSlice'
import { notificationReducer } from './notifications/notificationsSlice'

// Cấu hình redux persist
const rootPersistConfig = {
  key: 'root', // key của persist do chúng ta chỉ định
  storage: storage, // lưu vào localstorage
  whitelist: ['user'] // định các slice dữ liệu được phép duy trì qua mỗi lần f5 trình duyệt
  // blacklist: ['user'] // định các slice dữ liệu không được phép duy trì qua mỗi lần f5 trình duyệt
}

// Combine các reducers
const reducers = combineReducers({
  activeBoard: activeBoardReducer,
  user: userReducer,
  activeCard: activeCardReducer,
  notifications: notificationReducer
})

// Thực hiện persits reducers
const persistedReducers = persistReducer(rootPersistConfig, reducers)

export const store = configureStore({
  reducer: persistedReducers,
  // fix warning error khi xảy ra không tương thích giữa 2 thư viện redux-toolkit và redux-persist
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
})

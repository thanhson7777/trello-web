import Board from '~/pages/Boards/_id'
import { Routes, Route, Navigate } from 'react-router-dom'
import NotFound from '~/pages/404/NotFound'
import Auth from '~/pages/Auth/Auth'
import AccountVerifycation from '~/pages/Auth/AccountVerifycation'
function App() {

  return (
    <Routes>
      {/* Redirect route */}
      <Route path='/' element={
        // replace là thay thế '/' thành "boards/695cdc644d31db131a8fd200"
        <Navigate to="boards/695cdc644d31db131a8fd200" replace={true} />
      } />

      {/* Board detail */}
      <Route path='/boards/:boardId' element={<Board />} />

      {/* Authentication */}
      <Route path='/login' element={<Auth />} />
      <Route path='/register' element={<Auth />} />
      <Route path='/account/verifycation' element={<AccountVerifycation />} />

      {/* 404 not found page */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App

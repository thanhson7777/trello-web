import { useEffect, useState } from 'react'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import Container from '@mui/material/Container'
// import { mockData } from '~/apis/mock-data'
import { fetchBoardDetailsAPI } from '~/apis'

function Board() {
  const [board, setBoard] = useState(null)
  useEffect(() => {
    // fix cứng
    const boardId = '695cdc644d31db131a8fd200'
    // Gọi api
    fetchBoardDetailsAPI(boardId).then(board => {
      setBoard(board)
    })
  }, [])

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      {/* '?' (optional chaining) là kiểm trong key đã có trong object     chưa. Nếu chưa có sẽ trả về undefine còn nếu không dùng  (optional chaining) thì khi không tồn tại key đó thì trang web sẽ sinh ra bug về tran web bị chết*/}
      <BoardBar board={board} />
      <BoardContent board={board} />
    </Container>
  )
}

export default Board

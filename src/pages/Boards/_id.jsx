import { useEffect, useState } from 'react'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import Container from '@mui/material/Container'
// import { mockData } from '~/apis/mock-data'
import { fetchBoardDetailsAPI, createNewColumnAPI, createNewCardAPI, updateBoardDetailsAPI } from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatters'
import { isEmpty } from 'lodash'

function Board() {
  const [board, setBoard] = useState(null)
  useEffect(() => {
    // fix cứng
    const boardId = '695cdc644d31db131a8fd200'
    // Gọi api
    fetchBoardDetailsAPI(boardId).then(board => {
      // Cần xử lí vấn đề column rỗng thì không thẻ kéo card vào được
      board.columns.forEach(column => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        }
      })

      setBoard(board)
    })
  }, [])

  // Gọi API mới column và làm lại dữ liệu State board
  const createNewColumn = async (newColumnData) => {
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })

    // Xử lí khi column mới tạo không thể kéo card vào
    createdColumn.cards = [generatePlaceholderCard(createdColumn)]
    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id]

    // Cập nhật Sate board
    const newBoard = { ...board }
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)
    setBoard(newBoard)
  }

  // Gọi API mới card và làm lại dữ liệu State board
  const createNewCard = async (newCardData) => {
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id
    })

    // Cập nhật Sate board
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === createdCard.columnId)
    if (columnToUpdate) {
      columnToUpdate.cards.push(createdCard)
      columnToUpdate.cardOrderIds.push(createdCard._id)
    }
    setBoard(newBoard)
  }

  // Gọi API và xử lí khi hoàn thành kéo thả column
  const moveColumns = async (dndOrderedColumn) => {
    // Cập nhật lại dữ liệu cho chuẩn state Board
    const dndOrderedColumnIds = dndOrderedColumn.map(c => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumn
    newBoard.columnOrderIds = dndOrderedColumnIds
    setBoard(newBoard)

    // Gọi API update Board
    await updateBoardDetailsAPI(newBoard._id, { columnOrderIds: dndOrderedColumnIds })
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      {/* '?' (optional chaining) là kiểm trong key đã có trong object     chưa. Nếu chưa có sẽ trả về undefine còn nếu không dùng  (optional chaining) thì khi không tồn tại key đó thì trang web sẽ sinh ra bug về tran web bị chết*/}
      <BoardBar board={board} />
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        moveColumns={moveColumns}
      />
    </Container>
  )
}

export default Board

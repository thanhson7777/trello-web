import { useEffect } from 'react'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import Container from '@mui/material/Container'
// import { mockData } from '~/apis/mock-data'
import {
  fetchBoardDetailsAPI,
  updateActiveCurrentBoard,
  selectCurrentActiveBoard
} from '~/redux/activeBoard/activeBoardSlice'

import {
  updateBoardDetailsAPI,
  updateColumnDetailsAPI,
  moveCardToDifferentColumnAPI
} from '~/apis'
import { cloneDeep } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import ActiveCard from '~/components/Modal/ActiveCard/ActiveCard'
import { selectCurrentActiveCard } from '~/redux/acitveCard/activeCardSlice'

function Board() {
  const dispatch = useDispatch()
  // Bỏ State của component, dùng State của Redux
  // const [board, setBoard] = useState(null)
  const board = useSelector(selectCurrentActiveBoard)
  const activeCard = useSelector(selectCurrentActiveCard)

  const { boardId } = useParams()

  useEffect(() => {
    // Gọi api
    dispatch(fetchBoardDetailsAPI(boardId))
  }, [dispatch, boardId])

  // Gọi API và xử lí khi hoàn thành kéo thả column
  const moveColumns = (dndOrderedColumn) => {
    // Cập nhật lại dữ liệu cho chuẩn state Board
    const dndOrderedColumnIds = dndOrderedColumn.map(c => c._id)
    // Trường hợp di chuyển column thì vẫn dùng spread operator được, vì ở đây không dùng push (thay đổi trực tiếp mảng) mà chỉ gán lại giá trị column và columnOrderIds thông qua 2 mảng mới
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumn
    newBoard.columnOrderIds = dndOrderedColumnIds
    // setBoard(newBoard)
    dispatch(updateActiveCurrentBoard(newBoard))

    // Gọi API update Board
    updateBoardDetailsAPI(newBoard._id, { columnOrderIds: dndOrderedColumnIds })
  }

  // Khi di chuyển card trong cùng column, gọi API để cập nhật mảng columnOrderIds của Column chứa card đó (Sắp xếp lại vị trí của mảng)
  const moveCardInTheSameColumn = (dndOrderedCards, dndOrderedCardIds, columnId) => {
    // Cập nhật lại dữ liệu cho chuẩn state Board
    // const newBoard = { ...board }
    const newBoard = cloneDeep(board)
    const columnToUpdate = newBoard.columns.find(column => column._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardIds
    }
    // setBoard(newBoard)
    dispatch(updateActiveCurrentBoard(newBoard))

    // Gọi API update column
    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardIds })
  }

  const moveCardToDifferentColumn = (currentCardId, prevColumnId, nextColumnId, dndOrderedColumn) => {
    // Cập nhật lại dữ liệu cho chuẩn state Board
    const dndOrderedColumnIds = dndOrderedColumn.map(c => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumn
    newBoard.columnOrderIds = dndOrderedColumnIds
    // setBoard(newBoard)
    dispatch(updateActiveCurrentBoard(newBoard))

    // Gọi API xử lí phía backend
    let prevCardOrderIds = dndOrderedColumn.find(c => c._id === prevColumnId)?.cardOrderIds
    // Xử lí vấn đề khi kéo card cuối cùng ra khỏi column (lúc này trong column chỉ còn 1 placeholder-card thì phải xóa nó đi trước khi gửi dữ liệu cho backend, nếu không sẽ bị lỗi)
    // console.log('prevCardOrderIds: ', prevCardOrderIds)
    if (prevCardOrderIds[0].includes('placeholder-card')) prevCardOrderIds = []
    // console.log('prevCardOrderIds: ', prevCardOrderIds)
    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumn.find(c => c._id === nextColumnId)?.cardOrderIds
    })
  }


  if (!board) {
    return <PageLoadingSpinner caption="Loading Board..." />
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      {/* Modal card, check đóng, mở dựa theo điều kiện có tồn tại data activeCard lưu trong redux. Tại một thời điểm chỉ có 1 Modal Card đang được active */}
      {activeCard && <ActiveCard />}
      {/* <ActiveCard /> */}

      {/* Các thành phần của board detail */}
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}

        // createNewCard={createNewCard}
        // deleteColumnDetails={deleteColumnDetails}

        moveColumns={moveColumns}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
      />
    </Container>
  )
}

export default Board

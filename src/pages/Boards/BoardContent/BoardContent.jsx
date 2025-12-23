import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'

import {
  DndContext,
  // PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useEffect, useState } from 'react'
import { cloneDeep } from 'lodash'

const ACTIVE_DRAG_ITEM_STYLE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_STYLE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_STYLE_CARD'
}

function BoardContent({ board }) {
  // const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  // Yêu cầu khi di chuột 10px mới kích hoạt evert, fix trường hợp click khi bị gọi event
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })
  // Nhấn giữ 250ms và dungg sai cảm ứng 500px thì kích hoạt event
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } })

  // const sensors = useSensors(pointerSensor)
  // ưu tiên sử dụng kết hợp 2 loại sensor mouse cho cho pc và touch cho mobile để có trả nghiệm tốt nhất cho người dùng, tránh bug không đáng có
  const sensors = useSensors(mouseSensor, touchSensor)
  const [orderedColumn, setOrderedColumn] = useState([])

  // Tại một thời điểm chỉ có 1 phần tử đang được kéo (column hoặc card)
  const [activeDragItemId, setactiveDragItemId] = useState([])
  const [activeDragItemType, setactiveDragItemType] = useState([])
  const [activeDragItemData, setactiveDragItemData] = useState([])

  useEffect(() => {
    setOrderedColumn(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])
  // Tìm column theo card
  const findColumnByCardId = (cardId) => {
    // Dùng c.card thay vì vì c.cardOrderIds bởi vì ở bước handleDragOver chúng ta sẽ làm dữ liệu hoàn chỉnh cho card trước rồi mới tạo ra cardOrderIds
    return orderedColumn.find(column => column?.cards?.map(card => card._id)?.includes(cardId))
  }

  // Trigger khi bắt đầu kéo thả (drag) phần tử
  const handleDragStart = (event) => {
    // console.log('handleDragStart: ', event)
    setactiveDragItemId(event?.active?.id)
    setactiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_STYLE.CARD :
      ACTIVE_DRAG_ITEM_STYLE.COLUMN)
    setactiveDragItemData(event?.active?.data?.current)
  }

  // Trigger trong quá trình kéo (drag) một phần tử
  const handleDragOver = (event) => {
    // không làm gì nếu kéo column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_STYLE.COLUMN) return
    // còn card thì xử lí kéo thêm để có thể kéo qua lại giữa các column
    // console.log('handleDragOver: ', event)
    const { active, over } = event

    // Cần đảm bảo nếu không tồn tại active hoặc over (khi kéo ra khỏi phạm vi contaner) thì không làm gì để tránh crash trang web
    if (!active || !over) return

    // activeDraggingCardId là card đang được kéo thả
    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
    // overCardId là card đang được tương tác với card phía trên (trên hoặc dưới)
    const { id: overCardId } = over

    // Tìm 2 column theo card
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    // console.log('activeColumn: ', activeColumn)
    // console.log('overColumn: ', overColumn)

    // Nếu không tồn tại 1 trong 2 column thì không làm gì cả, để tránh bị crash trang web
    if (!activeColumn || !overColumn) return

    // Xử lí logic ở đây  chỉ khi kéo qua 2 column khác nhau, còn nếu như kéo trong 1 column thì không làm gì cả
    // Đoạn này đang xử lí việc kéo qua (handleDragOver), còn xử lí xong xuôi hết tất cả và cập nhật là thì đó là việc của (handleDragEnd)
    if (activeColumn._id !== overColumn._id) {
      // console.log('Thuc hien code o day')
      setOrderedColumn(prevColumns => {
        // Tìm vị trí của cái overCard trong column đích (nơi mà activeCard sắp được thả xuống)
        const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)
        // console.log('overCardIndex: ', overCardIndex)

        // Logic tính toán của CardIndex mới (trên hoặc dưới) lấy chuẩn từ code của thư viện (??????)
        let newCardIndex
        const isBelowOverItem = active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height
        const modifier = isBelowOverItem ? 1 : 0
        newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1

        // console.log('isBelowOverItem', isBelowOverItem)
        // console.log('modifier', modifier)
        // console.log('newCardIndex', newCardIndex)

        // Clone mảng orderedColumnState cũ ra một cái mới để xử lí data rồi return - cập nhật lại orderedColumnState mới
        // const nextColumns = [...prevColumns] // nên dùng cách dưới
        const nextColumns = cloneDeep(prevColumns)
        const nextActiveColumn = nextColumns.find(column => column._id === activeColumn._id)
        const nextOverColumn = nextColumns.find(column => column._id === overColumn._id)

        // Column cũ
        if (nextActiveColumn) {
          // Xóa card ở active column (tức là khi kéo card ra khỏi column cũ thì card ở column cũ sẽ xóa đi, để nó cập nhật ở column khác)
          nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)
          // Cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
          nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
        }

        // Column mới
        if (nextOverColumn) {
          // Kiểm tra xem card ở column cũ đã tồn tại ở column overColumn chưa, nếu có rồi thì xóa nó trước
          nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)
          // Thêm card đang kéo vào theo vị trí mới của overColumn
          nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, activeDraggingCardData)
          // Cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
          nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
        }
        // console.log('nextColumns: ', nextColumns)

        return nextColumns
      })
    }
  }

  // console.log('activeDragItemId: ', activeDragItemId)
  // console.log('activeDragItemType: ', activeDragItemType)
  // console.log('activeDragItemData: ', activeDragItemData)

  // Trigger khi kết thúc kéo thả (drop) phần tử
  const handleDragEnd = (event) => {
    // console.log('handleDragEnd: ', event)

    if (activeDragItemType === ACTIVE_DRAG_ITEM_STYLE.CARD) {
      // console.log('Hanh dong keo tha card - Khong lam gi ca')
      return
    }

    const { active, over } = event
    // Cần đảm bảo nếu không tồn tại active hoặc over (khi kéo ra khỏi phạm vi contaner) thì không làm gì để tránh crash trang web
    if (!active || !over) return
    // Nếu vị trí cũ khác với vị trí ban đầu  thì thực hiện
    if (active.id !== over.id) {
      // Lấy vị trí cũ từ thằng active
      const oldIndex = orderedColumn.findIndex(c => c._id === active.id)
      // Lấy vị trí mới từ thằng over
      const newIndex = orderedColumn.findIndex(c => c._id === over.id)

      // Dùng arrayMove của thằng dnd-kit để sắp sắp lại mảng Column ban đầu
      const dndOrderedColumn = arrayMove(orderedColumn, oldIndex, newIndex)
      // 2 console.log này là để sau này gọi API
      // const dndOrderedColumnIds = dndOrderedColumn.map(c => c._id)
      // console.log('dndOrderedColumn: ', dndOrderedColumn)
      // console.log('dndOrderedColumnIds: ', dndOrderedColumnIds)

      // Cập nhật state column ban đầu sau khi đã kéo thả
      setOrderedColumn(dndOrderedColumn)
    }

    setactiveDragItemId(null)
    setactiveDragItemType(null)
    setactiveDragItemData(null)
  }

  // Animation khi thả (drop) phần tử
  const customdropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } })
  }

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <Box sx={{
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        width: '100%',
        height: (theme) => theme.trello.boarContentHeight,
        p: '10px 0'
      }}>
        <ListColumns columns={orderedColumn} />
        <DragOverlay dropAnimation={customdropAnimation}>
          {!activeDragItemType && null}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_STYLE.COLUMN) && <Column column={activeDragItemData} />}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_STYLE.CARD) && <Card card={activeDragItemData} />}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
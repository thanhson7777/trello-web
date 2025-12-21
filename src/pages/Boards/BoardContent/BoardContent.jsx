import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'

import {
  DndContext,
  // PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable';
import { useEffect, useState } from 'react'

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
  useEffect(() => {
    setOrderedColumn(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])
  const handleDragEnd = (event) => {
    // console.log('handleDragEnd: ', event)
    const { active, over } = event
    // Kiểm tra nếu không tồn tại over (vị trí kéo thả không phù hợp hoặc kéo thả linh tinh thì return luôn để tránh lỗi)
    if (!over) return
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
  }
  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
      <Box sx={{
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        width: '100%',
        height: (theme) => theme.trello.boarContentHeight,
        p: '10px 0'
      }}>
        <ListColumns columns={orderedColumn} />
      </Box>
    </DndContext>
  )
}

export default BoardContent
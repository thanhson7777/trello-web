import { useState } from 'react'
import { toast } from 'react-toastify'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Column from './Column/Column'
import Button from '@mui/material/Button'
import CloseIcon from '@mui/icons-material/Close'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { createNewColumnAPI } from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatters'
import { cloneDeep } from 'lodash'
import {
  updateActiveCurrentBoard,
  selectCurrentActiveBoard
} from '~/redux/activeBoard/activeBoardSlice'
import { useDispatch, useSelector } from 'react-redux'


function ListColumns({ columns }) {
  const board = useSelector(selectCurrentActiveBoard)
  const dispatch = useDispatch()

  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
  const toggleOpenNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm)

  const [newColumnTitle, setNewColumnTitle] = useState('')
  const addNewColumn = async () => {
    if (!newColumnTitle) {
      toast.error('Please enter column title')
      return
    }
    // console.log(newColumnTitle)

    // Tạo dữ liệu column để gọi API
    const newColumnData = {
      title: newColumnTitle
    }

    // Gọi API mới column và làm lại dữ liệu State board
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })

    // Xử lí khi column mới tạo không thể kéo card vào
    createdColumn.cards = [generatePlaceholderCard(createdColumn)]
    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id]

    // LỖI: object is not extensible, dù đã coppy/clone ra giá trị newBoard nhưng bản chất của spread operator shallow coppy/clone, nên gặp rules Immutability trong Redux Toolkit không được dùng hàm push (sửa giá trị trực tiếp của mảng), nên phải dùng deep coppy/clone
    // Cập nhật Sate board
    // CÁCH 1
    const newBoard = cloneDeep(board)
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)

    // CÁCH 2: dùng array.concat, concat ghép các mảng lại và tạo ra một mảng mới dùng để gán giá trị lại
    // const newBoard = { ...board }
    // newBoard.columns = newBoard.columns.concat([createdColumn])
    // newBoard.columnOrderIds = newBoard.columnOrderIds.concat([createdColumn._id])

    // Cập nhật dữ liệu vào trong Redux Store
    dispatch(updateActiveCurrentBoard(newBoard))

    // Đóng trạng thái thêm column mới và clear input
    toggleOpenNewColumnForm()
    setNewColumnTitle('')
  }
  /*
  *SortableContext yêu cầu mảng phải là kiểu dữ liệu nguyên thủy ví dụ như là mảng dạng ['id-1, 'id-2] chứ không phải là dạng mảng object như [{id: 'id-2']
  * Nếu không đúng vẫn có thể kéo thả được, tuy nhiên sẽ không hiện animation
  */
  return (
    <SortableContext items={columns?.map(c => c._id)} strategy={horizontalListSortingStrategy} >
      <Box sx={{
        bgcolor: 'inherit',
        width: '100%',
        height: '100%',
        display: 'flex',
        overflowX: 'auto',
        overflowY: 'hidden',
        '&::-webkit-scrollbar-track': { m: 2 }
      }}>
        {columns?.map(column => <Column
          key={column._id}
          column={column}
        />)}

        {/* Box add new column */}
        {!openNewColumnForm
          ? <Box onClick={toggleOpenNewColumnForm} sx={{
            minWidth: '250px',
            maxWidth: '250px',
            mx: 2,
            borderRadius: '6px',
            height: 'fit-content',
            bgcolor: '#ffffff3d'
          }}>
            <Button startIcon={<NoteAddIcon />}
              sx={{
                color: 'white',
                width: '100%',
                justifyContent: 'flex-start',
                pl: 2.5,
                py: 1
              }}
            >
              Add new column
            </Button>
          </Box>
          : <Box sx={{
            minWidth: '250px',
            maxWidth: '250px',
            mx: 2,
            p: 1,
            borderRadius: '6px',
            height: 'fit-content',
            bgcolor: '#ffffff3d',
            display: 'flex',
            flexDirection: 'column',
            gap: 1
          }}>
            <TextField
              label="Enter column title..."
              type="text"
              size="small"
              variant="outlined"
              autoFocus
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              sx={{
                '& label': { color: 'white' },
                '& input': { color: 'white' },
                '& label.Mui-focused': { color: 'white' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'white' },
                  '&:hover fieldset': { borderColor: 'white' },
                  '&.Mui-focused fieldset': { borderColor: 'white' }
                }
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                className="interceptor-loading"
                onClick={addNewColumn}
                variant="contained" color="success" size="small"
                sx={{
                  boxShadow: 'none',
                  border: '0.5px solid',
                  borderColor: (theme) => theme.palette.success.main,
                  '&:hover': { bgcolor: (theme) => theme.palette.success.main }
                }}
              >Add column</Button>
              <CloseIcon
                fontSize="small"
                sx={{
                  color: 'white',
                  cursor: 'pointer',
                  '&:hover': { color: (theme) => theme.palette.warning.light }
                }}
                onClick={toggleOpenNewColumnForm}
              />
            </Box>
          </Box>
        }

      </Box>
    </SortableContext>
  )
}

export default ListColumns
import Box from '@mui/material/Box'
import Column from './Column/Column'
import Button from '@mui/material/Button'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'


function ListColumns({ columns }) {
  return (
    /*
    *SortableContext yêu cầu mảng phải là kiểu dữ liệu nguyên thủy ví dụ như là mảng dạng ['id-1, 'id-2] chứ không phải là dạng mảng object như [{id: 'id-2']
    * Nếu không đúng vẫn có thể kéo thả được, tuy nhiên sẽ không hiện animation
    */
    <SortableContext items={columns?.map(c => c._id)} strategy={horizontalListSortingStrategy}>
      <Box sx={{
        bgcolor: 'inherit',
        width: '100%',
        height: '100%',
        display: 'flex',
        overflowX: 'auto',
        overflowY: 'hidden',
        '&::-webkit-scrollbar-track': { m: 2 }
      }}>

        {columns?.map(column => <Column key={column._id} column={column} />)}

        <Box sx={{
          minWidth: '200px',
          maxWidth: '200px',
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
      </Box>
    </SortableContext>
  )
}

export default ListColumns
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ContentCut from '@mui/icons-material/ContentCut'
import Cloud from '@mui/icons-material/Cloud'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Tooltip from '@mui/material/Tooltip'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import ContentPasteGoIcon from '@mui/icons-material/ContentPasteGo'
import AddCardIcon from '@mui/icons-material/AddCard'
import Button from '@mui/material/Button'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'

import { useState } from 'react'
import ListCards from './ListCards/ListCards'
import { mapOrder } from '~/utils/sorts'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function Column({ column }) {
  // sort kéo thả
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column._id,
    data: { ...column }
  })

  const dndKitColumnStyles = {
    transform: CSS.Translate.toString(transform),
    transition,
    // Chiều cao luôn phải là 100% vì nếu không để thì sẽ sinh ra bug khi kéo column ngắn qua column dài bị khựng rất khó chịu (), kết hợp với sử dụng listener ở box chứ không phải ở div để đảm bảo rằng mình đi chọn vào bõ để kéo thả (vì trước đó mình đã đặt 100% chiều cao cho column nên phải để lắng nghe sự kiện - listener trong box) để tránh trường hợp người dùng kéo ở ngoài nhưng vẫn ăn kéo trên column đặc biệt là trên mobile
    height: '100%',
    // Làm mờ khi kéo
    opacity: isDragging ? 0.5 : undefined
  }
  // dropdown menu
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)
  // Thuật toán sắp xếp
  const orderedCard = mapOrder(column?.cards, column?.cardOrderIds, '_id')

  const [openNewCardForm, setOpenNewCardForm] = useState(false)
  const toggleOpenNewCardForm = () => setOpenNewCardForm(!openNewCardForm)

  const [newCardTitle, setNewCardTitle] = useState('')
  const addNewCard = () => {
    if (!newCardTitle) {
      // console.error('Please enter Card title')
      return
    }
    // console.log(newCardTitle)
    // Gọi API

    // Đóng trạng thái thêm Card mới và clear input
    toggleOpenNewCardForm()
    setNewCardTitle('')
  }

  return (
    // Phải bọc trong div để tránh lỗi liên quan đến vấn đề chiều cao của hai cột khác chiều cao
    <div ref={setNodeRef} style={dndKitColumnStyles} {...attributes}>
      < Box
        {...listeners}
        sx={{
          minWidth: '300px',
          maxWidth: '300px',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : '#ebecf0'),
          ml: 2,
          borderRadius: '6px',
          height: 'fit-content',
          maxHeight: (theme) => `calc(${theme.trello.boarContentHeight} - ${theme.spacing(5)})`
        }}>

        {/* Box column header */}
        < Box sx={{
          height: (theme) => theme.trello.columnHeaderHeight,
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Typography
            variant='h6'
            sx={{
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '1rem'
            }}>
            {column?.title}
          </Typography>
          <Box>
            <Tooltip title="More option">
              <ExpandMoreIcon
                sx={{ color: 'primary.main', cursor: 'pointer' }}
                id="basic-column-dropdown"
                aria-controls={open ? 'basic-menu-column-dropdown' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              />
            </Tooltip>
            <Menu
              id="basic-menu-column-dropdown"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-column-dropdown'
              }}
            >
              <MenuItem>
                <ListItemIcon><AddCardIcon fontSize="small" /></ListItemIcon>
                <ListItemText>Add new card</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon><ContentCut fontSize="small" /></ListItemIcon>
                <ListItemText>Cut</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon><ContentCopyIcon fontSize="small" /></ListItemIcon>
                <ListItemText>Coppy</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon><ContentPasteGoIcon fontSize="small" /></ListItemIcon>
                <ListItemText>Paste</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem>
                <ListItemIcon><DeleteForeverIcon fontSize="small" /></ListItemIcon>
                <ListItemText>Remove this column</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon><Cloud fontSize="small" /></ListItemIcon>
                <ListItemText>Archive this column</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Box >
        {/* Box column list card */}
        <ListCards cards={orderedCard} />
        {/* Box column footer */}
        < Box sx={{
          height: (theme) => theme.trello.columFooterHeight,
          p: 2
        }}>
          {!openNewCardForm
            ? <Box sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Button startIcon={<AddCardIcon />} onClick={toggleOpenNewCardForm}>Add new card</Button>
              <Tooltip title="Drag to move">
                <DragHandleIcon sx={{ cursor: 'pointer' }} />
              </Tooltip>
            </Box>
            : <Box sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <TextField
                label="Enter card title..."
                type="text"
                size="small"
                variant="outlined"
                autoFocus
                data-no-dnd="true"
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                sx={{
                  '& label': { color: 'text.primary' },
                  '& input': {
                    color: (theme) => theme.palette.primary.main,
                    backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : 'white')
                  },
                  '& label.Mui-focused': { color: (theme) => theme.palette.primary.main },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: (theme) => theme.palette.primary.main },
                    '&:hover fieldset': { borderColor: (theme) => theme.palette.primary.main },
                    '&.Mui-focused fieldset': { borderColor: (theme) => theme.palette.primary.main }
                  },
                  '& .MuiOutlinedInput-input': { borderRadius: 1 }
                }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                  onClick={addNewCard}
                  variant="contained" color="success" size="small"
                  data-no-dnd="true"
                  sx={{
                    boxShadow: 'none',
                    border: '0.5px solid',
                    borderColor: (theme) => theme.palette.success.main,
                    '&:hover': { bgcolor: (theme) => theme.palette.success.main }
                  }}
                >Add</Button>
                <CloseIcon
                  fontSize="small"
                  sx={{
                    color: (theme) => theme.palette.warning.light,
                    cursor: 'pointer'
                  }}
                  onClick={toggleOpenNewCardForm}
                />
              </Box>
            </Box>
          }
        </Box >
      </Box >
    </div>
  )
}

export default Column
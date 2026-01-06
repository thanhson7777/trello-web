import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import AvatarGroup from '@mui/material/AvatarGroup'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { capitalizeFirstLetter } from '~/utils/formatters'

const CHIP_STYLE = {
  color: 'white',
  background: 'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '.MuiSvgIcon-root': {
    color: 'white'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}

function BoardBar({ board }) { //Nhận vào object destructuring đã được truyền vào ở Board dạng prop
  return (
    <Box sx={{
      width: '100%',
      height: (theme) => theme.trello.boardBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      overflowX: 'auto',
      paddingX: 2,
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
      '&::-webkit-scrollbar-track': { m: 2 }
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Tooltip title={board?.description}>
          <Chip
            sx={CHIP_STYLE}
            icon={<DashboardIcon />}
            label={board?.title}
            clickable
          />
        </Tooltip>
        <Chip
          sx={CHIP_STYLE}
          icon={<VpnLockIcon />}
          label={capitalizeFirstLetter(board?.type)}
          clickable
        />
        <Chip
          sx={CHIP_STYLE}
          icon={<AddToDriveIcon />}
          label="Add to Google Drive"
          clickable
        />
        <Chip
          sx={CHIP_STYLE}
          icon={<BoltIcon />}
          label="Automation"
          clickable
        />
        <Chip
          sx={CHIP_STYLE}
          icon={<FilterListIcon />}
          label="Filters"
          clickable
        />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<PersonAddIcon />}
          sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover': { borderColor: 'white' }
          }}
        >
          Invite
        </Button>
        <AvatarGroup
          max={5}
          sx={{
            gap: '10px',
            '& .MuiAvatar-root': {
              width: 34,
              height: 34,
              fontSize: 16,
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              '&:first-of-type': { bgcolor: '#a4b0be' }
            }
          }}
        >
          <Tooltip title="thanhson">
            <Avatar
              alt="son"
              src='https://tse4.mm.bing.net/th/id/OIP.Xwd8n__tBgMlaCd5zTKILgHaCx?pid=Api&P=0&h=220'
            />
          </Tooltip>
          <Tooltip title="thanhson">
            <Avatar
              alt="son"
              src='https://tse4.mm.bing.net/th/id/OIP.Xwd8n__tBgMlaCd5zTKILgHaCx?pid=Api&P=0&h=220'
            />
          </Tooltip>
          <Tooltip title="thanhson">
            <Avatar
              alt="son"
              src='https://tse4.mm.bing.net/th/id/OIP.Xwd8n__tBgMlaCd5zTKILgHaCx?pid=Api&P=0&h=220'
            />
          </Tooltip>
          <Tooltip title="thanhson">
            <Avatar
              alt="son"
              src='https://tse4.mm.bing.net/th/id/OIP.Xwd8n__tBgMlaCd5zTKILgHaCx?pid=Api&P=0&h=220'
            />
          </Tooltip>
          <Tooltip title="thanhson">
            <Avatar
              alt="son"
              src='https://tse4.mm.bing.net/th/id/OIP.Xwd8n__tBgMlaCd5zTKILgHaCx?pid=Api&P=0&h=220'
            />
          </Tooltip>
          <Tooltip title="thanhson">
            <Avatar
              alt="son"
              src='https://tse4.mm.bing.net/th/id/OIP.Xwd8n__tBgMlaCd5zTKILgHaCx?pid=Api&P=0&h=220'
            />
          </Tooltip>
          <Tooltip title="thanhson">
            <Avatar
              alt="son"
              src='https://tse4.mm.bing.net/th/id/OIP.Xwd8n__tBgMlaCd5zTKILgHaCx?pid=Api&P=0&h=220'
            />
          </Tooltip>
          <Tooltip title="thanhson">
            <Avatar
              alt="son"
              src='https://tse4.mm.bing.net/th/id/OIP.Xwd8n__tBgMlaCd5zTKILgHaCx?pid=Api&P=0&h=220'
            />
          </Tooltip>
          <Tooltip title="thanhson">
            <Avatar
              alt="son"
              src='https://tse4.mm.bing.net/th/id/OIP.Xwd8n__tBgMlaCd5zTKILgHaCx?pid=Api&P=0&h=220'
            />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar

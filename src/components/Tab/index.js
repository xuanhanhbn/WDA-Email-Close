import { styled } from '@mui/material/styles'
import MuiTab from '@mui/material/Tab'

export const Tab = styled(MuiTab)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    minWidth: 100
  },
  [theme.breakpoints.down('sm')]: {
    minWidth: 67
  }
}))

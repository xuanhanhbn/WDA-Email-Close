import React from 'react'
import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'

export const ButtonStyled = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

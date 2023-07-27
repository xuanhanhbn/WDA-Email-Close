import React, { memo } from 'react'
import Backdrop from '@mui/material/Backdrop'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Fade from '@mui/material/Fade'
import Button from '@mui/material/Button'
import CardActions from '@mui/material/CardActions'
import Divider from '@mui/material/Divider'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { FormControl, TextField, Typography } from '@mui/material'
import TextareaAutosize from '@mui/base/TextareaAutosize'
import { styled } from '@mui/system'
import InputAdornment from '@mui/material/InputAdornment'

import { Controller, useForm } from 'react-hook-form'
import { inputCustommerRequest } from './constants'

// import { useDispatch, useSelector } from 'react-redux'
// import { customerActions, makeSelectCustomer } from '../../customerSlice'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '40%',
  bgcolor: 'background.paper',
  borderRadius: 1,
  boxShadow: 24
}

const modalStyles = {
  inputFields: {
    marginTop: '20px',
    marginBottom: '15px',
    '.MuiFormControl-root': {
      marginBottom: '20px'
    }
  }
}

const validationSchema = Yup.object().shape({
  fullName: Yup.string().required('Full name is required'),
  email: Yup.string().required('Email is required').email('Email is invalid.'),
  telephone: Yup.string().required('Phone is required'),
  message: Yup.string().required('Message is not valid')
})

const RequestSuport = props => {
  const { title, onOpen, fakeData, onClose, handleSubmitForm, value } = props

  const grey = {
    50: '#f6f8fa',
    100: '#eaeef2',
    200: '#d0d7de',
    300: '#afb8c1',
    400: '#8c959f',
    500: '#6e7781',
    600: '#57606a',
    700: '#424a53',
    800: '#32383f',
    900: '#24292f'
  }

  const StyledTextarea = styled(TextareaAutosize)(
    ({ theme }) => `
    width: 100%;
    font-family: IBM Plex Sans, sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 12px;
    border-radius: 12px;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border: 1px solid rgba(58, 53, 65, 0.22);
  
   
  
    &:focus {
      border-color: #9155FD;
      box-shadow: 0 0 0 2px #9155FD;
    }
  
    // firefox
    &:focus-visible {
      outline: 0;
    }
  `
  )

  // const dispatch = useDispatch()

  const {
    register,
    handleSubmit,
    clearErrors,
    setError,
    control,

    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)
  })

  // const globalData = useSelector(makeSelectCustomer)
  const handleClose = () => onClose()

  const onSubmit = data => {
    // dispatch(customerActions.createCustomer(data))
    console.log(data)
  }

  const renderDefaultFilter = item => {
    if (item.type === 'INPUT') {
      const { field } = item
      const message = errors[field] && errors[field].message

      return (
        <Grid item xs={12} key={item.field}>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => {
              return (
                <>
                  <TextField
                    fullWidth
                    required
                    defaultValue={data}
                    label={item.label}
                    name={item.field}
                    onChange={onChange}
                    value={value}
                    type={item.type}
                  />
                </>
              )
            }}
            name={item.field}
          />

          <Typography style={{ color: 'red', marginTop: 0, marginBottom: 10 }}>{message}</Typography>
        </Grid>
      )
    }
  }

  return (
    <div>
      <Modal
        aria-labelledby='transition-modal-title'
        aria-describedby='transition-modal-description'
        open={onOpen}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500
          }
        }}
      >
        <Fade in={onOpen}>
          <Box sx={style}>
            <Card fullWidth>
              <CardHeader title={title} titleTypographyProps={{ variant: 'h6' }} />
              <Divider sx={{ margin: 0 }} />
              <FormControl style={{ width: '100%' }}>
                <CardContent>
                  <Grid container spacing={5}>
                    <Grid item xs={12}>
                      <Box sx={modalStyles.inputFields}>
                        {inputCustommerRequest.map(item => renderDefaultFilter(item))}
                        <Grid item xs={12}>
                          <Controller
                            control={control}
                            render={({ field: { onChange, value } }) => {
                              return (
                                <>
                                  <StyledTextarea
                                    sx={{ maxHeight: 200 }}
                                    fullWidth
                                    required
                                    multiline
                                    minRows={6}
                                    placeholder={data}
                                    label='Massage'
                                    name='massage'
                                    onChange={onChange}
                                    value={value}
                                    type='input'
                                  />
                                </>
                              )
                            }}
                            name='message'
                          />

                          <Typography style={{ color: 'red', marginTop: 0, marginBottom: 10 }}>
                            {errors.message?.message}
                          </Typography>
                        </Grid>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
                <Divider sx={{ margin: 0 }} />
                <CardActions style={{ justifyContent: 'flex-end' }}>
                  <Button size='large' color='secondary' variant='outlined' onClick={() => handleClose()}>
                    Cancel
                  </Button>
                  <Button
                    size='large'
                    type='submit'
                    sx={{ mr: 2 }}
                    variant='contained'
                    onClick={handleSubmit(onSubmit)}
                  >
                    Submit
                  </Button>
                </CardActions>
              </FormControl>
            </Card>
          </Box>
        </Fade>
      </Modal>
    </div>
  )
}

export default memo(RequestSuport)

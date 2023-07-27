/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import Backdrop from '@mui/material/Backdrop'

import Select from 'react-select'
import CardActions from '@mui/material/CardActions'
import { Input } from 'antd'

import { FormControl, InputAdornment, InputLabel, TextField, TextareaAutosize, Typography } from '@mui/material'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Modal from '@mui/material/Modal'
import Fade from '@mui/material/Fade'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Box from '@mui/material/Box'

import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'

import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { styled } from '@mui/system'

import Creatable from 'react-select/creatable'
import axios from 'axios'
import { useRouter } from 'next/router'
import Loading from 'src/components/Loading'
import { AccountCircle, EmailOutline, MapMarkerOutline, PhoneInTalk } from 'mdi-material-ui'
import { useSnackbar } from 'notistack'
import CustomTable from 'src/components/TableCommon'
import moment from 'moment'

const validationSchema = Yup.object().shape({
  content: Yup.string().required('Message is required')
})

const columns = [
  {
    field: 'index',
    name: 'STT'
  },
  {
    field: 'content',
    name: 'Content Ticket'
  },
  {
    field: 'createdAt',
    name: 'Created At'
  },
  {
    field: 'ticketCategory',
    name: 'Ticket Category'
  },
  {
    field: 'name',
    name: 'Handle Staff'
  },
  {
    field: 'email',
    name: 'Handle Staff Email'
  },
  {
    field: 'status',
    name: 'Status'
  }
]

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
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

const blue = {
  100: '#DAECFF',
  200: '#b6daff',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  900: '#003A75'
}

const StyledTextarea = styled(TextareaAutosize)(
  ({ theme }) => `

  font-family: IBM Plex Sans, sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 12px;
  border-radius: 12px 12px 0 12px;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  box-shadow: 0px 2px 2px ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};

  &:hover {
    border-color: ${blue[400]};
  }

  &:focus {
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[500] : blue[200]};
  }

  // firefox
  &:focus-visible {
    outline: 0;
  }
`
)

const categoryStyles = {
  control: (provided, state) => ({
    ...provided,
    padding: '8px 0'
  })
}

function CreateTicket() {
  const {
    register,
    handleSubmit,
    clearErrors,
    setError,
    setValue,
    control,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)
  })
  const handleClose = () => onClose()
  const router = useRouter()
  const [valueCategory, setValueCategory] = useState({})
  const [dataCustomer, setDataCustomer] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const [dataTicket, setDataTicket] = useState([])
  const [modalReopen, setModalReopen] = useState(false)

  const handleShowSnackbar = (message, variant = 'success') => enqueueSnackbar(message, { variant })

  const test = useRef()
  const valiToken = useRef()
  const { TextArea } = Input

  const onSubmit = data => {
    console.log('click: ')
    handleCloseTicket(data)
  }

  useEffect(() => {
    setTimeout(() => {
      handleGetDataTicket()
    }, 1000)
  }, [])

  useEffect(() => {
    if (router && Object.keys(router?.query).length) {
      test.current = router?.query?.ticketId
      valiToken.current = router?.query?.validationToken
    }
  }, [router.query])

  const handleGetDataTicket = async () => {
    try {
      setIsLoading(true)

      const config = {
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJoYW5obnhAZ21haWwuY29tIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvc2lkIjoiNjE1OWE1ODAtNmUxNC00ZTFmLTA3MTktMDhkYjhjMWI3MjRiIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiQWRtaW4iLCJleHAiOjE2OTEwNTQzMDAsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzA4NDEsaHR0cDovL2xvY2FsaG9zdDo0NDMzNSxodHRwczovL2xvY2FsaG9zdDo3Mjc1O2h0dHA6Ly9sb2NhbGhvc3Q6NTEyMiIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzA4NDEsaHR0cDovL2xvY2FsaG9zdDo0NDMzNSxodHRwczovL2xvY2FsaG9zdDo3Mjc1O2h0dHA6Ly9sb2NhbGhvc3Q6NTEyMiJ9.LcDs_RZxAuzw3fVYj2gxb7KvIOhz7ASIurp1LhMsKPo'
        }
      }

      const res = await axios.get(`https://wdabckd.azurewebsites.net/api/CustomerTicket/${test.current}`, config)

      if (res && res.status === 200) {
        setIsLoading(false)
        setDataTicket([res.data])
      }
    } catch (error) {
      setIsLoading(false)
      console.error('error: ', error)
    }
  }
  const handleOpenModalReopen = () => setModalReopen(true)

  const handleReopenTicket = async data => {
    try {
      setIsLoading(true)

      const newDataRequest = {
        ticketId: test.current,
        validationToken: valiToken.current,
        content: data?.content
      }

      const res = await axios.put(
        `https://wdabckd.azurewebsites.net/api/CustomerTicket/Reopen
      `,
        newDataRequest
      )
      if (res && res.status === 200) {
        setIsLoading(false)
        setModalReopen(false)

        return handleShowSnackbar('Reopen Success')
      }
    } catch (error) {
      setIsLoading(false)

      return handleShowSnackbar('There was an error. Please try again.', 'error')
    }
  }

  const handleCloseTicket = async () => {
    try {
      setIsLoading(true)

      const newDataRequest = {
        ticketId: test.current,
        validationToken: valiToken.current
      }

      const res = await axios.put(
        `https://wdabckd.azurewebsites.net/api/CustomerTicket/Close
      `,
        newDataRequest
      )
      if (res && res.status === 200) {
        setIsLoading(false)

        return handleShowSnackbar('Close Success')
      }
    } catch (error) {
      setIsLoading(false)

      return handleShowSnackbar('There was an error. Please try again.', 'error')
    }
  }

  const dataCategory = [
    {
      categoryId: '1',
      name: 'Technical'
    },
    {
      categoryId: '2',
      name: 'NonTechnical'
    },
    {
      categoryId: '3',
      name: 'Refund'
    },
    {
      categoryId: '4',
      name: 'Exchange'
    }
  ]

  const handleGetOptions = () => {
    const formattedOptions = dataCategory?.map(item => ({
      value: item?.categoryId,
      label: item?.name
    }))

    return formattedOptions
  }

  // Xử lí change Select
  const handleSelectChange = selectedOption => {
    const selectedValue = selectedOption
    setValue('ticketCategory', selectedValue?.label, { shouldValidate: true })
    setValueCategory(selectedValue)
  }

  const parseData = useCallback((item, field, index) => {
    // if (Array.isArray(dataTicket) && dataTicket.length > 0) {
    if (field === 'index') {
      return index + 1
    }

    if (field === 'status') {
      if (item.status === 'Opened') {
        return (
          <div style={{ backgroundColor: 'rgb(244 196 196)', borderRadius: 5, paddingTop: 5, paddingBottom: 5 }}>
            <Typography sx={{ color: 'red', textAlign: 'center' }}>Open</Typography>
          </div>
        )
      }
      if (item.status === 'Pending') {
        return (
          <div style={{ backgroundColor: 'rgb(244 243 196)', borderRadius: 5, paddingTop: 5, paddingBottom: 5 }}>
            <Typography sx={{ color: 'warning.main', textAlign: 'center' }}>Pending</Typography>
          </div>
        )
      }
      if (item.status === 'Processing') {
        return (
          <div style={{ backgroundColor: 'rgb(205 246 215)', borderRadius: 5, paddingTop: 5, paddingBottom: 5 }}>
            <Typography sx={{ color: 'success.main', textAlign: 'center' }}>Processing</Typography>
          </div>
        )
      }
      if (item.status === 'Done') {
        return (
          <div style={{ backgroundColor: 'rgb(205 246 215)', borderRadius: 5, paddingTop: 5, paddingBottom: 5 }}>
            <Typography sx={{ color: 'success.main', textAlign: 'center' }}>Done</Typography>
          </div>
        )
      }
      if (item.status === 'Closed') {
        return (
          <div style={{ backgroundColor: 'rgb(205 246 215)', borderRadius: 5, paddingTop: 5, paddingBottom: 5 }}>
            <Typography sx={{ color: 'success.main', textAlign: 'center' }}>Closed</Typography>
          </div>
        )
      }
    }
    if (field === 'name') {
      return <Typography>{item?.resolver?.fullName}</Typography>
    }
    if (field === 'email') {
      return <Typography>{item?.resolver?.email}</Typography>
    }
    if (field === 'createdAt') {
      const formatDate = moment(item?.createdAt).format('YYYY/MM/DD')

      return <div>{formatDate}</div>
    }

    return item[field]
  }, [])

  return (
    <div
      style={{
        backgroundColor: '#fff',
        borderRadius: '6px',
        boxShadow: '0px 2px 10px 0px rgba(58, 53, 65, 0.1)',
        flex: 1,
        padding: '20px',
        margin: '20px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 18 }}>
        <svg
          width={35}
          height={29}
          version='1.1'
          viewBox='0 0 30 23'
          xmlns='http://www.w3.org/2000/svg'
          xmlnsXlink='http://www.w3.org/1999/xlink'
        >
          <g stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
            <g id='Artboard' transform='translate(-95.000000, -51.000000)'>
              <g id='logo' transform='translate(95.000000, 50.000000)'>
                <path
                  id='Combined-Shape'
                  fill='#9155FD'
                  d='M30,21.3918362 C30,21.7535219 29.9019196,22.1084381 29.7162004,22.4188007 C29.1490236,23.366632 27.9208668,23.6752135 26.9730355,23.1080366 L26.9730355,23.1080366 L23.714971,21.1584295 C23.1114106,20.7972624 22.7419355,20.1455972 22.7419355,19.4422291 L22.7419355,19.4422291 L22.741,12.7425689 L15,17.1774194 L7.258,12.7425689 L7.25806452,19.4422291 C7.25806452,20.1455972 6.88858935,20.7972624 6.28502902,21.1584295 L3.0269645,23.1080366 C2.07913318,23.6752135 0.850976404,23.366632 0.283799571,22.4188007 C0.0980803893,22.1084381 2.0190442e-15,21.7535219 0,21.3918362 L0,3.58469444 L0.00548573643,3.43543209 L0.00548573643,3.43543209 L0,3.5715689 C3.0881846e-16,2.4669994 0.8954305,1.5715689 2,1.5715689 C2.36889529,1.5715689 2.73060353,1.67359571 3.04512412,1.86636639 L15,9.19354839 L26.9548759,1.86636639 C27.2693965,1.67359571 27.6311047,1.5715689 28,1.5715689 C29.1045695,1.5715689 30,2.4669994 30,3.5715689 L30,3.5715689 Z'
                />
                <polygon
                  id='Rectangle'
                  opacity='0.077704'
                  fill='#000'
                  points='0 8.58870968 7.25806452 12.7505183 7.25806452 16.8305646'
                />
                <polygon
                  id='Rectangle'
                  opacity='0.077704'
                  fill='#000'
                  points='0 8.58870968 7.25806452 12.6445567 7.25806452 15.1370162'
                />
                <polygon
                  id='Rectangle'
                  opacity='0.077704'
                  fill='#000'
                  points='22.7419355 8.58870968 30 12.7417372 30 16.9537453'
                  transform='translate(26.370968, 12.771227) scale(-1, 1) translate(-26.370968, -12.771227) '
                />
                <polygon
                  id='Rectangle'
                  opacity='0.077704'
                  fill='#000'
                  points='22.7419355 8.58870968 30 12.6409734 30 15.2601969'
                  transform='translate(26.370968, 11.924453) scale(-1, 1) translate(-26.370968, -11.924453) '
                />
                <path
                  id='Rectangle'
                  fillOpacity='0.15'
                  fill='#FFF'
                  d='M3.04512412,1.86636639 L15,9.19354839 L15,9.19354839 L15,17.1774194 L0,8.58649679 L0,3.5715689 C3.0881846e-16,2.4669994 0.8954305,1.5715689 2,1.5715689 C2.36889529,1.5715689 2.73060353,1.67359571 3.04512412,1.86636639 Z'
                />
                <path
                  id='Rectangle'
                  fillOpacity='0.35'
                  fill='#FFF'
                  transform='translate(22.500000, 8.588710) scale(-1, 1) translate(-22.500000, -8.588710) '
                  d='M18.0451241,1.86636639 L30,9.19354839 L30,9.19354839 L30,17.1774194 L15,8.58649679 L15,3.5715689 C15,2.4669994 15.8954305,1.5715689 17,1.5715689 C17.3688953,1.5715689 17.7306035,1.67359571 18.0451241,1.86636639 Z'
                />
              </g>
            </g>
          </g>
        </svg>

        <h6 style={{ marginLeft: 7, textTransform: 'uppercase', marginBottom: 0, color: 'rgba(58, 53, 65, 0.87)' }}>
          Company Active
        </h6>
      </div>
      <div style={{ marginBottom: 13, textAlign: 'center' }}>
        <h5 style={{ color: 'rgba(58, 53, 65, 0.87)' }}>Welcome to Company Active! 👋🏻</h5>
        <p style={{ color: 'rgba(58, 53, 65, 0.68)' }}>Let us know how we can help you!</p>
      </div>
      <div>
        <CustomTable
          data={dataTicket || []}
          parseFunction={parseData}
          columns={columns}
          isShowPaging
          classNameTable='tblCampaignReport'
        />
      </div>
      <Divider sx={{ margin: 0 }} />
      <CardActions style={{ justifyContent: 'center' }}>
        <Button size='large' type='submit' fullWidth variant='outlined' onClick={() => handleOpenModalReopen()}>
          Reopen Ticket
        </Button>
        <Button size='large' type='submit' fullWidth variant='contained' onClick={() => handleCloseTicket()}>
          Close Ticket
        </Button>
      </CardActions>
      {/* <div>
        <CustomTable
          data={[]}
          parseFunction={parseData}
          columns={columns}
          isShowPaging
          classNameTable='tblCampaignReport'
        />
      </div> */}
      {modalReopen && (
        <div>
          <Modal
            aria-labelledby='transition-modal-title'
            aria-describedby='transition-modal-description'
            open={modalReopen}
            onClose={() => setModalReopen(false)}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
              backdrop: {
                timeout: 500
              }
            }}
          >
            <Fade in={modalReopen}>
              <Box sx={style}>
                <Card fullWidth>
                  <CardHeader title='Reopen' titleTypographyProps={{ variant: 'h6' }} />
                  <Divider sx={{ margin: 0 }} />
                  <form>
                    <FormControl style={{ width: '100%' }}>
                      <CardContent>
                        <Grid container spacing={5}>
                          <Grid item xs={12}>
                            <Box sx={modalStyles.inputFields}>
                              <Grid>
                                <Controller
                                  control={control}
                                  render={({ field: { onChange, value } }) => {
                                    return (
                                      <TextArea
                                        name='content'
                                        value={value}
                                        placeholder='Reply...'
                                        onChange={onChange}
                                        rows={6}
                                        style={{ marginTop: 30, borderRadius: 6 }}
                                      />
                                    )
                                  }}
                                  name='content'
                                />
                                <Typography style={{ color: 'red', marginTop: 0, marginBottom: 10 }}>
                                  {errors?.content?.message}
                                </Typography>
                              </Grid>
                            </Box>
                          </Grid>
                        </Grid>
                      </CardContent>
                      <Divider sx={{ margin: 0 }} />
                      <CardActions style={{ justifyContent: 'flex-end' }}>
                        <Button size='large' color='secondary' variant='outlined' onClick={() => setModalReopen(false)}>
                          Cancel
                        </Button>
                        <Button
                          size='large'
                          type='submit'
                          sx={{ mr: 2 }}
                          variant='contained'
                          onClick={handleSubmit(handleReopenTicket)}
                        >
                          Submit
                        </Button>
                      </CardActions>
                    </FormControl>
                  </form>
                </Card>
              </Box>
            </Fade>
          </Modal>
        </div>
      )}
      <Loading isLoading={isLoading} />
    </div>
  )
}

export default CreateTicket

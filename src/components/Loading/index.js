/* eslint-disable react/prop-types */
import React from 'react'
import { Backdrop, CircularProgress } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 99999999,
    color: '#fff'
  }
}))

const Loading = props => {
  const { isLoading } = props
  const classes = useStyles()

  return (
    <div>
      <Backdrop open={isLoading} className={classes.backdrop}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </div>
  )
}

export default Loading

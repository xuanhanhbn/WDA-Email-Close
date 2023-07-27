import moment from 'moment'

const DisplayRealTime = props => {
  const { time } = props
  let momentDate = moment(time)

  const secondAgo = moment().diff(momentDate, 'seconds')
  const minuteAgo = moment().diff(momentDate, 'minutes')
  const oneHourAgo = moment().diff(momentDate, 'hours')
  const oneDayAgo = moment().diff(momentDate, 'days')
  const oneMonthAgo = moment().diff(momentDate, 'months')
  const isValidDate = moment(time, 'YYYY-MM-DD').isValid()
  let displayTime = ''

  if (secondAgo < 60) {
    displayTime = 'Vừa xong'
  } else if (minuteAgo < 60) {
    displayTime = `${minuteAgo} phút trước`
  } else if (oneHourAgo < 24) {
    displayTime = `${oneHourAgo} giờ trước`
  } else if (oneDayAgo < 31) {
    displayTime = `${oneDayAgo} ngày trước`
  } else if (oneMonthAgo < 2) {
    displayTime = `${oneMonthAgo} tháng trước`
  } else if (isValidDate === false) {
    displayTime = momentDate.format('DD/MM/YYYY')
  } else {
    displayTime = momentDate.format('DD/MM/YYYY')
  }

  return displayTime
}

export default DisplayRealTime

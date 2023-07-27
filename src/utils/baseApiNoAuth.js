import axios from 'axios'

export const BASE_URL = 'https://wdabckd.azurewebsites.net/api'

const api = axios.create({
  baseURL: BASE_URL
})

export default api

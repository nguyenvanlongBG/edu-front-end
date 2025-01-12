import axios from 'axios'
import router from '../../../router'
import localStorageLibrary from '../commons/LocalStorageLibrary'
import { LocalStorageKey } from '@/constants/local-storage-key'

const HEADER_ACCEPT = 'application/json'
const HEADER_CONTENT_TYPE = 'application/json'
const WITH_CREDENTIALS = false
const REQUEST_HEADER = {
  Accept: HEADER_ACCEPT,
  'Content-Type': HEADER_CONTENT_TYPE,
}
const service = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: WITH_CREDENTIALS,
  headers: REQUEST_HEADER,
})
service.interceptors.request.use(
  config => {
    const token = localStorageLibrary.getValueByKey<string>(
      LocalStorageKey.AccessToken,
    )
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token
    }
    return config
  },
  error => {
    return Promise.reject(error)
  },
)
service.interceptors.response.use(
  response => {
    if (response.status) {
      response.data.statusCode = response.status
    }
    return response.data
  },
  error => {
    if (error.response.status == 401) {
      router.push({ name: 'login' })
    }
    if (error.response.status === 500) {
      router.push({
        name: 'Error',
        params: {
          pathMatch: 403,
        },
      })
    }
    let message = error.message
    if (error.response.data) {
      message = error.response.data.message || 'Lỗi'
    }
    console.log(message)
    return Promise.reject(error)
  },
)
export default service

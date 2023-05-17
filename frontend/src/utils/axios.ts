import axios, { AxiosError } from 'axios'

const instance = axios.create({
  withCredentials: true
})

export default instance
export {AxiosError} 
import axios from 'axios'

const baseURL =
  typeof window === 'undefined'
    ? `${process.env.NEXTAUTH_URL}/api/`
    : '/api/'

export const api = axios.create({ baseURL })
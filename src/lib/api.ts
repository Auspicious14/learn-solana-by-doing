import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import toast from 'react-hot-toast'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

class ApiClient {
  private instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.instance.interceptors.response.use(
      (response) => {
        return response.data
      },
      (error) => {
        const message = error.response?.data?.message || 'An error occurred'
        
        if (error.response?.status === 401) {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token')
            window.location.href = '/login'
          }
        }
        
        if (error.response?.status >= 400) {
          toast.error(message)
        }
        
        return Promise.reject(error)
      }
    )
  }

  // Generic request methods
  get(url: string, config?: AxiosRequestConfig) {
    return this.instance.get(url, config)
  }

  post(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.instance.post(url, data, config)
  }

  put(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.instance.put(url, data, config)
  }

  delete(url: string, config?: AxiosRequestConfig) {
    return this.instance.delete(url, config)
  }

  patch(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.instance.patch(url, data, config)
  }
}

export const apiClient = new ApiClient()
export default apiClient

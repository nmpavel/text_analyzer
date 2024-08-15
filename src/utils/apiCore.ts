import axios, { AxiosRequestConfig } from 'axios';

class ApiService {
  private baseUrl: string = 'http://localhost:5000';

  constructor() {}

  async getData(endpoint: string): Promise<any> {
    try {
      const config: AxiosRequestConfig = {
        method: 'GET',
        url: `${this.baseUrl}/${endpoint}`,
      };
      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error('Error fetching data', error);
      throw error;
    }
  }

  async postData(endpoint: string, data: any): Promise<any> {
    try {
      const response = await axios.post(`${this.baseUrl}/${endpoint}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async postProtectedData(endpoint: string, data: any): Promise<any> {
    try {
      const config: AxiosRequestConfig = {
        method: 'POST',
        url: `${this.baseUrl}/${endpoint}`,
        data: data,
        headers: {
          'Authorization': this.authHeader(),
          'Content-Type': 'application/json',
        },
      };
      const response = await axios(config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  private authHeader(): string {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    if (token) {
      return `Bearer ${token}`;
    }
    return '';
  }
}

export default ApiService;

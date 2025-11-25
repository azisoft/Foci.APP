import { Injectable } from '@angular/core';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private client: AxiosInstance;

  constructor() {
    const baseURL = environment.apiBaseUrl;

    this.client = axios.create({
      baseURL,
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000
    });
  }

  async get<T = any>(url: string, params?: Record<string, any>, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.client.get<T>(url, { params, ...config });
    return res.data;
  }

  async post<T = any, B = any>(url: string, body?: B, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.client.post<T>(url, body, config);
    return res.data;
  }

  async put<T = any, B = any>(url: string, body?: B, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.client.put<T>(url, body, config);
    return res.data;
  }

  async patch<T = any, B = any>(url: string, body?: B, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.client.patch<T>(url, body, config);
    return res.data;
  }

  async delete<T = any>(url: string, params?: Record<string, any>, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.client.delete<T>(url, { params, ...config });
    return res.data;
  }
}

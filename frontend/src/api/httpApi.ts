import axios from 'axios';
import type { Api, NewOrder } from './api';
import type {  Origin, Settings, Order, OrderStatus, AuditEntry, Supply, FlightCode  } from '../engine/types';

const client = axios.create({
  baseURL: '/api',
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN'
});

client.interceptors.response.use(
  (res) => res,
  (error) => {
    return Promise.reject(error);
  }
);

export const httpApi: Api = {
  async getOrigins(opts) {
    const res = await client.get<any[]>('/origins', { params: opts });
    return res.data.map(o => ({
      ...o,
      flavor: typeof o.flavor === 'string' ? JSON.parse(o.flavor) : o.flavor
    }));
  },
  async getSettings() {
    const res = await client.get<any>('/settings');
    return JSON.parse(res.data.data);
  },
  async createOrder(o: NewOrder) {
    const res = await client.post<Order>('/orders', o);
    return res.data;
  },
  async getFeedbackTarget(orderId: string, token: string) {
    try {
      const res = await client.get<{blendName:string; flightCodes?:FlightCode[]}>(`/orders/${orderId}/feedback`, { params: { t: token } });
      return res.data;
    } catch (e: any) {
      if (e.response?.status === 404) return null;
      throw e;
    }
  },
  async submitFeedback(orderId, token, f) {
    await client.post(`/orders/${orderId}/feedback`, f, { params: { t: token } });
  },

  // Admin
  async login(username, password) {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    await client.post('/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  },
  async saveOrigins(list) {
    const payload = list.map(o => ({
      ...o,
      flavor: typeof o.flavor === 'object' ? JSON.stringify(o.flavor) : o.flavor
    }));
    await client.put('/admin/origins', payload);
  },
  async saveSettings(s) {
    await client.put('/admin/settings', s);
  },
  async listOrders(page = 0) {
    const res = await client.get<Order[]>('/admin/orders', { params: { page } });
    return res.data;
  },
  async setOrderStatus(id, status) {
    const res = await client.patch<{feedbackToken?:string}>(`/admin/orders/${id}`, { status });
    return res.data;
  },
  async setOrderOutcome(id, outcome) {
    await client.patch(`/admin/orders/${id}`, { outcome });
  },
  async listAudit(page = 0) {
    const res = await client.get<AuditEntry[]>('/admin/audit', { params: { page } });
    return res.data;
  },
  async listSupplies() {
    const res = await client.get<Supply[]>('/admin/supplies');
    return res.data;
  },
  async createSupply(s) {
    const res = await client.post<Supply>('/admin/supplies', s);
    return res.data;
  },
  async markReminded(id) {
    await client.patch(`/admin/supplies/${id}`, { reminded: true });
  }
};

import { http } from './http';
import type { ListParams, ListResponse } from './common';

export type UserRole = 'super_admin' | 'admin' | 'editor' | 'viewer' | 'author';

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  name?: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  permissions?: string[];
  status: 'active' | 'inactive' | 'locked';
  lastLogin?: string;
  createdAt?: string;
}

export const usersApi = {
  list: async (params: ListParams = {}): Promise<ListResponse<AdminUser>> => {
    const { data } = await http.get<ListResponse<AdminUser>>('/api/users', { params });
    return data;
  },
  get: async (id: string) => {
    const { data } = await http.get<AdminUser>(`/api/users/${id}`);
    return data;
  },
  create: async (payload: Partial<AdminUser> & { password?: string }) => {
    const { data } = await http.post<AdminUser>('/api/users', payload);
    return data;
  },
  update: async (id: string, payload: Partial<AdminUser> & { password?: string }) => {
    const { data } = await http.patch<AdminUser>(`/api/users/${id}`, payload);
    return data;
  },
  remove: async (id: string) => {
    await http.delete(`/api/users/${id}`);
  },
};

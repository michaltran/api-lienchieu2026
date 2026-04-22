import { http } from './http';
import type { ListParams, ListResponse } from './common';

export interface DashboardStats {
  counts: {
    posts: number; pages: number; menus: number; banners: number;
    media: number; users: number; categories: number;
    departments: number; doctors: number;
    appointments: number; messages: number;
  };
  posts: { published: number; draft: number };
  appointments: { pending: number };
  messages: { new: number };
  recentPosts: any[];
  recentAppointments: any[];
  recentLogs: any[];
}

export interface ActivityLog {
  id: string;
  action: string;
  entity?: string;
  entityId?: number;
  description?: string;
  ipAddress?: string;
  createdAt: string;
  user?: { id: string; name?: string; username: string; avatar?: string };
}

export const dashboardApi = {
  stats: async (): Promise<DashboardStats> => {
    const { data } = await http.get<DashboardStats>('/api/dashboard/stats');
    return data;
  },
};

export const logsApi = {
  list: async (params: ListParams = {}): Promise<ListResponse<ActivityLog>> => {
    const { data } = await http.get<ListResponse<ActivityLog>>('/api/logs', { params });
    return data;
  },
};

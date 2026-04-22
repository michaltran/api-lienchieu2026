import { http } from './http';
import type { ListParams, ListResponse } from './common';

export interface MediaItem {
  id: string;
  title?: string;
  description?: string;
  type: 'image' | 'video';
  url: string;
  publicId: string;
  thumbnail?: string;
  format?: string;
  size?: number;
  width?: number;
  height?: number;
  duration?: number;
  albumId?: string | null;
  tags?: string[];
  uploadedBy?: string;
  album?: { id: string; name: string; slug: string };
  uploader?: { id: string; name?: string; username: string };
  createdAt?: string;
}

export const mediaApi = {
  list: async (params: ListParams = {}): Promise<ListResponse<MediaItem>> => {
    const { data } = await http.get<ListResponse<MediaItem>>('/api/media', { params });
    return data;
  },
  update: async (id: string, payload: Partial<MediaItem>): Promise<MediaItem> => {
    const { data } = await http.patch<MediaItem>(`/api/media/${id}`, payload);
    return data;
  },
  remove: async (id: string): Promise<void> => {
    await http.delete(`/api/media/${id}`);
  },
  bulkDelete: async (ids: string[]) => {
    const { data } = await http.delete('/api/media/bulk', { data: { ids } });
    return data;
  },
};

export interface Album {
  id: string;
  name: string;
  slug: string;
  description?: string;
  coverImage?: string;
  type: 'image' | 'video' | 'mixed';
  isActive: boolean;
  orderIndex: number;
}

export const albumsApi = {
  list: async (params: ListParams = {}): Promise<ListResponse<Album>> => {
    const { data } = await http.get<ListResponse<Album>>('/api/albums', { params });
    return data;
  },
  get: async (id: string) => {
    const { data } = await http.get<Album>(`/api/albums/${id}`);
    return data;
  },
  create: async (payload: Partial<Album>) => {
    const { data } = await http.post<Album>('/api/albums', payload);
    return data;
  },
  update: async (id: string, payload: Partial<Album>) => {
    const { data } = await http.patch<Album>(`/api/albums/${id}`, payload);
    return data;
  },
  remove: async (id: string) => {
    await http.delete(`/api/albums/${id}`);
  },
};

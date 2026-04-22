import { http } from './http';
import { createCrudApi } from './common';

export type BannerPosition = 'homepage_hero' | 'homepage_middle' | 'sidebar' | 'popup';

export interface Banner {
  id: string;
  title?: string;
  subtitle?: string;
  description?: string;
  image: string;
  imagePublicId?: string;
  mobileImage?: string;
  mobileImagePublicId?: string;
  link?: string;
  buttonText?: string;
  position: BannerPosition;
  orderIndex: number;
  isActive: boolean;
  startDate?: string | null;
  endDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export const bannersApi = {
  ...createCrudApi<Banner>('/api/banners'),

  reorder: async (items: Array<{ id: string; orderIndex: number }>) => {
    const { data } = await http.patch('/api/banners/reorder', { items });
    return data;
  },
};

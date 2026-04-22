import { http } from './http';
import type { ListParams, ListResponse } from './common';
import { createCrudApi } from './common';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  thumbnail?: string;
  thumbnailPublicId?: string;
  parentId?: string | number | null;
  orderIndex: number;
  isActive: boolean;
  seoTitle?: string;
  seoDescription?: string;
  children?: Category[];
  createdAt?: string;
  updatedAt?: string;
}

export const categoriesApi = {
  ...createCrudApi<Category>('/api/categories'),

  tree: async (): Promise<Category[]> => {
    const { data } = await http.get<Category[]>('/api/categories/tree');
    return data;
  },
};

import { http } from './http';

export type MenuPosition = 'header' | 'footer' | 'sidebar';
export type MenuType = 'page' | 'category' | 'external' | 'custom';

export interface MenuItem {
  id: string;
  name: string;
  slug: string;
  url?: string;
  icon?: string;
  parentId?: string | number | null;
  position: MenuPosition;
  type: MenuType;
  targetId?: number | null;
  orderIndex: number;
  openNewTab: boolean;
  isActive: boolean;
  children?: MenuItem[];
  createdAt?: string;
  updatedAt?: string;
}

export const menusApi = {
  tree: async (position?: MenuPosition): Promise<MenuItem[]> => {
    const { data } = await http.get<MenuItem[]>('/api/menus', {
      params: position ? { position } : {},
    });
    return data;
  },

  flat: async (): Promise<MenuItem[]> => {
    const { data } = await http.get<MenuItem[]>('/api/menus/flat');
    return data;
  },

  get: async (id: string): Promise<MenuItem> => {
    const { data } = await http.get<MenuItem>(`/api/menus/${id}`);
    return data;
  },

  create: async (payload: Partial<MenuItem>): Promise<MenuItem> => {
    const { data } = await http.post<MenuItem>('/api/menus', payload);
    return data;
  },

  update: async (id: string, payload: Partial<MenuItem>): Promise<MenuItem> => {
    const { data } = await http.patch<MenuItem>(`/api/menus/${id}`, payload);
    return data;
  },

  remove: async (id: string): Promise<void> => {
    await http.delete(`/api/menus/${id}`);
  },

  reorder: async (items: Array<{ id: string; parentId: string | null; orderIndex: number }>) => {
    const { data } = await http.patch('/api/menus/reorder', { items });
    return data;
  },
};

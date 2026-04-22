import { http } from './http';

export interface ListParams {
  page?: number;
  limit?: number;
  search?: string;
  [key: string]: any;
}

export interface ListResponse<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Generic CRUD factory - dùng cho Menus, Categories, Pages, Banners, Departments, Doctors, Services, Drugs...
 */
export function createCrudApi<T, C = Partial<T>, U = Partial<T>>(basePath: string) {
  return {
    list: async (params: ListParams = {}): Promise<ListResponse<T>> => {
      const { data } = await http.get<ListResponse<T>>(basePath, { params });
      return data;
    },
    get: async (id: string | number): Promise<T> => {
      const { data } = await http.get<T>(`${basePath}/${id}`);
      return data;
    },
    create: async (payload: C): Promise<T> => {
      const { data } = await http.post<T>(basePath, payload);
      return data;
    },
    update: async (id: string | number, payload: U): Promise<T> => {
      const { data } = await http.patch<T>(`${basePath}/${id}`, payload);
      return data;
    },
    remove: async (id: string | number): Promise<void> => {
      await http.delete(`${basePath}/${id}`);
    },
  };
}

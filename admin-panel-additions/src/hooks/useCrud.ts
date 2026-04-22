import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ListParams, ListResponse } from '../lib/api/common';

/**
 * Generic hooks factory cho các resource CRUD
 */
export function createCrudHooks<T>(
  key: string,
  api: {
    list: (params?: ListParams) => Promise<ListResponse<T>>;
    get: (id: string | number) => Promise<T>;
    create: (payload: Partial<T>) => Promise<T>;
    update: (id: string | number, payload: Partial<T>) => Promise<T>;
    remove: (id: string | number) => Promise<void>;
  }
) {
  const useList = (params: ListParams = {}) =>
    useQuery({
      queryKey: [key, 'list', params],
      queryFn: () => api.list(params),
      placeholderData: (prev) => prev,
    });

  const useDetail = (id: string | null | undefined) =>
    useQuery({
      queryKey: [key, 'detail', id],
      queryFn: () => api.get(id!),
      enabled: !!id,
    });

  const useSave = () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (data: Partial<T> & { id?: string | number }) =>
        data.id ? api.update(data.id, data) : api.create(data),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: [key] });
      },
    });
  };

  const useRemove = () => {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (id: string | number) => api.remove(id),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: [key] });
      },
    });
  };

  return { useList, useDetail, useSave, useRemove };
}

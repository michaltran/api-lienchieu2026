import { http } from './http';

export type SettingType = 'text' | 'textarea' | 'number' | 'boolean' | 'json' | 'image' | 'color';

export interface Setting {
  id: string;
  key: string;
  value: string;
  type: SettingType;
  group: string;
  label?: string;
  description?: string;
  orderIndex: number;
}

export type GroupedSettings = Record<string, Setting[]>;

export const settingsApi = {
  listGrouped: async (): Promise<GroupedSettings> => {
    const { data } = await http.get<GroupedSettings>('/api/settings/grouped');
    return data;
  },

  list: async (group?: string): Promise<Setting[]> => {
    const { data } = await http.get<Setting[]>('/api/settings', {
      params: group ? { group } : {},
    });
    return data;
  },

  publicAll: async (): Promise<Record<string, any>> => {
    const { data } = await http.get<Record<string, any>>('/api/settings/public');
    return data;
  },

  updateByKey: async (key: string, value: any): Promise<Setting> => {
    const { data } = await http.put<Setting>(`/api/settings/${key}`, { value });
    return data;
  },

  bulkUpdate: async (items: Array<{ key: string; value: any }>) => {
    const { data } = await http.patch('/api/settings/bulk', { items });
    return data;
  },

  create: async (payload: Partial<Setting>) => {
    const { data } = await http.post<Setting>('/api/settings', payload);
    return data;
  },

  remove: async (key: string) => {
    await http.delete(`/api/settings/${key}`);
  },
};

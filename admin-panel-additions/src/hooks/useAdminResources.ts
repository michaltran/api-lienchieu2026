import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createCrudHooks } from './useCrud';
import { menusApi } from '../lib/api/menus';
import { categoriesApi } from '../lib/api/categories';
import { pagesApi } from '../lib/api/pages';
import { bannersApi } from '../lib/api/banners';
import { mediaApi, albumsApi } from '../lib/api/media';
import { usersApi } from '../lib/api/users';
import { settingsApi } from '../lib/api/settings';
import { departmentsApi, doctorsApi, servicesApi, drugsApi } from '../lib/api/hospital';
import { appointmentsApi, messagesApi } from '../lib/api/appointments';
import { dashboardApi, logsApi } from '../lib/api/dashboard';

// ============ MENUS ============
export function useMenuTree(position?: 'header' | 'footer' | 'sidebar') {
  return useQuery({ queryKey: ['menus', 'tree', position], queryFn: () => menusApi.tree(position) });
}
export function useMenuFlat() {
  return useQuery({ queryKey: ['menus', 'flat'], queryFn: () => menusApi.flat() });
}
export function useMenu(id: string | null) {
  return useQuery({ queryKey: ['menus', id], queryFn: () => menusApi.get(id!), enabled: !!id });
}
export function useSaveMenu() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => (data.id ? menusApi.update(data.id, data) : menusApi.create(data)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['menus'] }),
  });
}
export function useDeleteMenu() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => menusApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['menus'] }),
  });
}
export function useReorderMenus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: menusApi.reorder,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['menus'] }),
  });
}

// ============ CATEGORIES ============
export const {
  useList: useCategories,
  useDetail: useCategory,
  useSave: useSaveCategory,
  useRemove: useDeleteCategory,
} = createCrudHooks('categories', categoriesApi);
export function useCategoryTree() {
  return useQuery({ queryKey: ['categories', 'tree'], queryFn: () => categoriesApi.tree() });
}

// ============ PAGES ============
export const {
  useList: usePages,
  useDetail: usePage,
  useSave: useSavePage,
  useRemove: useDeletePage,
} = createCrudHooks('pages', pagesApi);

// ============ BANNERS ============
export const {
  useList: useBanners,
  useDetail: useBanner,
  useSave: useSaveBanner,
  useRemove: useDeleteBanner,
} = createCrudHooks('banners', bannersApi);
export function useReorderBanners() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: bannersApi.reorder,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['banners'] }),
  });
}

// ============ MEDIA ============
export function useMediaList(params: any = {}) {
  return useQuery({
    queryKey: ['media', params],
    queryFn: () => mediaApi.list(params),
    placeholderData: (prev) => prev,
  });
}
export function useUpdateMedia() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => mediaApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['media'] }),
  });
}
export function useDeleteMedia() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => mediaApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['media'] }),
  });
}
export function useBulkDeleteMedia() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => mediaApi.bulkDelete(ids),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['media'] }),
  });
}

// ============ ALBUMS ============
export function useAlbums(params: any = {}) {
  return useQuery({ queryKey: ['albums', params], queryFn: () => albumsApi.list(params) });
}
export function useAlbum(id: string | null) {
  return useQuery({ queryKey: ['album', id], queryFn: () => albumsApi.get(id!), enabled: !!id });
}
export function useSaveAlbum() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => (data.id ? albumsApi.update(data.id, data) : albumsApi.create(data)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['albums'] }),
  });
}
export function useDeleteAlbum() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => albumsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['albums'] }),
  });
}

// ============ USERS ============
export function useUsers(params: any = {}) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => usersApi.list(params),
    placeholderData: (prev) => prev,
  });
}
export function useSaveUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => (data.id ? usersApi.update(data.id, data) : usersApi.create(data)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
}
export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => usersApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
}

// ============ SETTINGS ============
export function useSettingsGrouped() {
  return useQuery({ queryKey: ['settings', 'grouped'], queryFn: () => settingsApi.listGrouped() });
}
export function useUpdateSetting() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ key, value }: { key: string; value: any }) => settingsApi.updateByKey(key, value),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['settings'] }),
  });
}
export function useBulkUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: settingsApi.bulkUpdate,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['settings'] }),
  });
}

// ============ HOSPITAL ============
export const {
  useList: useDepartments,
  useDetail: useDepartment,
  useSave: useSaveDepartment,
  useRemove: useDeleteDepartment,
} = createCrudHooks('departments', departmentsApi);

export const {
  useList: useDoctors,
  useDetail: useDoctor,
  useSave: useSaveDoctor,
  useRemove: useDeleteDoctor,
} = createCrudHooks('doctors', doctorsApi);

export const {
  useList: useServices,
  useDetail: useService,
  useSave: useSaveService,
  useRemove: useDeleteService,
} = createCrudHooks('services', servicesApi);

export const {
  useList: useDrugs,
  useDetail: useDrug,
  useSave: useSaveDrug,
  useRemove: useDeleteDrug,
} = createCrudHooks('drugs', drugsApi);

// ============ APPOINTMENTS ============
export function useAppointments(params: any = {}) {
  return useQuery({
    queryKey: ['appointments', params],
    queryFn: () => appointmentsApi.list(params),
    placeholderData: (prev) => prev,
  });
}
export function useAppointment(id: string | null) {
  return useQuery({
    queryKey: ['appointment', id],
    queryFn: () => appointmentsApi.get(id!),
    enabled: !!id,
  });
}
export function useUpdateAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => appointmentsApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['appointments'] }),
  });
}
export function useConfirmAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, note }: { id: string; note?: string }) => appointmentsApi.confirm(id, note),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['appointments'] }),
  });
}
export function useCancelAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, note }: { id: string; note?: string }) => appointmentsApi.cancel(id, note),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['appointments'] }),
  });
}
export function useDeleteAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => appointmentsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['appointments'] }),
  });
}

// ============ MESSAGES ============
export function useMessages(params: any = {}) {
  return useQuery({
    queryKey: ['messages', params],
    queryFn: () => messagesApi.list(params),
    placeholderData: (prev) => prev,
  });
}
export function useMessage(id: string | null) {
  return useQuery({
    queryKey: ['message', id],
    queryFn: () => messagesApi.get(id!),
    enabled: !!id,
  });
}
export function useReplyMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reply }: { id: string; reply: string }) => messagesApi.reply(id, reply),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['messages'] }),
  });
}
export function useDeleteMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => messagesApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['messages'] }),
  });
}

// ============ DASHBOARD / LOGS ============
export function useDashboardStats() {
  return useQuery({ queryKey: ['dashboard', 'stats'], queryFn: () => dashboardApi.stats() });
}
export function useActivityLogs(params: any = {}) {
  return useQuery({
    queryKey: ['logs', params],
    queryFn: () => logsApi.list(params),
    placeholderData: (prev) => prev,
  });
}

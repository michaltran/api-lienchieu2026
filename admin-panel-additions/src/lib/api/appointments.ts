import { http } from './http';
import type { ListParams, ListResponse } from './common';

// ========== APPOINTMENTS ==========
export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type Gender = 'male' | 'female' | 'other';

export interface Appointment {
  id: string;
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  patientBirthday?: string;
  patientGender?: Gender;
  patientAddress?: string;
  departmentId?: string | null;
  doctorId?: string | null;
  preferredDate?: string;
  preferredTime?: string;
  symptoms?: string;
  note?: string;
  status: AppointmentStatus;
  adminNote?: string;
  confirmedAt?: string;
  createdAt?: string;
  department?: { id: string; name: string };
  doctor?: { id: string; name: string; title?: string };
  confirmer?: { id: string; name?: string; username: string };
}

export const appointmentsApi = {
  list: async (params: ListParams = {}): Promise<ListResponse<Appointment>> => {
    const { data } = await http.get<ListResponse<Appointment>>('/api/appointments', { params });
    return data;
  },
  get: async (id: string) => {
    const { data } = await http.get<Appointment>(`/api/appointments/${id}`);
    return data;
  },
  update: async (id: string, payload: Partial<Appointment>) => {
    const { data } = await http.patch<Appointment>(`/api/appointments/${id}`, payload);
    return data;
  },
  confirm: async (id: string, adminNote?: string) => {
    const { data } = await http.post<Appointment>(`/api/appointments/${id}/confirm`, { adminNote });
    return data;
  },
  cancel: async (id: string, adminNote?: string) => {
    const { data } = await http.post<Appointment>(`/api/appointments/${id}/cancel`, { adminNote });
    return data;
  },
  remove: async (id: string) => {
    await http.delete(`/api/appointments/${id}`);
  },
};

// ========== MESSAGES ==========
export type MessageStatus = 'new' | 'processing' | 'replied' | 'closed';
export type MessageType = 'mailbox' | 'contact' | 'feedback';

export interface ContactMessage {
  id: string;
  senderName: string;
  senderEmail?: string;
  senderPhone?: string;
  subject?: string;
  message: string;
  attachments?: string[];
  status: MessageStatus;
  adminReply?: string;
  replyAt?: string;
  type: MessageType;
  createdAt?: string;
  replier?: { id: string; name?: string; username: string };
}

export const messagesApi = {
  list: async (params: ListParams = {}): Promise<ListResponse<ContactMessage>> => {
    const { data } = await http.get<ListResponse<ContactMessage>>('/api/messages', { params });
    return data;
  },
  get: async (id: string) => {
    const { data } = await http.get<ContactMessage>(`/api/messages/${id}`);
    return data;
  },
  reply: async (id: string, reply: string) => {
    const { data } = await http.post<ContactMessage>(`/api/messages/${id}/reply`, { reply });
    return data;
  },
  updateStatus: async (id: string, status: MessageStatus) => {
    const { data } = await http.patch<ContactMessage>(`/api/messages/${id}`, { status });
    return data;
  },
  remove: async (id: string) => {
    await http.delete(`/api/messages/${id}`);
  },
};

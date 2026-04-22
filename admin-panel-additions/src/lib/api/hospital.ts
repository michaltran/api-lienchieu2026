import { createCrudApi } from './common';

// ========== DEPARTMENTS ==========
export type DepartmentBlock = 'lam-sang' | 'can-lam-sang' | 'hanh-chinh';
export interface DepartmentLeader { name: string; title: string; }
export interface DepartmentHighlight { title: string; image: string; }
export interface DepartmentInfo {
  phone?: string;
  email?: string;
  workingHours?: string;
  location?: string;
  services?: string[];
}
export interface Department {
  id: string;
  name: string;
  slug: string;
  block: DepartmentBlock;
  leaders?: DepartmentLeader[];
  teamImage?: string;
  teamImagePublicId?: string;
  missionText?: string;
  duties?: string[];
  info?: DepartmentInfo;
  highlights?: DepartmentHighlight[];
  orderIndex: number;
  isActive: boolean;
}
export const departmentsApi = createCrudApi<Department>('/api/departments');

// ========== DOCTORS ==========
export interface Doctor {
  id: string;
  slug: string;
  name: string;
  title?: string;
  specialty?: string;
  specialtyId?: string;
  departmentId?: string | null;
  experienceYears?: number;
  languages?: string[];
  avatar?: string;
  avatarPublicId?: string;
  bio?: string;
  tags?: string[];
  scheduleNote?: string;
  featured?: boolean;
  expertise?: string[];
  experience?: string[];
  education?: string[];
  publications?: string[];
  department?: { id: string; name: string; slug: string; block: string };
}
export const doctorsApi = createCrudApi<Doctor>('/api/doctors');

// ========== SERVICES ==========
export interface Service {
  id: string;
  title: string;
  slug?: string;
  description?: string;
  icon?: string;
  image?: string;
  imagePublicId?: string;
  category?: string;
  orderIndex: number;
  isActive: boolean;
}
export const servicesApi = createCrudApi<Service>('/api/services');

// ========== DRUGS ==========
export interface Drug {
  id: string;
  slug: string;
  name: string;
  activeIngredient?: string;
  dosageForm?: string;
  strength?: string;
  manufacturer?: string;
  country?: string;
  registrationNumber?: string;
  indication?: string;
  contraindication?: string;
  dosage?: string;
  sideEffects?: string;
  interactions?: string;
  storage?: string;
  packing?: string;
  price?: number;
  isBHYT?: boolean;
  category?: string;
  isActive: boolean;
}
export const drugsApi = createCrudApi<Drug>('/api/drugs');

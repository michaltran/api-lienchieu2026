import { createCrudApi } from './common';

export interface Page {
  id: string;
  title: string;
  slug: string;
  content?: string;
  thumbnail?: string;
  thumbnailPublicId?: string;
  template: string;
  metadata?: Record<string, any>;
  status: 'draft' | 'published';
  seoTitle?: string;
  seoDescription?: string;
  orderIndex: number;
  createdAt?: string;
  updatedAt?: string;
}

export const pagesApi = createCrudApi<Page>('/api/pages');

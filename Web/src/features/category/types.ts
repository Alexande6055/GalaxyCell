export interface Category {
  id?: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryListResponse {
  data: Category[];
  total: number;
  page: number;
  lastPage: number;
}

export interface CategoryFormData {
  name: string;
  description: string;
  isActive?: boolean;
}
export interface Client {
  id?: string;
  name: string;
  lastName: string;
  document_number: string;
  phone: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface ClientListResponse {
  data: Client[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
}

export interface ClientFormData {
  name: string;
  lastName: string;
  document_number: string;
  phone: string;
  email: string;
}
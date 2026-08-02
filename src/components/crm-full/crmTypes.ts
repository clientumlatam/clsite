export interface Conversation {
  id: string;
  customer_name?: string;
  customer_phone?: string;
  status: 'activa' | 'derivada' | 'resuelta' | 'cerrada';
  query_type: string;
  channel?: string;
  summary?: string;
  assigned_seller?: string;
  assigned_branch?: string;
  budget_generated?: boolean;
  budget_approved?: boolean;
  visit_date?: string;
  visit_scheduled?: boolean;
  created_date: string;
}

export interface Seller {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  specialty: string;
  branch?: string;
  active: boolean;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  phone?: string;
  schedule?: string;
  city?: string;
  active: boolean;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  price?: number;
  active: boolean;
  category?: string;
  subcategory?: string;
  unit?: string;
}

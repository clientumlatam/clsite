import { Conversation, Seller, Branch, Product } from './crmTypes';
import catalogData from '../../data/servicios-catalogo.json';

export const initialConversations: Conversation[] = [];

export const initialSellers: Seller[] = [
  { id: 's1', name: 'Santiago López',   phone: '+54299411-0001', email: 'slopez@clientum.com.ar',      specialty: 'crm',          branch: 'Casa Central',  active: true },
  { id: 's2', name: 'María Fernández',  phone: '+54299411-0002', email: 'mfernandez@clientum.com.ar',  specialty: 'marketing',    branch: 'Casa Central',  active: true },
  { id: 's3', name: 'Carlos Romero',    phone: '+54299411-0003', email: 'cromero@clientum.com.ar',     specialty: 'ecommerce',    branch: 'Casa Central',  active: true },
  { id: 's4', name: 'Andrea Suárez',    phone: '+54299411-0004', email: 'asuarez@clientum.com.ar',     specialty: 'chatbot',      branch: 'Sucursal CABA', active: true },
  { id: 's5', name: 'Diego Herrera',    phone: '+54299411-0005', email: 'dherrera@clientum.com.ar',    specialty: 'cloud',        branch: 'Remoto',        active: true },
];

export const initialBranches: Branch[] = [
  {
    id: 'b1',
    name: 'Casa Central — General Roca',
    address: 'Av. Roca 1234',
    phone: '+54 298 442-0000',
    schedule: 'Lun–Vie 9:00–18:00 | Sáb 9:00–13:00',
    city: 'General Roca, Río Negro',
    active: true,
  },
  {
    id: 'b2',
    name: 'Sucursal Neuquén',
    address: 'Av. Argentina 567, Piso 3',
    phone: '+54 299 448-0000',
    schedule: 'Lun–Vie 9:00–18:00',
    city: 'Neuquén Capital, Neuquén',
    active: true,
  },
  {
    id: 'b3',
    name: 'Sucursal CABA',
    address: 'Av. Corrientes 1234, Of. 8',
    phone: '+54 11 4321-0000',
    schedule: 'Lun–Vie 10:00–19:00',
    city: 'Buenos Aires, CABA',
    active: true,
  },
];

export const initialProducts: Product[] = (catalogData as Array<{
  id: string;
  name: string;
  cat: string;
  desc?: string;
  price?: string;
}>).map(item => ({
  id: item.id,
  code: item.id,
  name: item.name,
  price: item.price ? parseFloat(item.price) : undefined,
  active: true,
  category: item.cat,
}));

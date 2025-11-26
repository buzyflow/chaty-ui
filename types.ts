export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Message {
  id: string;
  role: 'user' | 'model' | 'system';
  text: string;
  isError?: boolean;
  isLoading?: boolean;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  COMPLETE = 'COMPLETE',
  IDLE = 'IDLE',
}

export interface Order {
  id: string;
  vendorId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  timestamp: number;
}

export interface BusinessDetails {
  openingHours: string;
  address: string;
  contactInfo: string;
  deliveryPolicy: string;
}

export type Currency = 'NGN' | 'USD' | 'EUR' | 'GBP' | 'ZAR' | 'KES';

export interface CurrencyInfo {
  code: Currency;
  symbol: string;
  name: string;
}

export interface BotSettings {
  botName: string;
  avatarColor: string;
  welcomeMessage: string;
  customInstructions: string;
  businessDetails: BusinessDetails;
  currency: Currency;
}

export interface User {
  id: string;
  email: string;
  businessName: string;
  vendorWhatsApp?: string;
  botSettings: BotSettings;
}

export interface Customer {
  id: string;
  phone: string;
  name: string;
  vendorId: string;
  createdAt: number;
  lastActive?: number;
}
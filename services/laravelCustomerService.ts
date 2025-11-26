import laravelClient, { handleApiError } from './laravelClient';
import { Customer } from '../types';
import axios from 'axios';

interface LaravelCustomer {
    id: number;
    vendor_id: number;
    phone: string;
    name: string;
    last_active: string;
    created_at: string;
    updated_at: string;
}

// Convert Laravel customer to app Customer type
const convertLaravelCustomer = (laravelCustomer: LaravelCustomer): Customer => {
    return {
        id: laravelCustomer.id.toString(),
        vendorId: laravelCustomer.vendor_id.toString(),
        phone: laravelCustomer.phone,
        name: laravelCustomer.name,
        lastActive: new Date(laravelCustomer.last_active).getTime(),
        createdAt: new Date(laravelCustomer.created_at).getTime(),
    };
};

export const laravelCustomerService = {
    // Get all customers for vendor
    async getCustomers(vendorId: string): Promise<Customer[]> {
        try {
            const response = await laravelClient.get<LaravelCustomer[]>('/customers');
            return response.data.map(convertLaravelCustomer);
        } catch (error) {
            console.error('Error fetching customers:', error);
            return [];
        }
    },

    // Get customer by phone
    async getCustomer(vendorId: string, phone: string): Promise<Customer | null> {
        try {
            const res = await laravelClient.get<Customer>('/customers/by-phone', {
                params: { phone, vendor_id: vendorId }
            });
            return res.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                return null;
            }
            throw error;
        }
    },

    // Create or update customer
    async createCustomer(vendorId: string, phone: string, name: string): Promise<Customer> {
        try {
            const response = await laravelClient.post<LaravelCustomer>('/customers', {
                phone,
                name,
            });
            return convertLaravelCustomer(response.data);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    // Update last active timestamp
    async updateLastActive(vendorId: string, customerId: string): Promise<void> {
        // Last active is updated automatically on create/update
        // No separate endpoint needed
    },
};

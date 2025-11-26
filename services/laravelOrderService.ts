import laravelClient, { handleApiError } from './laravelClient';
import { Order, OrderStatus, CartItem } from '../types';

interface LaravelOrder {
    id: number;
    vendor_id: number;
    customer_id: number;
    customer_name: string;
    customer_phone: string;
    items: CartItem[];
    total: string;
    status: string;
    order_timestamp: number;
    created_at: string;
    updated_at: string;
}

// Convert Laravel order to app Order type
const convertLaravelOrder = (laravelOrder: LaravelOrder): Order => {
    return {
        id: laravelOrder.id.toString(),
        vendorId: laravelOrder.vendor_id.toString(),
        customerId: laravelOrder.customer_id.toString(),
        customerName: laravelOrder.customer_name,
        customerPhone: laravelOrder.customer_phone,
        items: laravelOrder.items,
        total: parseFloat(laravelOrder.total),
        status: laravelOrder.status as OrderStatus,
        timestamp: laravelOrder.order_timestamp,
    };
};

export const laravelOrderService = {
    // Get all orders for vendor
    async getVendorOrders(vendorId: string): Promise<Order[]> {
        try {
            const response = await laravelClient.get<LaravelOrder[]>('/orders');
            return response.data.map(convertLaravelOrder);
        } catch (error) {
            console.error('Error fetching orders:', error);
            return [];
        }
    },

    // Create new order
    async createOrder(
        vendorId: string,
        customerId: string,
        customerName: string,
        customerPhone: string,
        items: CartItem[],
        total: number
    ): Promise<Order> {
        try {
            const response = await laravelClient.post<LaravelOrder>('/orders', {
                customer_id: parseInt(customerId),
                customer_name: customerName,
                customer_phone: customerPhone,
                items,
                total,
                order_timestamp: Date.now(),
            });

            return convertLaravelOrder(response.data);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    // Update order status
    async updateOrderStatus(vendorId: string, orderId: string, status: OrderStatus): Promise<void> {
        try {
            await laravelClient.put(`/orders/${orderId}`, {
                status,
            });
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },
};

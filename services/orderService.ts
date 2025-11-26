import { db } from './firebase';
import { collection, addDoc, getDocs, doc, updateDoc, query, orderBy, where } from 'firebase/firestore';
import { Order, OrderStatus } from '../types';

export const orderService = {
    // Create a new order
    createOrder: async (order: Omit<Order, 'id'>): Promise<string> => {
        const ordersRef = collection(db, 'users', order.vendorId, 'orders');
        const docRef = await addDoc(ordersRef, order);
        return docRef.id;
    },

    // Get all orders for a vendor
    getVendorOrders: async (vendorId: string): Promise<Order[]> => {
        const ordersRef = collection(db, 'users', vendorId, 'orders');
        const q = query(ordersRef, orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
    },

    // Get orders by status
    getOrdersByStatus: async (vendorId: string, status: OrderStatus): Promise<Order[]> => {
        const ordersRef = collection(db, 'users', vendorId, 'orders');
        const q = query(ordersRef, where('status', '==', status), orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
    },

    // Update order status
    updateOrderStatus: async (vendorId: string, orderId: string, status: OrderStatus): Promise<void> => {
        const orderRef = doc(db, 'users', vendorId, 'orders', orderId);
        await updateDoc(orderRef, { status });
    }
};

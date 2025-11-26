import { db } from './firebase';
import { collection, getDocs, doc, getDoc, setDoc, query, where, orderBy } from 'firebase/firestore';
import { Customer } from '../types';

export const customerService = {
    // Get customer by phone number for a specific vendor
    getCustomer: async (vendorId: string, phoneNumber: string): Promise<Customer | null> => {
        const customersRef = collection(db, 'users', vendorId, 'customers');
        const q = query(customersRef, where('phoneNumber', '==', phoneNumber));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            return { id: doc.id, ...doc.data() } as Customer;
        }
        return null;
    },

    // Create a new customer
    createCustomer: async (vendorId: string, phoneNumber: string, name: string): Promise<Customer> => {
        const customersRef = collection(db, 'users', vendorId, 'customers');
        const customerId = `customer_${Date.now()}`;
        const customerRef = doc(customersRef, customerId);

        const customer: Customer = {
            id: customerId,
            phoneNumber,
            name,
            vendorId,
            createdAt: Date.now(),
            lastActive: Date.now()
        };

        await setDoc(customerRef, customer);
        return customer;
    },

    // Update customer last active timestamp
    updateLastActive: async (vendorId: string, customerId: string): Promise<void> => {
        const customerRef = doc(db, 'users', vendorId, 'customers', customerId);
        await setDoc(customerRef, { lastActive: Date.now() }, { merge: true });
    },

    // Get all customers for a vendor
    getVendorCustomers: async (vendorId: string): Promise<Customer[]> => {
        const customersRef = collection(db, 'users', vendorId, 'customers');
        const q = query(customersRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Customer));
    }
};

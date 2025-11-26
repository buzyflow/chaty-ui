import { db } from './firebase';
import { collection, getDocs, doc, writeBatch, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Product } from '../types';
import { PRODUCT_ITEMS } from '../constants';

export const menuService = {
    // Get products for a specific user
    getProducts: async (userId: string): Promise<Product[]> => {
        const querySnapshot = await getDocs(collection(db, 'users', userId, 'products'));
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    },

    // Seed products for a user if they don't have any
    seedProducts: async (userId: string): Promise<void> => {
        const productsRef = collection(db, 'users', userId, 'products');
        const snapshot = await getDocs(productsRef);

        if (snapshot.empty) {
            const batch = writeBatch(db);
            PRODUCT_ITEMS.forEach(item => {
                const docRef = doc(productsRef, item.id);
                const { id, ...data } = item;
                batch.set(docRef, data);
            });
            await batch.commit();
            console.log('Products seeded for user:', userId);
        }
    },

    // Add a new product
    addProduct: async (userId: string, product: Omit<Product, 'id'>): Promise<string> => {
        const productsRef = collection(db, 'users', userId, 'products');
        const docRef = await addDoc(productsRef, product);
        return docRef.id;
    },

    // Update an existing product
    updateProduct: async (userId: string, productId: string, updates: Partial<Product>): Promise<void> => {
        const productRef = doc(db, 'users', userId, 'products', productId);
        await updateDoc(productRef, updates);
    },

    // Delete a product
    deleteProduct: async (userId: string, productId: string): Promise<void> => {
        const productRef = doc(db, 'users', userId, 'products', productId);
        await deleteDoc(productRef);
    }
};

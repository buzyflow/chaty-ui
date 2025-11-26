import laravelClient, { handleApiError } from './laravelClient';
import { Product } from '../types';

interface LaravelProduct {
    id: number;
    user_id: number;
    name: string;
    description: string;
    price: string;
    currency: string;
    category: string;
    image: string;
    created_at: string;
    updated_at: string;
}

// Convert Laravel product to app Product type
const convertLaravelProduct = (laravelProduct: LaravelProduct): Product => {
    return {
        id: laravelProduct.id.toString(),
        name: laravelProduct.name,
        description: laravelProduct.description,
        price: parseFloat(laravelProduct.price),
        currency: laravelProduct.currency as any,
        category: laravelProduct.category,
        image: laravelProduct.image,
    };
};

export const laravelProductService = {
    // Get all products for authenticated user
    async getProducts(userId: string): Promise<Product[]> {
        try {
            const response = await laravelClient.get<LaravelProduct[]>('/products');
            return response.data.map(convertLaravelProduct);
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    },

    // Seed initial products (if needed)
    async seedProducts(userId: string): Promise<void> {
        // Check if products exist
        const products = await this.getProducts(userId);
        if (products.length > 0) {
            return; // Already seeded
        }

        // No seed endpoint - products will be added manually
        console.log('No products to seed');
    },

    // Add new product
    async addProduct(userId: string, product: Omit<Product, 'id'>): Promise<Product> {
        try {
            const response = await laravelClient.post<LaravelProduct>('/products', {
                name: product.name,
                description: product.description,
                price: product.price,
                currency: product.currency,
                category: product.category,
                image: product.image,
            });

            return convertLaravelProduct(response.data);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    // Update existing product
    async updateProduct(userId: string, productId: string, updates: Partial<Product>): Promise<void> {
        try {
            await laravelClient.put(`/products/${productId}`, {
                name: updates.name,
                description: updates.description,
                price: updates.price,
                currency: updates.currency,
                category: updates.category,
                image: updates.image,
            });
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    // Delete product
    async deleteProduct(userId: string, productId: string): Promise<void> {
        try {
            await laravelClient.delete(`/products/${productId}`);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },
};

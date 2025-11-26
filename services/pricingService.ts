import laravelClient from './laravelClient';

export interface PricingPlan {
    id: number;
    name: string;
    description: string;
    price: string;
    currency: string;
    billing_period: 'monthly' | 'yearly';
    features: Array<{ value: string }>;
    is_featured: boolean;
    max_products: number | null;
    max_orders: number | null;
    max_customers: number | null;
}

export interface PricingPlansResponse {
    success: boolean;
    data: PricingPlan[];
}

export const pricingService = {
    async getPricingPlans(): Promise<PricingPlan[]> {
        try {
            const response = await laravelClient.get<PricingPlansResponse>('/pricing-plans');
            return response.data.data;
        } catch (error) {
            console.error('Error fetching pricing plans:', error);
            throw error;
        }
    },
};

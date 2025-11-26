import laravelClient, { handleApiError } from './laravelClient';
import { User, BotSettings } from '../types';

interface LaravelUser {
    id: number;
    email: string;
    name: string;
    business_name: string;
    vendor_whatsapp?: string;
    bot_name: string;
    avatar_color: string;
    welcome_message?: string;
    custom_instructions?: string;
    currency: string;
    business_details?: {
        opening_hours?: string;
        address?: string;
        contact_info?: string;
        delivery_policy?: string;
    };
    created_at: string;
    updated_at: string;
}

interface AuthResponse {
    user: LaravelUser;
    token: string;
}

// Convert Laravel user to app User type
const convertLaravelUser = (laravelUser: LaravelUser): User => {
    return {
        id: laravelUser.id.toString(),
        email: laravelUser.email,
        businessName: laravelUser.business_name,
        vendorWhatsApp: laravelUser.vendor_whatsapp || '',
        botSettings: {
            botName: laravelUser.bot_name,
            avatarColor: laravelUser.avatar_color as any,
            welcomeMessage: laravelUser.welcome_message || `Welcome to ${laravelUser.business_name}! How can I help you today?`,
            customInstructions: laravelUser.custom_instructions || '',
            businessDetails: {
                openingHours: laravelUser.business_details?.opening_hours || '',
                address: laravelUser.business_details?.address || '',
                contactInfo: laravelUser.business_details?.contact_info || '',
                deliveryPolicy: laravelUser.business_details?.delivery_policy || '',
            },
            currency: laravelUser.currency as any,
        },
    };
};


export const laravelAuthService = {
    // Sign up new user
    async signup(email: string, password: string, businessName: string): Promise<User> {
        try {
            const response = await laravelClient.post<AuthResponse>('/auth/register', {
                email,
                password,
                business_name: businessName,
            });

            const { user, token } = response.data;

            // Store auth token
            localStorage.setItem('laravel_auth_token', token);

            // Convert and store user
            const appUser = convertLaravelUser(user);
            localStorage.setItem('laravel_user', JSON.stringify(appUser));

            return appUser;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    // Login existing user
    async login(email: string, password: string): Promise<User> {
        try {
            const response = await laravelClient.post<AuthResponse>('/auth/login', {
                email,
                password,
            });

            const { user, token } = response.data;

            // Store auth token
            localStorage.setItem('laravel_auth_token', token);

            // Convert and store user
            const appUser = convertLaravelUser(user);
            localStorage.setItem('laravel_user', JSON.stringify(appUser));

            return appUser;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    // Get current user from token
    async getCurrentUser(): Promise<User | null> {
        try {
            // First check localStorage
            const cachedUser = localStorage.getItem('laravel_user');
            const token = localStorage.getItem('laravel_auth_token');

            if (!token) {
                return null;
            }

            if (cachedUser) {
                return JSON.parse(cachedUser);
            }

            // Fetch from API
            const response = await laravelClient.get<{ user: LaravelUser }>('/auth/user');
            const appUser = convertLaravelUser(response.data.user);

            localStorage.setItem('laravel_user', JSON.stringify(appUser));
            return appUser;
        } catch (error) {
            // Token invalid or expired
            localStorage.removeItem('laravel_auth_token');
            localStorage.removeItem('laravel_user');
            return null;
        }
    },

    // Update user settings
    async updateSettings(
        userId: string,
        businessName: string,
        botSettings: BotSettings,
        vendorWhatsApp?: string
    ): Promise<void> {
        try {
            const response = await laravelClient.put<{ user: LaravelUser }>('/auth/user', {
                business_name: businessName,
                vendor_whatsapp: vendorWhatsApp,
                bot_name: botSettings.botName,
                avatar_color: botSettings.avatarColor,
                welcome_message: botSettings.welcomeMessage,
                custom_instructions: botSettings.customInstructions,
                currency: botSettings.currency,
                business_details: {
                    opening_hours: botSettings.businessDetails.openingHours,
                    address: botSettings.businessDetails.address,
                    contact_info: botSettings.businessDetails.contactInfo,
                    delivery_policy: botSettings.businessDetails.deliveryPolicy,
                },
            });

            // Update cached user
            const appUser = convertLaravelUser(response.data.user);
            localStorage.setItem('laravel_user', JSON.stringify(appUser));
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    // Logout
    async logout(): Promise<void> {
        try {
            await laravelClient.post('/auth/logout');
        } catch (error) {
            // Ignore logout errors
        } finally {
            localStorage.removeItem('laravel_auth_token');
            localStorage.removeItem('laravel_user');
        }
    },

    // Get user by ID (for bot loading)
    async getUserById(userId: string): Promise<User | null> {
        try {
            const res = await laravelClient.get<{ user: LaravelUser }>(`/users/${userId}`);
            return convertLaravelUser(res.data.user);
        } catch (error) {
            console.error('Error fetching user:', error);
            return null;
        }
    },
};

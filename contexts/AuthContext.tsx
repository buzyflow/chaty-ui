import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, BotSettings } from '../types';
import { laravelAuthService } from '../services/laravelAuthService';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, businessName: string) => Promise<void>;
    logout: () => Promise<void>;
    updateSettings: (userId: string, businessName: string, botSettings: BotSettings, vendorWhatsApp?: string) => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load user on mount
    useEffect(() => {
        const loadUser = async () => {
            try {
                const currentUser = await laravelAuthService.getCurrentUser();
                setUser(currentUser);
            } catch (error) {
                console.error('Failed to load user:', error);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        loadUser();
    }, []);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const user = await laravelAuthService.login(email, password);
            setUser(user);
        } finally {
            setIsLoading(false);
        }
    };

    const signup = async (email: string, password: string, businessName: string) => {
        setIsLoading(true);
        try {
            const user = await laravelAuthService.signup(email, password, businessName);
            setUser(user);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            await laravelAuthService.logout();
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const updateSettings = async (userId: string, businessName: string, botSettings: BotSettings, vendorWhatsApp?: string) => {
        await laravelAuthService.updateSettings(userId, businessName, botSettings, vendorWhatsApp);
        // Refresh user data to get updates
        const updatedUser = await laravelAuthService.getCurrentUser();
        setUser(updatedUser);
    };

    const refreshUser = async () => {
        const updatedUser = await laravelAuthService.getCurrentUser();
        setUser(updatedUser);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updateSettings, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

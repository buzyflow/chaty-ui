import React, { useState } from 'react';
import { User } from '../types';
import { Bot, Phone, UserIcon } from 'lucide-react';

interface CustomerAuthProps {
    botUser: User;
    onAuthenticated: (phoneNumber: string, name: string) => void;
}

export const CustomerAuth: React.FC<CustomerAuthProps> = ({ botUser, onAuthenticated }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const getBgColor = (color: string) => {
        const map: Record<string, string> = {
            indigo: 'bg-indigo-600',
            emerald: 'bg-emerald-600',
            rose: 'bg-rose-600',
            amber: 'bg-amber-600',
            sky: 'bg-sky-600',
            violet: 'bg-violet-600'
        };
        return map[color] || 'bg-indigo-600';
    };

    const validatePhoneNumber = (phone: string): boolean => {
        // Remove all non-digit characters
        const cleaned = phone.replace(/\D/g, '');
        // Check if it's a valid length (10-15 digits)
        return cleaned.length >= 10 && cleaned.length <= 15;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!name.trim()) {
            setError('Please enter your name');
            return;
        }

        if (!validatePhoneNumber(phoneNumber)) {
            setError('Please enter a valid WhatsApp number (10-15 digits)');
            return;
        }

        setIsLoading(true);
        try {
            // Clean phone number
            const cleanedPhone = phoneNumber.replace(/\D/g, '');
            onAuthenticated(cleanedPhone, name.trim());
        } catch (err) {
            setError('Failed to authenticate. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <div className={`min-h-screen ${getBgColor(botUser.botSettings.avatarColor)} flex items-center justify-center p-4`}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
                {/* Bot Branding */}
                <div className="text-center mb-8">
                    <div className={`w-20 h-20 rounded-full ${getBgColor(botUser.botSettings.avatarColor)} flex items-center justify-center mx-auto mb-4`}>
                        <Bot size={40} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800">{botUser.botSettings.botName}</h1>
                    <p className="text-slate-500 mt-1">{botUser.businessName}</p>
                </div>

                {/* Welcome Message */}
                <div className="bg-slate-50 p-4 rounded-lg mb-6 text-center">
                    <p className="text-slate-700">{botUser.botSettings.welcomeMessage}</p>
                </div>

                {/* Auth Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            <UserIcon size={16} className="inline mr-1" />
                            Your Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                            required
                            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            <Phone size={16} className="inline mr-1" />
                            WhatsApp Number
                        </label>
                        <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="+1234567890"
                            required
                            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                        <p className="text-xs text-slate-500 mt-1">Enter your WhatsApp number with country code</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3 rounded-lg font-bold text-white transition-all ${isLoading
                                ? 'bg-slate-400 cursor-not-allowed'
                                : `${getBgColor(botUser.botSettings.avatarColor)} hover:opacity-90`
                            }`}
                    >
                        {isLoading ? 'Please wait...' : 'Start Chatting'}
                    </button>
                </form>

                <p className="text-xs text-slate-500 text-center mt-6">
                    Your information is used to provide personalized service and will be kept confidential.
                </p>
            </div>
        </div>
    );
};

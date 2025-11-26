import React, { useState } from 'react';
import { User } from '../types';
import { Bot, Share2, MessageSquare, Settings, LogOut, Copy, Check, Package, ShoppingBag, Sparkles, TrendingUp, Zap, Menu, X } from 'lucide-react';
import { ProductManager } from './ProductManager';
import { OrdersView } from './OrdersView';

interface DashboardProps {
    user: User;
    onStartChat: () => void;
    onEditSettings: () => void;
    onLogout: () => void;
    onViewPricing?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onStartChat, onEditSettings, onLogout, onViewPricing }) => {
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders'>('overview');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const shareUrl = `${window.location.origin}?bot=${user.id}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getBgColor = (color: string) => {
        const map: Record<string, string> = {
            indigo: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
            emerald: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
            rose: 'bg-gradient-to-br from-rose-500 to-rose-600',
            amber: 'bg-gradient-to-br from-amber-500 to-amber-600',
            sky: 'bg-gradient-to-br from-sky-500 to-sky-600',
            violet: 'bg-gradient-to-br from-violet-500 to-violet-600'
        };
        return map[color] || 'bg-gradient-to-br from-indigo-500 to-indigo-600';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 md:py-6">

                {/* Mobile Header */}
                <div className="flex items-center justify-between mb-4 md:mb-6">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
                            <Bot className="text-white" size={20} />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                                Dashboard
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-600 flex items-center gap-1.5">
                                <span className="font-semibold text-indigo-600 truncate max-w-[120px] sm:max-w-none">{user.businessName}</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-sm text-slate-600 hover:text-red-600 rounded-lg sm:rounded-xl hover:bg-red-50 transition-all"
                    >
                        <LogOut size={16} />
                        <span className="hidden sm:inline font-medium">Logout</span>
                    </button>
                </div>

                {/* Tab Navigation - Mobile Optimized */}
                <div className="flex gap-1.5 sm:gap-2 mb-4 md:mb-6 p-1 sm:p-1.5 bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`flex-1 min-w-[90px] py-2.5 sm:py-3 px-3 sm:px-6 text-xs sm:text-sm font-bold rounded-lg sm:rounded-xl transition-all flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap ${activeTab === 'overview'
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                            : 'text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        <Sparkles size={14} className="sm:w-4 sm:h-4" />
                        <span>Overview</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`flex-1 min-w-[90px] py-2.5 sm:py-3 px-3 sm:px-6 text-xs sm:text-sm font-bold rounded-lg sm:rounded-xl transition-all flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap ${activeTab === 'products'
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                            : 'text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        <Package size={14} className="sm:w-4 sm:h-4" />
                        <span>Products</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`flex-1 min-w-[90px] py-2.5 sm:py-3 px-3 sm:px-6 text-xs sm:text-sm font-bold rounded-lg sm:rounded-xl transition-all flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap ${activeTab === 'orders'
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                            : 'text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        <ShoppingBag size={14} className="sm:w-4 sm:h-4" />
                        <span>Orders</span>
                    </button>
                </div>

                {activeTab === 'overview' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">

                        {/* Bot Preview Card - Mobile Optimized */}
                        <div className="lg:col-span-2 bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                            <div className="p-4 sm:p-6 border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-purple-50">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 flex items-center gap-2">
                                        <Bot className="text-indigo-600" size={18} />
                                        <span>Your AI Assistant</span>
                                    </h2>
                                    <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-[10px] sm:text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                                        <Zap size={10} className="sm:w-3 sm:h-3" />
                                        <span>LIVE</span>
                                    </span>
                                </div>
                            </div>

                            <div className="p-4 sm:p-6 md:p-8 flex flex-col items-center gap-4 sm:gap-6">
                                <div className={`w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-2xl ${getBgColor(user.botSettings.avatarColor)}`}>
                                    <Bot size={48} className="text-white sm:w-14 sm:h-14 md:w-16 md:h-16" />
                                </div>
                                <div className="w-full text-center space-y-3 sm:space-y-4">
                                    <div>
                                        <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                                            {user.botSettings.botName}
                                        </h3>
                                        <p className="text-slate-500 text-xs sm:text-sm mt-1 font-medium">AI Sales Assistant</p>
                                    </div>

                                    <div className="bg-gradient-to-br from-slate-50 to-indigo-50 p-3 sm:p-4 rounded-xl border border-indigo-100">
                                        <p className="text-slate-700 text-xs sm:text-sm italic break-words">
                                            "{user.botSettings.welcomeMessage}"
                                        </p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                                        <button
                                            onClick={onStartChat}
                                            className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg sm:rounded-xl text-sm font-bold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg flex items-center justify-center gap-2"
                                        >
                                            <MessageSquare size={16} />
                                            <span>Test Chat</span>
                                        </button>
                                        <button
                                            onClick={onEditSettings}
                                            className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-lg sm:rounded-xl text-sm font-bold hover:border-indigo-300 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Settings size={16} />
                                            <span>Customize</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Mobile Optimized */}
                        <div className="space-y-4 md:space-y-6">

                            {/* Share Link Card */}
                            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-white rounded-full blur-3xl opacity-10"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                                        <Share2 size={18} />
                                        <h2 className="text-base sm:text-lg font-bold">Share Your Bot</h2>
                                    </div>
                                    <p className="text-blue-100 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">
                                        Share this link for customers to chat with your AI
                                    </p>

                                    <div className="space-y-2 sm:space-y-3">
                                        <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg sm:rounded-xl p-2 sm:p-3 flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={shareUrl}
                                                readOnly
                                                className="bg-transparent border-none text-white text-xs sm:text-sm flex-1 focus:ring-0 truncate font-mono"
                                            />
                                        </div>
                                        <button
                                            onClick={handleCopy}
                                            className={`w-full py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${copied
                                                ? 'bg-green-500 text-white shadow-lg'
                                                : 'bg-white text-indigo-600 hover:bg-blue-50 shadow-lg'
                                                }`}
                                        >
                                            {copied ? <Check size={16} /> : <Copy size={16} />}
                                            <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Tips - Mobile Optimized */}
                            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-6">
                                <h3 className="font-bold text-slate-900 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                                    <TrendingUp size={16} className="text-indigo-600" />
                                    <span>Quick Tips</span>
                                </h3>
                                <div className="space-y-2 sm:space-y-3">
                                    <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg sm:rounded-xl border border-indigo-100">
                                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
                                            <Package size={12} className="text-white sm:w-3.5 sm:h-3.5" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs sm:text-sm font-semibold text-slate-900">Add Products</p>
                                            <p className="text-[10px] sm:text-xs text-slate-600 mt-0.5">Keep catalog updated</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg sm:rounded-xl border border-green-100">
                                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-green-600 flex items-center justify-center flex-shrink-0">
                                            <Settings size={12} className="text-white sm:w-3.5 sm:h-3.5" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs sm:text-sm font-semibold text-slate-900">Customize Bot</p>
                                            <p className="text-[10px] sm:text-xs text-slate-600 mt-0.5">Add promotions</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg sm:rounded-xl border border-amber-100">
                                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-600 flex items-center justify-center flex-shrink-0">
                                            <Share2 size={12} className="text-white sm:w-3.5 sm:h-3.5" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs sm:text-sm font-semibold text-slate-900">Share Link</p>
                                            <p className="text-[10px] sm:text-xs text-slate-600 mt-0.5">Post on social media</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>
                ) : activeTab === 'products' ? (
                    <div className="animate-in fade-in duration-300">
                        <ProductManager userId={user.id} currency={user.botSettings.currency} />
                    </div>
                ) : (
                    <div className="animate-in fade-in duration-300">
                        <OrdersView userId={user.id} />
                    </div>
                )}
            </div>
        </div>
    );
};
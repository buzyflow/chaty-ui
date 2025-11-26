import React, { useState, useEffect } from 'react';
import { Bot, MessageSquare, ShoppingCart, Zap, Check, ArrowRight, Sparkles, TrendingUp, Users, Shield, Globe, Star } from 'lucide-react';
import { pricingService, PricingPlan } from '../services/pricingService';

interface LandingPageProps {
    onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
    const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]);
    const [loadingPricing, setLoadingPricing] = useState(true);

    // Fetch pricing plans from API on mount
    useEffect(() => {
        const fetchPricing = async () => {
            try {
                setLoadingPricing(true);
                const plans = await pricingService.getPricingPlans();
                setPricingPlans(plans);
            } catch (error) {
                console.error('Error loading pricing plans:', error);
                // Fallback to empty array - could show error message instead
            } finally {
                setLoadingPricing(false);
            }
        };
        fetchPricing();
    }, []);

    const features = [
        {
            icon: <Bot className="w-6 h-6" />,
            title: 'AI-Powered Chat',
            description: 'Smart conversational AI that understands your customers and helps them shop naturally'
        },
        {
            icon: <ShoppingCart className="w-6 h-6" />,
            title: 'Seamless Ordering',
            description: 'Customers can browse, add to cart, and place orders directly through chat'
        },
        {
            icon: <MessageSquare className="w-6 h-6" />,
            title: 'WhatsApp Integration',
            description: 'Get instant order notifications and send updates via WhatsApp'
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: 'Real-time Updates',
            description: 'Track orders, update statuses, and notify customers instantly'
        },
        {
            icon: <Globe className="w-6 h-6" />,
            title: 'Multi-Currency',
            description: 'Support for multiple currencies including Naira, Dollar, Euro, and more'
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: 'Secure & Reliable',
            description: 'Built with Firebase for enterprise-grade security and reliability'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
            {/* Header */}
            <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                                <Bot className="text-white" size={24} />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                BizyFlow
                            </span>
                        </div>
                        <button
                            onClick={onGetStarted}
                            className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-200"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/20 via-purple-100/20 to-pink-100/20"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 relative">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <Sparkles size={16} />
                            <span>AI-Powered Order Management</span>
                        </div>
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            Transform Your Business with
                            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> AI Chat Commerce</span>
                        </h1>
                        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000">
                            Let customers shop naturally through conversational AI. Automate orders, manage inventory, and grow your business with intelligent automation.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
                            <button
                                onClick={onGetStarted}
                                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-2xl shadow-indigo-300 flex items-center justify-center gap-2"
                            >
                                Start Free Trial
                                <ArrowRight size={20} />
                            </button>
                            <button className="px-8 py-4 bg-white text-slate-700 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all border-2 border-slate-200 shadow-lg">
                                Watch Demo
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-indigo-600">10K+</div>
                                <div className="text-sm text-slate-600 mt-1">Active Users</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-indigo-600">99.9%</div>
                                <div className="text-sm text-slate-600 mt-1">Uptime</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-indigo-600">24/7</div>
                                <div className="text-sm text-slate-600 mt-1">Support</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-slate-900 mb-4">
                            Everything You Need to Succeed
                        </h2>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            Powerful features designed to help you sell more and serve customers better
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="p-6 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-xl transition-all bg-gradient-to-br from-white to-slate-50 group"
                            >
                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                                <p className="text-slate-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-20 bg-gradient-to-br from-slate-50 to-indigo-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-slate-900 mb-4">
                            Simple, Transparent Pricing
                        </h2>
                        <p className="text-xl text-slate-600 mb-8">
                            Choose the plan that's right for your business
                        </p>

                        {/* Billing Toggle */}
                        <div className="inline-flex items-center gap-4 p-1 bg-white rounded-xl shadow-sm border border-slate-200">
                            <button
                                onClick={() => setBillingCycle('monthly')}
                                className={`px-6 py-2 rounded-lg font-semibold transition-all ${billingCycle === 'monthly'
                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                                    : 'text-slate-600 hover:text-slate-900'
                                    }`}
                            >
                                Monthly
                            </button>
                            <button
                                onClick={() => setBillingCycle('yearly')}
                                className={`px-6 py-2 rounded-lg font-semibold transition-all ${billingCycle === 'yearly'
                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                                    : 'text-slate-600 hover:text-slate-900'
                                    }`}
                            >
                                Yearly
                                <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                    Save 17%
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Pricing Cards - Now Dynamic */}
                    {loadingPricing ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                            <p className="text-slate-600 mt-4">Loading pricing plans...</p>
                        </div>
                    ) : pricingPlans.filter(p => p.billing_period === billingCycle).length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-slate-600">No {billingCycle} pricing plans available at the moment.</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {pricingPlans
                                .filter(plan => plan.billing_period === billingCycle)
                                .map((plan) => (
                                    <div
                                        key={plan.id}
                                        className={`relative rounded-2xl p-8 ${plan.is_featured
                                            ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-2xl scale-105 border-4 border-indigo-400'
                                            : 'bg-white border-2 border-slate-200 hover:border-indigo-300 hover:shadow-xl'
                                            } transition-all`}
                                    >
                                        {plan.is_featured && (
                                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-slate-900 rounded-full text-sm font-bold flex items-center gap-1">
                                                <Star size={14} fill="currentColor" />
                                                Most Popular
                                            </div>
                                        )}

                                        <div className="mb-6">
                                            <h3 className={`text-2xl font-bold mb-2 ${plan.is_featured ? 'text-white' : 'text-slate-900'}`}>
                                                {plan.name}
                                            </h3>
                                            <p className={`text-sm ${plan.is_featured ? 'text-indigo-100' : 'text-slate-600'}`}>
                                                {plan.description}
                                            </p>
                                        </div>

                                        <div className="mb-6">
                                            <div className="flex items-baseline gap-2">
                                                <span className={`text-5xl font-bold ${plan.is_featured ? 'text-white' : 'text-slate-900'}`}>
                                                    {plan.currency === 'NGN' && '₦'}
                                                    {plan.currency === 'USD' && '$'}
                                                    {plan.currency === 'EUR' && '€'}
                                                    {plan.currency === 'GBP' && '£'}
                                                    {!['NGN', 'USD', 'EUR', 'GBP'].includes(plan.currency) && plan.currency}
                                                    {parseFloat(plan.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </span>
                                                <span className={`text-lg ${plan.is_featured ? 'text-indigo-100' : 'text-slate-600'}`}>
                                                    /{plan.billing_period === 'monthly' ? 'mo' : 'yr'}
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={onGetStarted}
                                            className={`w-full py-3 rounded-xl font-bold mb-6 transition-all ${plan.is_featured
                                                ? 'bg-white text-indigo-600 hover:bg-indigo-50 shadow-xl'
                                                : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg'
                                                }`}
                                        >
                                            Get Started
                                        </button>

                                        <ul className="space-y-3">
                                            {plan.features?.map((feature, fIndex) => (
                                                <li key={fIndex} className="flex items-start gap-3">
                                                    <Check
                                                        size={20}
                                                        className={`flex-shrink-0 mt-0.5 ${plan.is_featured ? 'text-green-300' : 'text-green-600'}`}
                                                    />
                                                    <span className={`text-sm ${plan.is_featured ? 'text-indigo-50' : 'text-slate-600'}`}>
                                                        {feature.value}
                                                    </span>
                                                </li>
                                            ))}
                                            {plan.max_products && (
                                                <li className="flex items-start gap-3">
                                                    <Check
                                                        size={20}
                                                        className={`flex-shrink-0 mt-0.5 ${plan.is_featured ? 'text-green-300' : 'text-green-600'}`}
                                                    />
                                                    <span className={`text-sm ${plan.is_featured ? 'text-indigo-50' : 'text-slate-600'}`}>
                                                        Up to {plan.max_products} products
                                                    </span>
                                                </li>
                                            )}
                                            {plan.max_orders && (
                                                <li className="flex items-start gap-3">
                                                    <Check
                                                        size={20}
                                                        className={`flex-shrink-0 mt-0.5 ${plan.is_featured ? 'text-green-300' : 'text-green-600'}`}
                                                    />
                                                    <span className={`text-sm ${plan.is_featured ? 'text-indigo-50' : 'text-slate-600'}`}>
                                                        Up to {plan.max_orders} orders/month
                                                    </span>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-bold mb-4">
                        Ready to Transform Your Business?
                    </h2>
                    <p className="text-xl text-indigo-100 mb-8">
                        Join thousands of businesses using BizyFlow to automate their sales
                    </p>
                    <button
                        onClick={onGetStarted}
                        className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-bold text-lg hover:bg-indigo-50 transition-all shadow-2xl inline-flex items-center gap-2"
                    >
                        Start Your Free Trial
                        <ArrowRight size={20} />
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-400 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                                <Bot className="text-white" size={18} />
                            </div>
                            <span className="text-white font-bold">BizyFlow</span>
                        </div>
                        <p className="text-sm">© 2025 BizyFlow. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

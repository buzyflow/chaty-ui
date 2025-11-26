import React, { useEffect, useState } from 'react';
import { pricingService, PricingPlan } from '../services/pricingService';
import { Check, Sparkles } from 'lucide-react';

const Pricing: React.FC = () => {
    const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchPricingPlans();
    }, []);

    const fetchPricingPlans = async () => {
        try {
            setLoading(true);
            const plans = await pricingService.getPricingPlans();
            setPricingPlans(plans);
        } catch (err) {
            setError('Failed to load pricing plans. Please try again later.');
            console.error('Error loading pricing plans:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
                    <p className="text-red-600">{error}</p>
                    <button
                        onClick={fetchPricingPlans}
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Choose Your Perfect Plan
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Select the plan that best fits your business needs. All plans include our core features.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {pricingPlans.map((plan, index) => (
                        <div
                            key={plan.id}
                            className={`relative bg-white rounded-2xl shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden ${plan.is_featured ? 'ring-4 ring-blue-500 lg:scale-105' : ''
                                }`}
                        >
                            {/* Featured Badge */}
                            {plan.is_featured && (
                                <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1 rounded-bl-lg flex items-center gap-1">
                                    <Sparkles className="w-4 h-4" />
                                    <span className="text-sm font-semibold">Recommended</span>
                                </div>
                            )}

                            {/* Gradient Header */}
                            <div
                                className={`p-8 ${plan.is_featured
                                    ? 'bg-gradient-to-br from-blue-500 to-indigo-600'
                                    : index % 3 === 0
                                        ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                                        : index % 3 === 1
                                            ? 'bg-gradient-to-br from-green-500 to-teal-500'
                                            : 'bg-gradient-to-br from-orange-500 to-red-500'
                                    }`}
                            >
                                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                                <p className="text-white/90 text-sm min-h-[40px]">{plan.description}</p>
                                <div className="mt-6">
                                    <span className="text-5xl font-bold text-white">
                                        {plan.currency === 'NGN' && '₦'}
                                        {plan.currency === 'USD' && '$'}
                                        {plan.currency === 'EUR' && '€'}
                                        {plan.currency === 'GBP' && '£'}
                                        {!['NGN', 'USD', 'EUR', 'GBP'].includes(plan.currency) && plan.currency}
                                        {parseFloat(plan.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                    <span className="text-white/80 ml-2">/{plan.billing_period}</span>
                                </div>
                            </div>

                            {/* Features */}
                            <div className="p-8">
                                <ul className="space-y-4 mb-8">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-3">
                                            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-700">{feature.value}</span>
                                        </li>
                                    ))}

                                    {/* Limits */}
                                    {plan.max_products && (
                                        <li className="flex items-start gap-3">
                                            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-700">
                                                Up to {plan.max_products} products
                                            </span>
                                        </li>
                                    )}
                                    {plan.max_orders && (
                                        <li className="flex items-start gap-3">
                                            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-700">
                                                Up to {plan.max_orders} orders/month
                                            </span>
                                        </li>
                                    )}
                                    {plan.max_customers && (
                                        <li className="flex items-start gap-3">
                                            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-700">
                                                Up to {plan.max_customers} customers
                                            </span>
                                        </li>
                                    )}
                                </ul>

                                {/* CTA Button */}
                                < button
                                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${plan.is_featured
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:scale-105'
                                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                                        }`}
                                >
                                    Get Started
                                </button>
                            </div>
                        </div>
                    ))
                    }
                </div >

                {/* No Plans Message */}
                {
                    pricingPlans.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-600">No pricing plans available at the moment.</p>
                        </div>
                    )
                }
            </div >
        </div >
    );
};

export default Pricing;

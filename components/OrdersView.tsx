import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../types';
import { laravelOrderService as orderService } from '../services/laravelOrderService';
import { whatsappService } from '../services/whatsappService';
import { formatPrice } from '../utils/currency';
import { Package, Clock, CheckCircle, User, Phone, Truck, Star, MessageCircle, ChevronDown } from 'lucide-react';

interface OrdersViewProps {
    userId: string;
}

export const OrdersView: React.FC<OrdersViewProps> = ({ userId }) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [filter, setFilter] = useState<'all' | OrderStatus>('all');
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

    useEffect(() => {
        loadOrders();
    }, [userId]);

    const loadOrders = async () => {
        setLoading(true);
        const allOrders = await orderService.getVendorOrders(userId);
        setOrders(allOrders);
        setLoading(false);
    };

    const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
        await orderService.updateOrderStatus(userId, orderId, newStatus);
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    };

    const handleNotifyCustomer = (order: Order) => {
        const url = whatsappService.generateCustomerUpdateLink(
            order.customerPhone,
            order.id.slice(-6),
            order.status,
            order.customerName
        );
        whatsappService.openWhatsAppLink(url);
    };

    const filteredOrders = filter === 'all'
        ? orders
        : orders.filter(o => o.status === filter);

    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.PENDING:
                return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case OrderStatus.CONFIRMED:
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case OrderStatus.SHIPPED:
                return 'bg-purple-100 text-purple-700 border-purple-200';
            case OrderStatus.COMPLETE:
                return 'bg-green-100 text-green-700 border-green-200';
            default:
                return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const getStatusIcon = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.PENDING:
                return <Clock size={14} />;
            case OrderStatus.CONFIRMED:
                return <CheckCircle size={14} />;
            case OrderStatus.SHIPPED:
                return <Truck size={14} />;
            case OrderStatus.COMPLETE:
                return <Star size={14} />;
            default:
                return <Package size={14} />;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-slate-500 text-sm">Loading orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header - Mobile Optimized */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Orders</h2>
                <div className="flex gap-2 overflow-x-auto pb-1">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${filter === 'all' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                            }`}
                    >
                        All ({orders.length})
                    </button>
                    <button
                        onClick={() => setFilter(OrderStatus.PENDING)}
                        className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${filter === OrderStatus.PENDING ? 'bg-yellow-600 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                            }`}
                    >
                        Pending
                    </button>
                    <button
                        onClick={() => setFilter(OrderStatus.CONFIRMED)}
                        className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${filter === OrderStatus.CONFIRMED ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                            }`}
                    >
                        Confirmed
                    </button>
                </div>
            </div>

            {filteredOrders.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                    <Package size={48} className="mx-auto text-slate-300 mb-3" />
                    <p className="text-slate-500 text-sm">No orders yet</p>
                    <p className="text-slate-400 text-xs mt-1">Orders will appear here when customers place them</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredOrders.map(order => (
                        <div key={order.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
                            {/* Order Header - Mobile Optimized */}
                            <div className="p-3 sm:p-4 bg-gradient-to-r from-slate-50 to-indigo-50">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            <h3 className="font-bold text-slate-800 text-sm sm:text-base">#{order.id.slice(-6)}</h3>
                                            <span className={`px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold flex items-center gap-1 border ${getStatusColor(order.status)}`}>
                                                {getStatusIcon(order.status)}
                                                <span className="hidden xs:inline">{order.status}</span>
                                            </span>
                                        </div>
                                        <p className="text-[10px] sm:text-xs text-slate-500">
                                            {new Date(order.timestamp).toLocaleDateString()} {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="text-lg sm:text-2xl font-bold text-indigo-600">
                                            {order.items[0]?.currency ? formatPrice(order.total, order.items[0].currency as any) : `$${order.total.toFixed(2)}`}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Customer Info - Mobile Optimized */}
                            <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-slate-100 bg-white">
                                <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-4 text-xs sm:text-sm text-slate-600">
                                    <div className="flex items-center gap-1.5">
                                        <User size={12} className="sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                                        <span className="truncate">{order.customerName}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Phone size={12} className="sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                                        <span className="font-mono text-[10px] sm:text-xs">{order.customerPhone}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items - Collapsible on Mobile */}
                            <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-slate-100">
                                <button
                                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                                    className="w-full flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-700 mb-2"
                                >
                                    <span>Items ({order.items.length})</span>
                                    <ChevronDown size={16} className={`transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`} />
                                </button>
                                {expandedOrder === order.id && (
                                    <div className="space-y-1.5 sm:space-y-2 mt-2">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between text-xs sm:text-sm bg-slate-50 p-2 rounded-lg">
                                                <span className="text-slate-700 flex-1 min-w-0 pr-2">
                                                    <span className="font-semibold">{item.quantity}x</span> {item.name}
                                                </span>
                                                <span className="text-slate-900 font-bold flex-shrink-0">
                                                    {item.currency ? formatPrice(item.price * item.quantity, item.currency as any) : `$${(item.price * item.quantity).toFixed(2)}`}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Actions - Mobile Optimized */}
                            <div className="p-3 sm:p-4 bg-slate-50 flex flex-col sm:flex-row gap-2">
                                <select
                                    value={order.status}
                                    onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-xs sm:text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                                >
                                    <option value={OrderStatus.PENDING}>Pending</option>
                                    <option value={OrderStatus.CONFIRMED}>Confirmed</option>
                                    <option value={OrderStatus.SHIPPED}>Shipped</option>
                                    <option value={OrderStatus.COMPLETE}>Complete</option>
                                </select>
                                <button
                                    onClick={() => handleNotifyCustomer(order)}
                                    className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg text-xs sm:text-sm font-bold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg flex items-center justify-center gap-2 whitespace-nowrap"
                                    title="Send status update via WhatsApp"
                                >
                                    <MessageCircle size={14} />
                                    <span>Notify</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

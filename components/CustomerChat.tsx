import React from 'react';
import { User, CartItem, Message, OrderStatus, Customer } from '../types';
import { ChatMessage } from './ChatMessage';
import { CartSidebar } from './CartSidebar';
import { Send, ShoppingCart, Bot } from 'lucide-react';

interface CustomerChatProps {
    botUser: User;
    customer: Customer;
    messages: Message[];
    inputText: string;
    cart: CartItem[];
    orderStatus: OrderStatus;
    isProcessing: boolean;
    isSidebarOpen: boolean;
    onSendMessage: () => void;
    onInputChange: (text: string) => void;
    onToggleSidebar: () => void;
    onManualAdd: (product: any) => void;
    messagesEndRef: React.RefObject<HTMLDivElement>;
}

export const CustomerChat: React.FC<CustomerChatProps> = ({
    botUser,
    customer,
    messages,
    inputText,
    cart,
    orderStatus,
    isProcessing,
    isSidebarOpen,
    onSendMessage,
    onInputChange,
    onToggleSidebar,
    onManualAdd,
    messagesEndRef
}) => {
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

    return (
        <div className="h-screen flex flex-col bg-slate-50">
            {/* Header */}
            <div className={`${getBgColor(botUser.botSettings.avatarColor)} text-white p-4 shadow-lg`}>
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                            <Bot size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">{botUser.botSettings.botName}</h1>
                            <p className="text-sm opacity-90">{botUser.businessName}</p>
                        </div>
                    </div>
                    <button
                        onClick={onToggleSidebar}
                        className="relative p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <ShoppingCart size={24} />
                        {cart.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                                {cart.length}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 max-w-4xl mx-auto w-full">
                <div className="space-y-4">
                    {messages.map((msg) => (
                        <ChatMessage key={msg.id} message={msg} botName={botUser.botSettings.botName} avatarColor={botUser.botSettings.avatarColor} />
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <div className="border-t border-slate-200 bg-white p-4">
                <div className="max-w-4xl mx-auto flex gap-2">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => onInputChange(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !isProcessing && onSendMessage()}
                        placeholder="Type your message..."
                        disabled={isProcessing}
                        className="flex-1 px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-slate-50"
                    />
                    <button
                        onClick={onSendMessage}
                        disabled={isProcessing || !inputText.trim()}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${isProcessing || !inputText.trim()
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            : `${getBgColor(botUser.botSettings.avatarColor)} text-white hover:opacity-90`
                            }`}
                    >
                        <Send size={20} />
                        Send
                    </button>
                </div>
            </div>

            {/* Cart Sidebar */}
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex justify-end" onClick={onToggleSidebar}>
                    <div className="bg-white w-full max-w-md h-full overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <CartSidebar
                            cart={cart}
                            orderStatus={orderStatus}
                            onUpdateQuantity={(id, delta) => { }}
                            onRemove={(id) => { }}
                            onPlaceOrder={() => { }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

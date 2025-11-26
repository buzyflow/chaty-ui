import React from 'react';
import { CartItem, OrderStatus } from '../types';
import { ShoppingBag, Minus, Plus, Trash2, CheckCircle2 } from 'lucide-react';

interface CartSidebarProps {
  cart: CartItem[];
  orderStatus: OrderStatus;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onPlaceOrder: () => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({ 
  cart, 
  orderStatus, 
  onUpdateQuantity, 
  onRemove,
  onPlaceOrder
}) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (orderStatus === OrderStatus.CONFIRMED) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-white border-l border-slate-200">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Order Confirmed!</h2>
        <p className="text-slate-500 mb-6">Your delicious food is being prepared. The kitchen has received your ticket.</p>
        <div className="w-full max-w-xs bg-slate-50 rounded-lg p-4 border border-slate-100 text-left">
          <h3 className="font-semibold text-slate-700 mb-2 text-sm uppercase tracking-wide">Receipt</h3>
          {cart.map(item => (
            <div key={item.id} className="flex justify-between text-sm mb-1 text-slate-600">
              <span>{item.quantity}x {item.name}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t border-slate-200 mt-2 pt-2 flex justify-between font-bold text-slate-800">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white border-l border-slate-200">
      <div className="p-5 border-b border-slate-100 bg-slate-50/50">
        <h2 className="font-bold text-slate-800 flex items-center gap-2">
          <ShoppingBag size={20} className="text-indigo-600" />
          Current Order
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400">
            <ShoppingBag size={48} className="mb-3 opacity-20" />
            <p className="text-sm">Your cart is empty.</p>
            <p className="text-xs mt-1">Ask the bot to add items!</p>
          </div>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="flex gap-3 bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
              <img src={item.image} alt={item.name} className="w-16 h-16 rounded-md object-cover bg-slate-100" />
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-medium text-slate-800 text-sm line-clamp-1">{item.name}</h4>
                  <p className="text-xs text-slate-500">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2 bg-slate-100 rounded px-1">
                    <button 
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      className="p-1 hover:text-indigo-600 disabled:opacity-50"
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-xs font-semibold w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      className="p-1 hover:text-indigo-600"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <button 
                    onClick={() => onRemove(item.id)}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-5 border-t border-slate-100 bg-slate-50/80 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-4">
          <span className="text-slate-500 text-sm">Total</span>
          <span className="text-2xl font-bold text-slate-800">${total.toFixed(2)}</span>
        </div>
        <button
          onClick={onPlaceOrder}
          disabled={cart.length === 0 || orderStatus === OrderStatus.PROCESSING}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] flex justify-center items-center gap-2"
        >
          {orderStatus === OrderStatus.PROCESSING ? (
            <span className="animate-pulse">Processing...</span>
          ) : (
             'Checkout Now'
          )}
        </button>
      </div>
    </div>
  );
};
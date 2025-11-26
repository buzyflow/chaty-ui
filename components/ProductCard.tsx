import React from 'react';
import { Product } from '../types';
import { formatPrice } from '../utils/currency';
import { Plus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAdd }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      <div className="h-32 overflow-hidden relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-slate-800">
          {formatPrice(product.price, product.currency as any)}
        </div>
      </div>
      <div className="p-3 flex-1 flex flex-col">
        <h3 className="font-semibold text-slate-800 text-sm mb-1">{product.name}</h3>
        <p className="text-xs text-slate-500 line-clamp-2 mb-3 flex-1">{product.description}</p>
        <button
          onClick={() => onAdd(product)}
          className="mt-auto w-full py-2 bg-slate-900 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
        >
          <Plus size={14} /> Add
        </button>
      </div>
    </div>
  );
};
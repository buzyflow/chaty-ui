
import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { laravelProductService as menuService } from '../services/laravelProductService';
import { formatPrice } from '../utils/currency';
import { Plus, Edit2, Trash2, X, Save, Package, AlertTriangle, Sparkles } from 'lucide-react';
import laravelClient from '../services/laravelClient';

interface ProductManagerProps {
    userId: string;
    currency: string;
    onProductsChange?: () => void;
}

export const ProductManager: React.FC<ProductManagerProps> = ({ userId, currency, onProductsChange }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [showSmartPaste, setShowSmartPaste] = useState(false);
    const [smartPasteText, setSmartPasteText] = useState('');
    const [extracting, setExtracting] = useState(false);
    const [extractedProducts, setExtractedProducts] = useState<any[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set());
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        image: ''
    });

    useEffect(() => {
        loadProducts();
    }, [userId]);

    const loadProducts = async () => {
        const items = await menuService.getProducts(userId);
        setProducts(items);
    };

    const handleAdd = () => {
        setEditingProduct(null);
        setFormData({ name: '', description: '', price: '', category: '', image: '' });
        setShowModal(true);
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price.toString(),
            category: product.category,
            image: product.image
        });
        setShowModal(true);
    };

    const handleDeleteClick = (product: Product) => {
        setProductToDelete(product);
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = async () => {
        if (productToDelete) {
            await menuService.deleteProduct(userId, productToDelete.id);
            await loadProducts();
            onProductsChange?.();
            setShowDeleteConfirm(false);
            setProductToDelete(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const productData = {
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            currency: currency, // Use vendor's configured currency
            category: formData.category,
            image: formData.image || 'https://picsum.photos/400/300?random=' + Date.now()
        };

        if (editingProduct) {
            await menuService.updateProduct(userId, editingProduct.id, productData);
        } else {
            await menuService.addProduct(userId, productData);
        }

        await loadProducts();
        setShowModal(false);
        onProductsChange?.();
    };

    const handleSmartPaste = async () => {
        if (!smartPasteText.trim()) return;

        setExtracting(true);
        try {
            const response = await laravelClient.post('/products/extract', {
                text: smartPasteText
            });

            if (response.data.success) {
                const products = response.data.data;

                if (products.length === 1) {
                    // Single product - auto-fill form
                    const product = products[0];
                    setFormData({
                        name: product.name,
                        description: product.description,
                        price: product.price.toString(),
                        category: product.category,
                        image: product.image // Use image from backend
                    });
                    setShowSmartPaste(false);
                    setSmartPasteText('');
                    setShowModal(true);
                } else {
                    // Multiple products - show selection UI
                    setExtractedProducts(products);
                    setSelectedProducts(new Set(products.map((_, idx) => idx)));
                }
            }
        } catch (error) {
            console.error('Smart paste failed:', error);
            alert('Failed to extract product information. Please try again.');
        } finally {
            setExtracting(false);
        }
    };

    const handleAddSelectedProducts = async () => {
        const productsToAdd = Array.from(selectedProducts).map(idx => extractedProducts[idx]);

        for (const product of productsToAdd) {
            const productData = {
                name: product.name,
                description: product.description,
                price: parseFloat(product.price),
                currency: currency,
                category: product.category,
                image: product.image // Use image from backend
            };
            await menuService.addProduct(userId, productData);
        }

        await loadProducts();
        onProductsChange?.();
        setExtractedProducts([]);
        setSelectedProducts(new Set());
        setShowSmartPaste(false);
        setSmartPasteText('');
    };

    return (
        <div className="space-y-4">
            {/* Header - Mobile Optimized */}
            <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-3">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Products</h2>
                <div className="flex gap-2 w-full xs:w-auto">
                    <button
                        onClick={() => setShowSmartPaste(true)}
                        className="flex-1 xs:flex-none px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg sm:rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg text-sm font-bold flex items-center justify-center gap-2"
                    >
                        <Sparkles size={18} />
                        <span>Smart Paste</span>
                    </button>
                    <button
                        onClick={handleAdd}
                        className="flex-1 xs:flex-none px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg sm:rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg text-sm font-bold flex items-center justify-center gap-2"
                    >
                        <Plus size={18} />
                        <span>Add Product</span>
                    </button>
                </div>
            </div>

            {/* Products Grid - Mobile Responsive */}
            {products.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                    <Package size={48} className="mx-auto text-slate-300 mb-3" />
                    <p className="text-slate-500 text-sm">No products yet</p>
                    <p className="text-slate-400 text-xs mt-1">Add your first product to get started</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {products.map(product => (
                        <div key={product.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
                            <img src={product.image} alt={product.name} className="w-full h-36 sm:h-40 object-cover" />
                            <div className="p-3 sm:p-4">
                                <h3 className="font-bold text-slate-800 text-sm sm:text-base truncate">{product.name}</h3>
                                <p className="text-xs sm:text-sm text-slate-500 mt-1 line-clamp-2">{product.description}</p>
                                <div className="flex justify-between items-center mt-3">
                                    <span className="text-lg sm:text-xl font-bold text-indigo-600">{formatPrice(product.price, product.currency as any)}</span>
                                    <span className="text-[10px] sm:text-xs bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 px-2 py-1 rounded-full font-semibold border border-indigo-100">
                                        {product.category}
                                    </span>
                                </div>
                                <div className="flex gap-2 mt-3">
                                    <button
                                        onClick={() => handleEdit(product)}
                                        className="flex-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors"
                                    >
                                        <Edit2 size={14} />
                                        <span>Edit</span>
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(product)}
                                        className="flex-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors"
                                    >
                                        <Trash2 size={14} />
                                        <span>Delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Smart Paste Modal */}
            {showSmartPaste && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                        <div className="p-4 sm:p-6 border-b border-slate-100 flex justify-between items-center flex-shrink-0 bg-gradient-to-r from-purple-50 to-pink-50">
                            <div>
                                <h3 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
                                    <Sparkles className="text-purple-600" size={24} />
                                    AI Smart Paste
                                </h3>
                                <p className="text-xs text-slate-600 mt-1">Paste product info from anywhere - websites, WhatsApp, etc.</p>
                            </div>
                            <button onClick={() => setShowSmartPaste(false)} className="text-slate-400 hover:text-slate-600 p-1">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
                            {extractedProducts.length === 0 ? (
                                /* Paste textarea */
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        Paste your product information
                                    </label>
                                    <textarea
                                        value={smartPasteText}
                                        onChange={(e) => setSmartPasteText(e.target.value)}
                                        className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none text-sm transition-all"
                                        rows={12}
                                        placeholder="Example:

iPhone 15 Pro Max - Latest flagship smartphone with A17 Pro chip and stunning titanium design. Advanced camera system. Price: ₦850,000

Or:

Fresh Jollof Rice Special
Delicious Nigerian jollof rice with chicken and plantain
$15 per plate"
                                    />
                                    <div className="mt-2 p-3 bg-purple-50 rounded-lg border border-purple-100">
                                        <p className="text-xs text-purple-900 font-semibold mb-1">💡 Tips:</p>
                                        <ul className="text-xs text-purple-700 space-y-1">
                                            <li>• Include product name and description</li>
                                            <li>• Add price with currency symbol (₦, $, €, £)</li>
                                            <li>• Mention category if possible</li>
                                            <li>• You can paste multiple products at once!</li>
                                        </ul>
                                    </div>
                                </div>
                            ) : (
                                /* Product selection UI */
                                <div>
                                    <div className="mb-3">
                                        <p className="text-sm font-bold text-slate-700">
                                            Found {extractedProducts.length} product{extractedProducts.length > 1 ? 's' : ''}! Select which ones to add:
                                        </p>
                                    </div>
                                    <div className="space-y-2 max-h-96 overflow-y-auto">
                                        {extractedProducts.map((product, idx) => (
                                            <div
                                                key={idx}
                                                className={`p-3 border-2 rounded-xl cursor-pointer transition-all ${selectedProducts.has(idx)
                                                    ? 'border-purple-500 bg-purple-50'
                                                    : 'border-slate-200 hover:border-purple-300'
                                                    }`}
                                                onClick={() => {
                                                    const newSelected = new Set(selectedProducts);
                                                    if (newSelected.has(idx)) {
                                                        newSelected.delete(idx);
                                                    } else {
                                                        newSelected.add(idx);
                                                    }
                                                    setSelectedProducts(newSelected);
                                                }}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedProducts.has(idx)}
                                                        onChange={() => { }}
                                                        className="mt-1 w-4 h-4 text-purple-600 rounded"
                                                    />
                                                    <div className="flex-1">
                                                        <h4 className="font-bold text-slate-800 text-sm">{product.name}</h4>
                                                        <p className="text-xs text-slate-600 mt-1 line-clamp-2">{product.description}</p>
                                                        <div className="flex items-center gap-3 mt-2">
                                                            <span className="text-sm font-bold text-purple-600">
                                                                {product.currency === 'NGN' && '₦'}
                                                                {product.currency === 'USD' && '$'}
                                                                {product.currency === 'EUR' && '€'}
                                                                {product.currency === 'GBP' && '£'}
                                                                {parseFloat(product.price).toLocaleString()}
                                                            </span>
                                                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                                                                {product.category}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3 p-4 sm:p-6 pt-0">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowSmartPaste(false);
                                    setExtractedProducts([]);
                                    setSelectedProducts(new Set());
                                    setSmartPasteText('');
                                }}
                                className="flex-1 px-4 py-2.5 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-colors"
                                disabled={extracting}
                            >
                                Cancel
                            </button>
                            {extractedProducts.length === 0 ? (
                                <button
                                    onClick={handleSmartPaste}
                                    disabled={extracting || !smartPasteText.trim()}
                                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {extracting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                            <span>Extracting...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles size={16} />
                                            <span>Extract</span>
                                        </>
                                    )}
                                </button>
                            ) : (
                                <button
                                    onClick={handleAddSelectedProducts}
                                    disabled={selectedProducts.size === 0}
                                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Plus size={16} />
                                    <span>Add Selected ({selectedProducts.size})</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Add/Edit Modal - Mobile Optimized */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
                        <div className="p-4 sm:p-6 border-b border-slate-100 flex justify-between items-center flex-shrink-0 bg-gradient-to-r from-indigo-50 to-purple-50">
                            <h3 className="text-lg sm:text-xl font-bold text-slate-800">
                                {editingProduct ? 'Edit Product' : 'Add Product'}
                            </h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
                            <div>
                                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border-2 border-slate-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm transition-all"
                                    placeholder="e.g. Classic Burger"
                                />
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2">Description</label>
                                <textarea
                                    required
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border-2 border-slate-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none text-sm transition-all"
                                    rows={3}
                                    placeholder="Brief description"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                <div>
                                    <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2">Price</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border-2 border-slate-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm transition-all"
                                        placeholder="0.00"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2">Category</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border-2 border-slate-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm transition-all"
                                        placeholder="e.g. Burgers"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2">Image URL (optional)</label>
                                <input
                                    type="url"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border-2 border-slate-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm transition-all"
                                    placeholder="https://..."
                                />
                                <p className="text-[10px] sm:text-xs text-slate-500 mt-1">Leave empty for random image</p>
                            </div>

                            <div className="flex gap-2 sm:gap-3 pt-2 sm:pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2.5 text-slate-600 font-semibold hover:bg-slate-100 rounded-lg sm:rounded-xl transition-colors text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-lg sm:rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg flex items-center justify-center gap-2 text-sm"
                                >
                                    <Save size={16} />
                                    <span>{editingProduct ? 'Update' : 'Add'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal - Custom Design */}
            {showDeleteConfirm && productToDelete && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm animate-in zoom-in-95 duration-200">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                                <AlertTriangle className="text-red-600" size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Product?</h3>
                            <p className="text-slate-600 text-sm mb-1">
                                Are you sure you want to delete
                            </p>
                            <p className="text-slate-900 font-bold text-base mb-4">
                                "{productToDelete.name}"?
                            </p>
                            <p className="text-slate-500 text-xs">
                                This action cannot be undone.
                            </p>
                        </div>

                        <div className="flex gap-3 p-6 pt-0">
                            <button
                                onClick={() => {
                                    setShowDeleteConfirm(false);
                                    setProductToDelete(null);
                                }}
                                className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-200 flex items-center justify-center gap-2"
                            >
                                <Trash2 size={16} />
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

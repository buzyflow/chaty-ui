import React, { useState } from 'react';
import { User, BotSettings, BusinessDetails } from '../types';
import { X, Sparkles, Building2, Palette, Bot, Store, Save, Check } from 'lucide-react';

interface SettingsModalProps {
  user: User;
  onSave: (settings: BotSettings, businessName: string, vendorWhatsApp: string) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ user, onSave, onClose }) => {
  const [activeTab, setActiveTab] = useState<'persona' | 'business'>('persona');
  const [businessName, setBusinessName] = useState(user.businessName);
  const [vendorWhatsApp, setVendorWhatsApp] = useState(user.vendorWhatsApp || '');
  const [settings, setSettings] = useState<BotSettings>(user.botSettings);

  const colors = ['indigo', 'emerald', 'rose', 'amber', 'sky', 'violet'];

  const handleSave = () => {
    onSave(settings, businessName, vendorWhatsApp);
    onClose();
  };

  const updateBusinessDetail = (key: keyof BusinessDetails, value: string) => {
    setSettings(prev => ({
      ...prev,
      businessDetails: {
        ...prev.businessDetails,
        [key]: value
      }
    }));
  };

  const getColorClass = (color: string) => {
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
              <Bot className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Bot Settings</h2>
              <p className="text-sm text-slate-600">Customize your AI assistant</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl hover:bg-white/80 transition-colors flex items-center justify-center text-slate-500 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 px-6 bg-slate-50/50">
          <button
            onClick={() => setActiveTab('persona')}
            className={`py-4 px-6 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${activeTab === 'persona'
              ? 'border-indigo-600 text-indigo-600 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-white/50'
              }`}
          >
            <Sparkles size={16} />
            Identity & Persona
          </button>
          <button
            onClick={() => setActiveTab('business')}
            className={`py-4 px-6 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${activeTab === 'business'
              ? 'border-indigo-600 text-indigo-600 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-white/50'
              }`}
          >
            <Building2 size={16} />
            Business Details
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'persona' ? (
            <div className="space-y-6 max-w-2xl">

              {/* Bot Name */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-5 border border-indigo-100">
                <label className="block text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <Bot size={16} className="text-indigo-600" />
                  Bot Name
                </label>
                <input
                  type="text"
                  value={settings.botName}
                  onChange={(e) => setSettings(prev => ({ ...prev, botName: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white font-semibold text-slate-900"
                  placeholder="e.g. ShopBot, OrderAssistant"
                />
              </div>

              {/* Avatar Color */}
              <div className="bg-white rounded-xl p-5 border-2 border-slate-200">
                <label className="block text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Palette size={16} className="text-purple-600" />
                  Avatar Color
                </label>
                <div className="grid grid-cols-6 gap-3">
                  {colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSettings(prev => ({ ...prev, avatarColor: color }))}
                      className={`relative w-full aspect-square rounded-xl ${getColorClass(color)} transition-all hover:scale-110 hover:shadow-lg ${settings.avatarColor === color ? 'ring-4 ring-offset-2 ring-slate-900 scale-110' : ''
                        }`}
                    >
                      {settings.avatarColor === color && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Check className="text-white" size={20} strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Currency */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100">
                <label className="block text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Currency
                </label>
                <select
                  value={settings.currency}
                  onChange={(e) => setSettings(prev => ({ ...prev, currency: e.target.value as any }))}
                  className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-white font-semibold text-slate-900"
                >
                  <option value="NGN">₦ Nigerian Naira (NGN)</option>
                  <option value="USD">$ US Dollar (USD)</option>
                  <option value="EUR">€ Euro (EUR)</option>
                  <option value="GBP">£ British Pound (GBP)</option>
                  <option value="ZAR">R South African Rand (ZAR)</option>
                  <option value="KES">KSh Kenyan Shilling (KES)</option>
                </select>
              </div>

              {/* Welcome Message */}
              <div className="bg-white rounded-xl p-5 border-2 border-slate-200">
                <label className="block text-sm font-bold text-slate-800 mb-3">Welcome Message</label>
                <textarea
                  value={settings.welcomeMessage}
                  onChange={(e) => setSettings(prev => ({ ...prev, welcomeMessage: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
                  rows={3}
                  placeholder="e.g. Welcome! How can I help you today?"
                />
              </div>

              {/* Custom Instructions */}
              <div className="bg-white rounded-xl p-5 border-2 border-slate-200">
                <label className="block text-sm font-bold text-slate-800 mb-3">System Instructions</label>
                <textarea
                  value={settings.customInstructions}
                  onChange={(e) => setSettings(prev => ({ ...prev, customInstructions: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none font-mono text-sm"
                  rows={6}
                  placeholder="Define your bot's personality, tone, and behavior..."
                />
                <p className="text-xs text-slate-500 mt-2">
                  💡 Tip: Be specific about tone, style, and how to handle customer queries
                </p>
              </div>

            </div>
          ) : (
            <div className="space-y-6 max-w-2xl">

              {/* Business Name */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                <label className="block text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <Store size={16} className="text-blue-600" />
                  Business Name
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white font-semibold text-slate-900"
                  placeholder="e.g. Urban Bites"
                />
              </div>

              {/* WhatsApp Number */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100">
                <label className="block text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  value={vendorWhatsApp}
                  onChange={(e) => setVendorWhatsApp(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-white font-mono"
                  placeholder="+1234567890"
                />
                <p className="text-xs text-green-700 mt-2 flex items-center gap-1">
                  <Check size={12} />
                  You'll receive new order notifications on this number
                </p>
              </div>

              {/* Opening Hours */}
              <div className="bg-white rounded-xl p-5 border-2 border-slate-200">
                <label className="block text-sm font-bold text-slate-800 mb-3">Opening Hours</label>
                <input
                  type="text"
                  value={settings.businessDetails.openingHours}
                  onChange={(e) => updateBusinessDetail('openingHours', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="e.g. Mon-Fri: 9am-10pm, Sat-Sun: 10am-11pm"
                />
              </div>

              {/* Address */}
              <div className="bg-white rounded-xl p-5 border-2 border-slate-200">
                <label className="block text-sm font-bold text-slate-800 mb-3">Address / Location</label>
                <input
                  type="text"
                  value={settings.businessDetails.address}
                  onChange={(e) => updateBusinessDetail('address', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="e.g. 123 Main St, New York, NY 10001"
                />
              </div>

              {/* Contact Info */}
              <div className="bg-white rounded-xl p-5 border-2 border-slate-200">
                <label className="block text-sm font-bold text-slate-800 mb-3">Contact Info</label>
                <input
                  type="text"
                  value={settings.businessDetails.contactInfo}
                  onChange={(e) => updateBusinessDetail('contactInfo', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="e.g. +1-555-0123, support@business.com"
                />
              </div>

              {/* Delivery Policy */}
              <div className="bg-white rounded-xl p-5 border-2 border-slate-200">
                <label className="block text-sm font-bold text-slate-800 mb-3">Delivery / Shipping Policy</label>
                <textarea
                  value={settings.businessDetails.deliveryPolicy}
                  onChange={(e) => updateBusinessDetail('deliveryPolicy', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
                  rows={3}
                  placeholder="e.g. Free delivery on orders over $50. Standard delivery takes 2-3 business days."
                />
              </div>

            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="px-6 py-3 text-slate-600 hover:text-slate-800 font-semibold transition-colors rounded-xl hover:bg-slate-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-200 hover:shadow-xl hover:scale-105 flex items-center gap-2"
          >
            <Save size={18} />
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
};
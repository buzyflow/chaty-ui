import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Menu as MenuIcon, X, Settings, LogOut, User as UserIcon, ArrowLeft } from 'lucide-react';
import { Product, CartItem, Message, OrderStatus, User, BotSettings, Customer } from './types';
import { laravelChatService } from './services/laravelChatService';
import { laravelProductService as menuService } from './services/laravelProductService';
import { useAuth } from './contexts/AuthContext';
import { laravelCustomerService as customerService } from './services/laravelCustomerService';
import { laravelOrderService as orderService } from './services/laravelOrderService';
import { whatsappService } from './services/whatsappService';
import { ChatMessage } from './components/ChatMessage';
import { ProductCard } from './components/ProductCard';
import { CartSidebar } from './components/CartSidebar';
import { AuthScreen } from './components/AuthScreen';
import { SettingsModal } from './components/SettingsModal';
import { Dashboard } from './components/Dashboard';
import { CustomerChat } from './components/CustomerChat';
import { LandingPage } from './components/LandingPage';
import { CustomerAuth } from './components/CustomerAuth';
import Pricing from './pages/Pricing';

function App() {
  // --- Auth & User State ---
  const { user, logout, updateSettings } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'chat' | 'pricing'>('dashboard');
  const [customerMode, setCustomerMode] = useState(false);
  const [botUser, setBotUser] = useState<User | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);

  // --- App State ---
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderStatus, setOrderStatus] = useState<OrderStatus>(OrderStatus.IDLE);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Detect bot ID from URL on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const botId = urlParams.get('bot');

    if (botId) {
      // Customer mode - load bot by ID
      setCustomerMode(true);
      loadBotForCustomer(botId);
    }
  }, []);

  const loadBotForCustomer = async (botId: string) => {
    console.log('[Session] Loading bot for customer, botId:', botId);
    // We still use the service directly for public bot access as it doesn't require auth context
    const { laravelAuthService } = await import('./services/laravelAuthService');
    const bot = await laravelAuthService.getUserById(botId);
    if (bot) {
      console.log('[Session] Bot loaded:', bot.businessName);
      setBotUser(bot);
      const items = await menuService.getProducts(botId);
      setProducts(items);

      // Check if customer is already authenticated in localStorage
      const savedCustomerData = localStorage.getItem(`customer_${botId}`);
      console.log('[Session] Checking localStorage for customer_' + botId);
      console.log('[Session] Saved customer data:', savedCustomerData);

      if (savedCustomerData) {
        try {
          const savedCustomer = JSON.parse(savedCustomerData);
          console.log('[Session] Parsed saved customer:', savedCustomer);

          // Verify customer still exists in backend
          const existingCustomer = await customerService.getCustomer(botId, savedCustomer.phone);
          console.log('[Session] Backend verification result:', existingCustomer);

          if (existingCustomer) {
            console.log('[Session] Customer verified, restoring session');
            setCustomer(existingCustomer);
            await customerService.updateLastActive(botId, existingCustomer.id);
            initializeChat(bot, existingCustomer);
            return;
          } else {
            console.log('[Session] Customer not found in backend, clearing localStorage');
            // Customer no longer exists, clear localStorage
            localStorage.removeItem(`customer_${botId}`);
          }
        } catch (error) {
          console.error('[Session] Error restoring customer session:', error);
          localStorage.removeItem(`customer_${botId}`);
        }
      } else {
        console.log('[Session] No saved customer data found');
      }
    } else {
      console.log('[Session] Bot not found for ID:', botId);
    }
  };

  const handleCustomerAuth = async (phoneNumber: string, name: string) => {
    if (!botUser) return;

    // Check if customer exists
    let existingCustomer = await customerService.getCustomer(botUser.id, phoneNumber);

    if (!existingCustomer) {
      // Create new customer
      existingCustomer = await customerService.createCustomer(botUser.id, phoneNumber, name);
    } else {
      // Update last active
      await customerService.updateLastActive(botUser.id, existingCustomer.id);
    }

    // Save to localStorage for persistence
    localStorage.setItem(`customer_${botUser.id}`, JSON.stringify(existingCustomer));

    setCustomer(existingCustomer);
    initializeChat(botUser, existingCustomer);
  };

  const handleCustomerLogout = () => {
    if (botUser) {
      localStorage.removeItem(`customer_${botUser.id}`);
    }
    setCustomer(null);
    setMessages([]);
    setCart([]);
  };

  // Handle Auth State Changes (only for business owners, not customers)
  useEffect(() => {
    if (customerMode) return; // Skip auth for customer mode

    if (user) {
      // Only initialize chat if it's a fresh login or page load
      initializeChat(user);
    } else {
      setMessages([]);
      setCart([]);
      setCurrentView('dashboard');
    }
  }, [user, customerMode]);

  // Fetch Menu on Mount
  useEffect(() => {
    if (customerMode) return; // Menu for customer mode is loaded via loadBotForCustomer

    const loadProducts = async (userId: string) => {
      await menuService.seedProducts(userId); // Ensure products exist
      const items = await menuService.getProducts(userId);
      setProducts(items);
    };
    if (user) {
      loadProducts(user.id);
    }
  }, [user]);

  const initializeChat = (currentUser: User, customerData?: Customer) => {
    // Set initial welcome message from settings
    setMessages([{
      id: 'welcome',
      role: 'model',
      text: currentUser.botSettings.welcomeMessage,
    }]);
    setCart([]);
    setOrderStatus(OrderStatus.IDLE);
  };

  // --- Handlers ---

  const handleLogin = (loggedInUser: User) => {
    // State update handled by onAuthStateChanged
    setCurrentView('dashboard');
  };

  const handleLogout = async () => {
    await logout();
    // State update handled by useEffect
  };

  const handleEditSettings = async (newSettings: BotSettings, newBusinessName: string, vendorWhatsApp: string) => {
    if (!user) return;
    await updateSettings(user.id, newBusinessName, newSettings, vendorWhatsApp);
    // User state is automatically updated by context
    setShowSettings(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isProcessing) return;

    const userText = inputText;
    setInputText('');
    setIsProcessing(true);

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: userText };
    setMessages(prev => [...prev, userMsg]);

    const loadingId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: loadingId, role: 'model', text: '', isLoading: true }]);

    try {
      // Determine customer_id and user_id based on mode
      const customerId = customerMode ? customer?.id : undefined;
      const userId = customerMode ? botUser?.id : user?.id;

      const response = await laravelChatService.sendMessage(userText, customerId, userId);
      const finalResponseText = response || "I'm not sure how to respond to that.";
      setMessages(prev => prev.map(msg =>
        msg.id === loadingId
          ? { ...msg, role: 'model', text: finalResponseText, isLoading: false }
          : msg
      ));
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => prev.map(msg =>
        msg.id === loadingId
          ? { ...msg, role: 'model', text: "Sorry, I encountered an error processing your request.", isError: true, isLoading: false }
          : msg
      ));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualAdd = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  // --- Render ---

  // Customer mode - show simplified chat interface
  if (customerMode) {
    if (!botUser) {
      return (
        <div className="h-screen flex items-center justify-center bg-slate-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Loading...</h2>
            <p className="text-slate-500">Please wait while we load the chatbot.</p>
          </div>
        </div>
      );
    }

    // Show auth form if customer not authenticated
    if (!customer) {
      return <CustomerAuth botUser={botUser} onAuthenticated={handleCustomerAuth} />;
    }

    return (
      <CustomerChat
        botUser={botUser}
        customer={customer}
        messages={messages}
        inputText={inputText}
        cart={cart}
        orderStatus={orderStatus}
        isProcessing={isProcessing}
        isSidebarOpen={isSidebarOpen}
        onSendMessage={handleSendMessage}
        onInputChange={setInputText}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onManualAdd={handleManualAdd}
        messagesEndRef={messagesEndRef}
      />
    );
  }

  // Business owner mode - show auth or dashboard
  // Show landing page if not authenticated and not in customer mode
  if (!user && !customerMode && showLanding) {
    return (
      <LandingPage
        onGetStarted={() => {
          setShowLanding(false);
          setShowAuth(true);
        }}
      />
    );
  }

  // Show auth screen if not authenticated
  if (!user && !customerMode) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  // Common Settings Modal
  const settingsModal = showSettings && (
    <SettingsModal
      user={user}
      onSave={handleEditSettings}
      onClose={() => setShowSettings(false)}
    />
  );

  // --- View: Dashboard ---
  if (currentView === 'dashboard') {
    return (
      <>
        {settingsModal}
        <Dashboard
          user={user}
          onStartChat={() => setCurrentView('chat')}
          onEditSettings={() => setShowSettings(true)}
          onLogout={handleLogout}
          onViewPricing={() => setCurrentView('pricing')}
        />
      </>
    );
  }

  // --- View: Pricing Page ---
  if (currentView === 'pricing') {
    return (
      <>
        <div className="relative">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
          <Pricing />
        </div>
      </>
    );
  }

  // --- View: Chat Interface ---
  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans">

      {settingsModal}

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full relative z-0">

        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm flex-shrink-0 z-20">
          <div className="flex items-center gap-3">
            {/* Back Button for Dashboard */}
            <button
              onClick={() => setCurrentView('dashboard')}
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-indigo-600 transition-colors mr-1"
              title="Back to Dashboard"
            >
              <ArrowLeft size={20} />
            </button>

            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
              {user.businessName.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <h1 className="font-bold text-slate-800 text-sm leading-tight">{user.businessName}</h1>
              <span className="text-xs text-slate-500">Preview Mode</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="text-xs font-bold text-slate-500 hover:text-indigo-600 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 hidden md:block"
            >
              Exit Preview
            </button>

            <div className="h-6 w-px bg-slate-200 mx-1 hidden md:block"></div>

            <button
              onClick={() => setShowSettings(true)}
              className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-full transition-colors"
              title="Bot Settings"
            >
              <Settings size={20} />
            </button>

            <button
              className="lg:hidden p-2 text-slate-600 ml-2"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <X /> : <MenuIcon />}
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-hidden flex flex-col md:flex-row relative">

          {/* Chat Area */}
          <div className="flex-1 flex flex-col h-full md:border-r border-slate-200 bg-slate-50/50">
            <div className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-hide">
              <div className="max-w-3xl mx-auto w-full">
                {messages.map((msg) => (
                  <ChatMessage
                    key={msg.id}
                    message={msg}
                    botName={user.botSettings.botName}
                    avatarColor={user.botSettings.avatarColor}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-200">
              <div className="max-w-3xl mx-auto w-full relative">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={`Message ${user.botSettings.botName}...`}
                  className="w-full pl-5 pr-12 py-3.5 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400"
                  disabled={isProcessing || orderStatus === OrderStatus.CONFIRMED}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isProcessing || orderStatus === OrderStatus.CONFIRMED}
                  className="absolute right-2 top-2 p-1.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors"
                >
                  <Send size={18} />
                </button>
              </div>
              {orderStatus === OrderStatus.CONFIRMED && (
                <div className="text-center mt-2">
                  <button
                    onClick={() => initializeChat(user)}
                    className="text-sm text-indigo-600 font-medium hover:underline"
                  >
                    Start New Order
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Menu Area (Tablet/Desktop) */}
          <div className="hidden md:flex flex-col w-[320px] xl:w-[400px] bg-slate-100 border-r border-slate-200">
            <div className="p-4 border-b border-slate-200 bg-white/50 backdrop-blur">
              <h2 className="font-semibold text-slate-700">Product Catalog</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} onAdd={handleManualAdd} />
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Cart Sidebar */}
      <div className={`
          fixed inset-y-0 right-0 w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50
          lg:relative lg:translate-x-0 lg:shadow-none lg:w-80
          ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
        `}>
        <CartSidebar
          cart={cart}
          orderStatus={orderStatus}
          onUpdateQuantity={updateQuantity}
          onRemove={removeItem}
          onPlaceOrder={() => setOrderStatus(OrderStatus.CONFIRMED)}
        />
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600"
        >
          <X size={20} />
        </button>
      </div>

    </div>
  );
}

export default App;
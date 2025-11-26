import { GoogleGenAI, FunctionDeclaration, Type, Chat } from '@google/genai';

// --- Tool Definitions (Redefined here to keep file self-contained as per request structure) ---

const getProductsTool: FunctionDeclaration = {
  name: 'getProducts',
  description: 'Get the full catalog of products/services with details like id, name, price, currency, description.',
  parameters: { type: Type.OBJECT, properties: {} },
};

const addToCartTool: FunctionDeclaration = {
  name: 'addToCart',
  description: 'Add a specific item to the customer\'s shopping cart.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      itemName: { type: Type.STRING, description: 'The name of the item to add.' },
      quantity: { type: Type.NUMBER, description: 'The number of items to add. Default is 1.' },
    },
    required: ['itemName'],
  },
};

const removeFromCartTool: FunctionDeclaration = {
  name: 'removeFromCart',
  description: 'Remove an item from the shopping cart.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      itemName: { type: Type.STRING, description: 'The name of the item to remove.' },
    },
    required: ['itemName'],
  },
};

const getCartTool: FunctionDeclaration = {
  name: 'getCart',
  description: 'Get the current status of the cart, including items and total price.',
  parameters: { type: Type.OBJECT, properties: {} },
};

const placeOrderTool: FunctionDeclaration = {
  name: 'placeOrder',
  description: 'Finalize and place the order for the customer.',
  parameters: { type: Type.OBJECT, properties: {} },
};

export const tools = [
  getProductsTool,
  addToCartTool,
  removeFromCartTool,
  getCartTool,
  placeOrderTool
];

// --- Service Class ---

export class GeminiService {
  private ai: GoogleGenAI;
  private chatSession: Chat | null = null;

  constructor() {
    const apiKey = process.env.API_KEY || '';
    if (!apiKey) {
      console.warn("API Key not found in environment variables");
    }
    this.ai = new GoogleGenAI({ apiKey });
  }

  public createChat(systemInstruction: string) {
    this.chatSession = this.ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemInstruction,
        tools: [{ functionDeclarations: tools }],
      },
    });
    return this.chatSession;
  }

  public getChat() {
    // Note: If getChat is called without createChat first, it might fail or return null. 
    // The App logic ensures createChat is called with proper instructions.
    return this.chatSession;
  }
}

export const geminiService = new GeminiService();
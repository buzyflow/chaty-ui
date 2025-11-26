import laravelClient from './laravelClient';

export interface ChatResponse {
    response: string;
}

export const laravelChatService = {
    async sendMessage(prompt: string, customerId?: string, userId?: string): Promise<string> {
        try {
            const response = await laravelClient.post<{ response: string }>('/chat', {
                prompt,
                customer_id: customerId?.toString() || null,
                user_id: userId?.toString(),
            });
            return response.data.response;
        } catch (error) {
            console.error('Chat error:', error);
            throw error;
        }
    },
};

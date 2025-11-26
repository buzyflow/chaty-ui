import { Order } from '../types';

export const whatsappService = {
    // Format order details for WhatsApp message
    formatOrderMessage: (order: Order): string => {
        const itemsList = order.items
            .map(item => `• ${item.quantity}x ${item.name} - $${(item.price * item.quantity).toFixed(2)}`)
            .join('\n');

        return `🛍️ *NEW ORDER #${order.id.slice(-6)}*\n\n` +
            `👤 Customer: ${order.customerName}\n` +
            `📱 Phone: ${order.customerPhone}\n\n` +
            `📦 *Items:*\n${itemsList}\n\n` +
            `💰 *Total: $${order.total.toFixed(2)}*\n\n` +
            `⏰ ${new Date(order.timestamp).toLocaleString()}`;
    },

    // Generate wa.me link to send order to vendor
    sendOrderToVendor: (vendorPhone: string, order: Order): string => {
        const message = whatsappService.formatOrderMessage(order);
        const encodedMessage = encodeURIComponent(message);
        // Remove all non-digit characters from phone number
        const cleanPhone = vendorPhone.replace(/\D/g, '');
        return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
    },

    // Generate wa.me link for vendor to send status update to customer
    generateCustomerUpdateLink: (customerPhone: string, orderNumber: string, status: string, customerName: string): string => {
        const statusMessages: Record<string, string> = {
            CONFIRMED: `✅ Great news! Your order #${orderNumber} has been confirmed and we're preparing it for you.`,
            SHIPPED: `🚚 Your order #${orderNumber} is on its way! You should receive it soon.`,
            COMPLETE: `✨ Your order #${orderNumber} has been delivered! Thank you for your purchase. We hope you love it!`
        };

        const message = `Hi ${customerName}! ${statusMessages[status] || `Your order #${orderNumber} status: ${status}`}`;
        const encodedMessage = encodeURIComponent(message);
        // Remove all non-digit characters from phone number
        const cleanPhone = customerPhone.replace(/\D/g, '');
        return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
    },

    // Open WhatsApp link in new window
    openWhatsAppLink: (url: string): void => {
        window.open(url, '_blank');
    }
};

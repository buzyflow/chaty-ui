import { Currency, CurrencyInfo } from '../types';

export const CURRENCIES: CurrencyInfo[] = [
    { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
    { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' }
];

export const getCurrencyInfo = (code: Currency): CurrencyInfo => {
    return CURRENCIES.find(c => c.code === code) || CURRENCIES[0];
};

export const formatPrice = (amount: number, currency: Currency): string => {
    const currencyInfo = getCurrencyInfo(currency);

    // Format with appropriate decimal places
    const formatted = amount.toFixed(2);

    // Return with currency symbol
    return `${currencyInfo.symbol}${formatted}`;
};

export const getCurrencySymbol = (currency: Currency): string => {
    return getCurrencyInfo(currency).symbol;
};

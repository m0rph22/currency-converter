import FreeCurrencyAPI from '@everapi/freecurrencyapi-js';

// Initialize the API client with the API key from environment variable
const apiKey = process.env.NEXT_PUBLIC_FREECURRENCYAPI_KEY || 'YOUR-API-KEY-HERE';
export const freeCurrencyAPI = new FreeCurrencyAPI(apiKey); 
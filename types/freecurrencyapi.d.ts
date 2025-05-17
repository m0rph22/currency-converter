declare module '@everapi/freecurrencyapi-js' {
  interface CurrencyResponse {
    data: Record<string, number>;
  }

  class FreeCurrencyAPI {
    constructor(apiKey: string);
    latest(options: {
      base_currency?: string;
      currencies?: string;
    }): Promise<CurrencyResponse>;
  }

  export default FreeCurrencyAPI;
} 
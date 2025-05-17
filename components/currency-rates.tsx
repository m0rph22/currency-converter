"use client"

import { useEffect, useState } from "react"
import { BarChart3, TrendingDown, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { freeCurrencyAPI } from "@/lib/currency-api"

const popularPairs = [
  { from: "PLN", to: "EUR" },
  { from: "PLN", to: "USD" },
]

export function CurrencyRates() {
  const [rates, setRates] = useState<Record<string, number>>({});
  const [previousRates, setPreviousRates] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        // Get unique currencies excluding USD (base currency)
        const uniqueCurrencies = [...new Set(popularPairs.flatMap(pair => [pair.from, pair.to]))]
          .filter(curr => curr !== 'USD');

        // Get current rates
        const response = await freeCurrencyAPI.latest({
          base_currency: 'USD',
          currencies: uniqueCurrencies.join(',')
        });
        
        // Add USD rate (1 since it's the base currency)
        const newRates = { ...response.data, USD: 1 };
        setPreviousRates(rates);
        setRates(newRates);
        setError(null);
      } catch (err) {
        console.error('Error fetching rates:', err);
        setError('Failed to fetch rates');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRates();
    
    // Fetch rates every minute
    const interval = setInterval(fetchRates, 60000);
    return () => clearInterval(interval);
  }, []);

  const calculateRate = (from: string, to: string): number => {
    if (!rates || Object.keys(rates).length === 0) return 0;
    if (!(from in rates) || !(to in rates)) return 0;
    
    if (from === 'USD') return rates[to];
    if (to === 'USD') return 1 / rates[from];
    return rates[to] / rates[from];
  };

  const calculateChange = (from: string, to: string): number => {
    if (!previousRates || Object.keys(previousRates).length === 0) return 0;
    if (!rates || Object.keys(rates).length === 0) return 0;
    if (!(from in rates) || !(to in rates) || !(from in previousRates) || !(to in previousRates)) return 0;
    
    const oldRate = from === 'USD' ? previousRates[to] : previousRates[to] / previousRates[from];
    const newRate = calculateRate(from, to);
    return newRate - oldRate;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart3 className="mr-2 h-5 w-5" />
          Exchange rates
        </CardTitle>
        <CardDescription>Current rates of popular currencies</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 rounded-lg bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}
        <Tabs defaultValue="popular">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="all">All currencies</TabsTrigger>
          </TabsList>
          <TabsContent value="popular" className="mt-4">
            {isLoading ? (
              <div className="text-center text-sm text-muted-foreground">Loading rates...</div>
            ) : (
              <div className="space-y-4">
                {popularPairs.map((pair, index) => {
                  const rate = calculateRate(pair.from, pair.to);
                  const change = calculateChange(pair.from, pair.to);
                  
                  return (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="font-medium">
                          {pair.from}/{pair.to}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="mr-2 font-semibold">{rate.toFixed(4)}</div>
                        <div className={`flex items-center text-xs ${change > 0 ? "text-green-500" : "text-red-500"}`}>
                          {change !== 0 && (
                            <>
                              {change > 0 ? (
                                <TrendingUp className="mr-1 h-3 w-3" />
                              ) : (
                                <TrendingDown className="mr-1 h-3 w-3" />
                              )}
                              {Math.abs(change).toFixed(4)}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>
          <TabsContent value="all" className="mt-4">
            <div className="text-center text-sm text-muted-foreground">
              Subscribe to our premium plan to view all exchange rates.
            </div>
          </TabsContent>
        </Tabs>
        <div className="mt-6">
          <h3 className="mb-2 text-sm font-medium">Popular conversions</h3>
          <div className="grid grid-cols-2 gap-2">
            {popularPairs.slice(0, 4).map((pair, index) => (
              <button
                key={index}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-accent"
              >
                {pair.from} → {pair.to}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

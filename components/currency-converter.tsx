"use client"

import { useEffect, useState } from "react"
import { ArrowRightLeft, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CurrencyRates } from "@/components/currency-rates"
import { freeCurrencyAPI } from "@/lib/currency-api"

const currencies = [
  { code: "USD", name: "U.S. Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "British Pound" },
  { code: "CNY", name: "Chinese Yuan" },
  { code: "CHF", name: "Swiss Franc" },
  { code: "AUD", name: "Australian Dollar" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "PLN", name: "Polish Zloty" },
]

export function CurrencyConverter() {
  const [amount, setAmount] = useState<string>("1")
  const [fromCurrency, setFromCurrency] = useState<string>("EUR")
  const [toCurrency, setToCurrency] = useState<string>("USD")
  const [result, setResult] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [rates, setRates] = useState<Record<string, number>>({})
  const [error, setError] = useState<string | null>(null)
  const [fee, setFee] = useState<string>("0")

  useEffect(() => {
    const fetchRates = async () => {
      try {
        // Get unique currencies excluding USD (base currency)
        const uniqueCurrencies = currencies
          .map(curr => curr.code)
          .filter(curr => curr !== 'USD');

        const response = await freeCurrencyAPI.latest({
          base_currency: 'USD',
          currencies: uniqueCurrencies.join(',')
        });

        // Add USD rate (1 since it's the base currency)
        setRates({ ...response.data, USD: 1 });
        setError(null);
      } catch (err) {
        console.error('Error fetching rates:', err);
        setError('Failed to fetch currency rates. Please try again later.');
      }
    };

    fetchRates();
  }, []);

  const handleConvert = () => {
    if (!rates || Object.keys(rates).length === 0) {
      setError('Currency rates are not available. Please try again later.');
      return;
    }

    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      try {
        // Convert through USD as base currency
        const amountInUSD = fromCurrency === 'USD'
          ? Number.parseFloat(amount)
          : Number.parseFloat(amount) / rates[fromCurrency];
        
        const calculatedResult = toCurrency === 'USD'
          ? amountInUSD
          : amountInUSD * rates[toCurrency];

        // Apply fee if present
        const feePercentage = Number.parseFloat(fee) || 0;
        const resultWithFee = calculatedResult * (1 - feePercentage / 100);

        setResult(resultWithFee);
      } catch (err) {
        setError('Error performing conversion. Please try again.');
        console.error('Conversion error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 500);
  }

  const handleSwap = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
    setResult(null)
  }

  const getExchangeRate = (from: string, to: string): number => {
    if (!rates || Object.keys(rates).length === 0) return 0;
    if (!(from in rates) || !(to in rates)) return 0;
    
    if (from === 'USD') return rates[to];
    if (to === 'USD') return 1 / rates[from];
    return rates[to] / rates[from];
  };

  return (
    <div className="grid gap-8 md:grid-cols-3">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Convert currency</CardTitle>
          <CardDescription>Enter the amount and select currencies to convert</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 rounded-lg bg-red-100 p-4 text-red-700">
              {error}
            </div>
          )}
          <Tabs defaultValue="simple" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="simple">Simple</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
            <TabsContent value="simple">
              <div className="grid gap-6">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Enter the amount"
                      value={amount}
                      onChange={(e) => {
                        setAmount(e.target.value)
                        setResult(null)
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
                    <div className="grid gap-2">
                      <Label htmlFor="from-currency">From</Label>
                      <Select
                        value={fromCurrency}
                        onValueChange={(value) => {
                          setFromCurrency(value)
                          setResult(null)
                        }}
                      >
                        <SelectTrigger id="from-currency" className="w-full">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map((currency) => (
                            <SelectItem key={currency.code} value={currency.code}>
                              {currency.code} - {currency.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-full" onClick={handleSwap}>
                      <ArrowRightLeft className="h-4 w-4" />
                      <span className="sr-only">Swap currencies</span>
                    </Button>
                    <div className="grid gap-2">
                      <Label htmlFor="to-currency">To</Label>
                      <Select
                        value={toCurrency}
                        onValueChange={(value) => {
                          setToCurrency(value)
                          setResult(null)
                        }}
                      >
                        <SelectTrigger id="to-currency" className="w-full">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map((currency) => (
                            <SelectItem key={currency.code} value={currency.code}>
                              {currency.code} - {currency.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <Button onClick={handleConvert} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Converting...
                    </>
                  ) : (
                    "Convert"
                  )}
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="advanced">
              <div className="grid gap-6">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="amount-advanced">Amount</Label>
                    <Input
                      id="amount-advanced"
                      type="number"
                      placeholder="Enter the amount"
                      value={amount}
                      onChange={(e) => {
                        setAmount(e.target.value)
                        setResult(null)
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
                    <div className="grid gap-2">
                      <Label htmlFor="from-currency-advanced">From</Label>
                      <Select
                        value={fromCurrency}
                        onValueChange={(value) => {
                          setFromCurrency(value)
                          setResult(null)
                        }}
                      >
                        <SelectTrigger id="from-currency-advanced" className="w-full">
                          <SelectValue placeholder="Choose currency" />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map((currency) => (
                            <SelectItem key={currency.code} value={currency.code}>
                              {currency.code} - {currency.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-full" onClick={handleSwap}>
                      <ArrowRightLeft className="h-4 w-4" />
                      <span className="sr-only">Swap currencies</span>
                    </Button>
                    <div className="grid gap-2">
                      <Label htmlFor="to-currency-advanced">To</Label>
                      <Select
                        value={toCurrency}
                        onValueChange={(value) => {
                          setToCurrency(value)
                          setResult(null)
                        }}
                      >
                        <SelectTrigger id="to-currency-advanced" className="w-full">
                          <SelectValue placeholder="Choose currency" />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map((currency) => (
                            <SelectItem key={currency.code} value={currency.code}>
                              {currency.code} - {currency.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="fee">Conversion fee (%)</Label>
                    <Input 
                      id="fee" 
                      type="number" 
                      placeholder="0" 
                      value={fee}
                      onChange={(e) => {
                        setFee(e.target.value)
                        setResult(null)
                      }}
                      min="0"
                      max="100"
                      step="0.01"
                    />
                  </div>
                </div>
                <Button onClick={handleConvert} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Converting...
                    </>
                  ) : (
                    "Convert"
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col items-start">
          {result !== null && (
            <div className="w-full rounded-lg bg-muted p-4">
              <div className="text-sm text-muted-foreground">Result</div>
              <div className="mt-1 text-2xl font-bold">
                {Number.parseFloat(amount).toLocaleString()} {fromCurrency} ={" "}
                {result.toLocaleString(undefined, { maximumFractionDigits: 2 })} {toCurrency}
                {fee !== "0" && (
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    (including {fee}% fee)
                  </span>
                )}
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                1 {fromCurrency} = {getExchangeRate(fromCurrency, toCurrency).toFixed(4)} {toCurrency}
              </div>
            </div>
          )}
        </CardFooter>
      </Card>
      <div>
        <CurrencyRates />
      </div>
    </div>
  )
}

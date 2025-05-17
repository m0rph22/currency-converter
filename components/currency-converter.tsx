"use client"

import { useState } from "react"
import { ArrowRightLeft, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CurrencyRates } from "@/components/currency-rates"

const currencies = [
  { code: "UAH", name: "Ukrainian Hryvnia" },
  { code: "USD", name: "U.S. Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "British Pound" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "CNY", name: "Chinese Yuan" },
  { code: "CHF", name: "Swiss Franc" },
  { code: "AUD", name: "Australian Dollar" },
  { code: "CAD", name: "Canadian Dollar" },
]

const rates = {
  UAH: 2,
  USD: 92.5,
  EUR: 100.2,
  GBP: 117.8,
  JPY: 0.61,
  CNY: 12.8,
  CHF: 104.5,
  AUD: 61.2,
  CAD: 68.3,
}

export function CurrencyConverter() {
  const [amount, setAmount] = useState<string>("1")
  const [fromCurrency, setFromCurrency] = useState<string>("UAH")
  const [toCurrency, setToCurrency] = useState<string>("USD")
  const [result, setResult] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleConvert = () => {
    setIsLoading(true)

    setTimeout(() => {
      const fromRate = rates[fromCurrency as keyof typeof rates]
      const toRate = rates[toCurrency as keyof typeof rates]
      const calculatedResult = (Number.parseFloat(amount) * fromRate) / toRate

      setResult(calculatedResult)
      setIsLoading(false)
    }, 500)
  }

  const handleSwap = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
    setResult(null)
  }

  return (
    <div className="grid gap-8 md:grid-cols-3">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Convert currency</CardTitle>
          <CardDescription>Enter the amount and select currencies to convert</CardDescription>
        </CardHeader>
        <CardContent>
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
                    <Label htmlFor="date">Conversion date</Label>
                    <Input id="date" type="date" defaultValue={new Date().toISOString().split("T")[0]} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="fee">Conversion fee (%)</Label>
                    <Input id="fee" type="number" placeholder="0" defaultValue="0" />
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
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                1 {fromCurrency} ={" "}
                {(rates[fromCurrency as keyof typeof rates] / rates[toCurrency as keyof typeof rates]).toFixed(4)}{" "}
                {toCurrency}
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

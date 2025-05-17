"use client"

import { BarChart3, TrendingDown, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const popularRates = [
  { from: "USD", to: "UAH", rate: 36.5, change: 0.1 },
  { from: "UAH", to: "USD", rate: 0.027, change: -0.01 },
  { from: "EUR", to: "UAH", rate: 40.5, change: 0.2 },
  { from: "UAH", to: "EUR", rate: 0.025, change: -0.01 },
  { from: "USD", to: "EUR", rate: 0.85, change: 0.01 },
]

export function CurrencyRates() {
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
        <Tabs defaultValue="popular">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="all">All currencies</TabsTrigger>
          </TabsList>
          <TabsContent value="popular" className="mt-4">
            <div className="space-y-4">
              {popularRates.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="font-medium">
                      {item.from}/{item.to}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-2 font-semibold">{item.rate.toFixed(2)}</div>
                    <div className={`flex items-center text-xs ${item.change > 0 ? "text-green-500" : "text-red-500"}`}>
                      {item.change > 0 ? (
                        <TrendingUp className="mr-1 h-3 w-3" />
                      ) : (
                        <TrendingDown className="mr-1 h-3 w-3" />
                      )}
                      {Math.abs(item.change).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="all" className="mt-4">
            <div className="text-center text-sm text-muted-foreground">Loading all exchange rates...</div>
          </TabsContent>
        </Tabs>
        <div className="mt-6">
          <h3 className="mb-2 text-sm font-medium">Popular conversions</h3>
          <div className="grid grid-cols-2 gap-2">
            <button className="rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-accent">
              USD → UAH
            </button>
            <button className="rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-accent">
              UAH → USD
            </button>
            <button className="rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-accent">
              EUR → UAH
            </button>
            <button className="rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-accent">
              UAH → EUR
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

import { CurrencyConverter } from "@/components/currency-converter"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-200 to-white">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Currency converter</h1>
          <p className="text-gray-600">Fast and convenient transfer from one currency to another</p>
        </header>
        <main>
          <CurrencyConverter />
        </main>
        <footer className="mt-16 text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} Currency converter. Rates are updated every hour.</p>
        </footer>
      </div>
    </div>
  )
}

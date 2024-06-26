"use client"

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { CopyIcon, ExternalLinkIcon } from 'lucide-react';
import { Alert, AlertDescription } from '../../../Components/Alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const CarbonCreditTradingPage = () => {
  const [selectedToken, setSelectedToken] = useState('BALLN');
  const [chartData, setChartData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch chart data and transactions
    fetchChartData();
    fetchTransactions();
  }, [selectedToken]);

  const fetchChartData = async () => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/coins/moss-carbon-credit/market_chart?vs_currency=usd&days=30');
      if (!response.ok) throw new Error('Failed to fetch chart data');
      const data = await response.json();
      setChartData(data.prices.map(([timestamp, price]) => ({
        date: new Date(timestamp).toISOString().split('T')[0],
        price: price,
      })));
    } catch (err) {
      console.error('Error fetching chart data:', err);
      setError('Failed to load chart data. Please try again later.');
    }
  };

  const fetchTransactions = async () => {
    // Simulated transaction data
    setTransactions([
      { time: '2h 24m ago', type: 'Buy', usd: 29.10, amount: 87.63, avax: 1.13, price: 0.3277, maker: '1e70e0' },
      { time: '4h 4m ago', type: 'Sell', usd: 161.42, amount: 493.67, avax: 6.36, price: 0.3275, maker: '292cd1' },
      // Add more transactions here
    ]);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Token Selection and Details */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Select Token</h2>
          <Select onValueChange={setSelectedToken} defaultValue={selectedToken}>
            <SelectTrigger className="w-full text-gray-600">
              <SelectValue placeholder="Select a token" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BALLN">BALLN</SelectItem>
              <SelectItem value="MCO2">MCO2</SelectItem>
            </SelectContent>
          </Select>

          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Address:</span>
                <span className="text-green-400">0x4Ac783816...F6698a912E <CopyIcon className="inline-block ml-2 cursor-pointer" size={16} /></span>
              </div>
              <div className="flex justify-between">
                <span>Name:</span>
                <span>Balin Chikn</span>
              </div>
              <div className="flex justify-between">
                <span>Symbol:</span>
                <span>BALLN</span>
              </div>
              <div className="flex justify-between">
                <span>Price USD:</span>
                <span>$0.3252</span>
              </div>
              
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-gray-700 p-3 rounded">
              <div className="text-sm text-gray-400">Liquidity</div>
              <div className="text-lg font-semibold">$10.3K</div>
            </div>
            <div className="bg-gray-700 p-3 rounded">
              <div className="text-sm text-gray-400">FDV</div>
              <div className="text-lg font-semibold">$32.5K</div>
            </div>
            <div className="bg-gray-700 p-3 rounded">
              <div className="text-sm text-gray-400">Supply</div>
              <div className="text-lg font-semibold">100.0K</div>
            </div>
            <div className="bg-gray-700 p-3 rounded">
              <div className="text-sm text-gray-400">AVAX</div>
              <div className="text-lg font-semibold">201.84</div>
            </div>
          </div>

          <div className="mt-6 flex space-x-4 text-black">
            <Button variant="outline" className="flex-1 ">
              <ExternalLinkIcon className="mr-2" size={16} /> Website
            </Button>
            <Button variant="outline" className="flex-1">
              <ExternalLinkIcon className="mr-2" size={16} /> Twitter
            </Button>
          </div>
        </div>

        {/* Chart */}
        <div className="lg:col-span-2 bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="mb-4 flex space-x-2">
            {['1M', '5M', '15M', '1H', '4H', 'D', 'W', 'M'].map((period) => (
              <Button key={period} variant="outline" size="sm">{period}</Button>
            ))}
          </div>
          {error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis dataKey="date" stroke="#4ade80" />
                  <YAxis stroke="#4ade80" />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                  <Line type="monotone" dataKey="price" stroke="#4ade80" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Transactions Table */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Transactions</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    {['Time', 'Type', 'USD', 'BALLN', 'AVAX', 'Price', 'Maker'].map((header) => (
                      <th key={header} className="px-4 py-2 text-left">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'}>
                      <td className="px-4 py-2">{tx.time}</td>
                      <td className={`px-4 py-2 ${tx.type === 'Buy' ? 'text-green-400' : 'text-red-400'}`}>{tx.type}</td>
                      <td className="px-4 py-2">${tx.usd.toFixed(2)}</td>
                      <td className="px-4 py-2">{tx.amount.toFixed(2)}</td>
                      <td className="px-4 py-2">{tx.avax.toFixed(4)}</td>
                      <td className="px-4 py-2">${tx.price.toFixed(4)}</td>
                      <td className="px-4 py-2">{tx.maker}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarbonCreditTradingPage;
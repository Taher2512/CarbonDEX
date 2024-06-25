"use client"

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpIcon, ArrowDownIcon, XIcon } from 'lucide-react';

const generateChartData = () => {
  return Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    price: Math.random() * 10 + 50,
  }));
};

const CarbonCreditListingPage = () => {
  const [chartData, setChartData] = useState(generateChartData());
  const [tokenAmount, setTokenAmount] = useState('');
  const [priceUSD, setPriceUSD] = useState('');
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(prevData => [
        ...prevData.slice(1),
        { date: new Date().toISOString().split('T')[0], price: Math.random() * 10 + 50 }
      ]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleCreateListing = (e) => {
    e.preventDefault();
    if (tokenAmount && priceUSD) {
      setListings([...listings, { id: Date.now(), amount: tokenAmount, price: priceUSD }]);
      setTokenAmount('');
      setPriceUSD('');
    }
  };

  const handleRemoveListing = (id) => {
    setListings(listings.filter(listing => listing.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-green-400">Create Carbon Credit Listing</h1>
          
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <form onSubmit={handleCreateListing} className="space-y-4">
              <div>
                <label htmlFor="tokenAmount" className="block text-sm font-medium text-gray-400 mb-1">Token Amount:</label>
                <input
                  type="number"
                  id="tokenAmount"
                  value={tokenAmount}
                  onChange={(e) => setTokenAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter token amount"
                />
              </div>
              <div>
                <label htmlFor="priceUSD" className="block text-sm font-medium text-gray-400 mb-1">Price in USD:</label>
                <input
                  type="number"
                  id="priceUSD"
                  value={priceUSD}
                  onChange={(e) => setPriceUSD(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter price in USD"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-md transition-colors"
              >
                Create Listing
              </button>
            </form>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-green-400">Market Overview</h2>
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
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-green-400">Your Listings</h2>
          <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Price (USD)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-600">
                {listings.map((listing) => (
                  <tr key={listing.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{listing.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${listing.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleRemoveListing(listing.id)}
                        className="text-red-400 hover:text-red-500 transition-colors"
                      >
                        <XIcon size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarbonCreditListingPage;
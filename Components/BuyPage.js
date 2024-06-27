

"use client";
import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  User,
  CreditCard,
  Briefcase,
  Settings,
  HelpCircle,
  CopyIcon,
  ExternalLinkIcon,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "./Navbar2";
import { motion } from "framer-motion";

const BuyPage = () => {
  const [selectedToken, setSelectedToken] = useState("CCT");
  const [chartData, setChartData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);
  const [myBalance, setMyBalance] = useState(100);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [buyAmount, setBuyAmount] = useState("");
  const [totalCost, setTotalCost] = useState(0);
  const [totalListings, setTotalListings] = useState(15);

  useEffect(() => {
    fetchChartData();
    fetchTransactions();
    const priceUpdateInterval = setInterval(fetchLatestPrice, 60000); // Update price every minute

    return () => clearInterval(priceUpdateInterval);
  }, [selectedToken]);

  useEffect(() => {
    setTotalCost(Number(buyAmount) * currentPrice);
  }, [buyAmount, currentPrice]);

  const fetchLatestPrice = async () => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=moss-carbon-credit&vs_currencies=usd');
      const data = await response.json();
      const latestPrice = data['moss-carbon-credit'].usd;
      setCurrentPrice(latestPrice);
    } catch (error) {
      console.error('Error fetching latest price:', error);
      setError('Failed to fetch the latest price. Please try again later.');
    }
  };

  const fetchChartData = async () => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/coins/moss-carbon-credit/market_chart?vs_currency=usd&days=30');
      const data = await response.json();
      const formattedData = data.prices.map(([timestamp, price]) => ({
        date: new Date(timestamp).toISOString().split('T')[0],
        price: price,
      }));
      setChartData(formattedData);
      // Set the current price to the latest price in the chart data
      setCurrentPrice(formattedData[formattedData.length - 1].price);
    } catch (error) {
      console.error('Error fetching chart data:', error);
      setError('Failed to fetch chart data. Please try again later.');
    }
  };

  const fetchTransactions = async () => {
    // Simulated transaction data
    setTransactions([
      {
        date: "2024-06-26",
        amount: 100,
        price: 10.5,
        total: 1050,
      },
      {
        date: "2024-06-25",
        amount: 50,
        price: 10.2,
        total: 510,
      },
    ]);
  };

  const handleBuy = () => {
    if (buyAmount && buyAmount > 0) {
      const newTransaction = {
        date: new Date().toISOString().split('T')[0],
        amount: Number(buyAmount),
        price: currentPrice,
        total: totalCost,
      };
      setTransactions([newTransaction, ...transactions]);
      setMyBalance(prevBalance => prevBalance + Number(buyAmount));
      setBuyAmount("");
      // Here you would typically also handle the actual purchase logic
      // For example, connecting to a smart contract or API
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8 px-80">
      <Navbar />
      {/* Account Overview section remains unchanged */}
      <motion.div
        className="bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
       <h2 className="text-2xl font-semibold mb-6 text-green-400 flex items-center">
            <User className="mr-2" /> Account Overview
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
            <div>
              <h3 className="text-lg font-medium mb-2 text-gray-300">
                Balance
              </h3>
              <p className="text-2xl font-bold text-green-500">
                {myBalance} CCT
                {/* ${accountValue.toFixed(2)} */}
              </p>
              <div className="mt-2 text-sm text-gray-400">
                <p>Value: ${(myBalance * currentPrice).toFixed(2)}</p>
                <p>Price: ${currentPrice.toFixed(2)} (per CCT)</p>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <h3 className="text-lg font-medium mb-2 text-gray-300">
                Account Stats
              </h3>
              <p className="text-sm text-gray-400">
                Total Listings: {totalListings}
              </p>
              <p className="text-sm text-gray-400">Account Type: Standard</p>
              <p className="text-sm text-gray-400">
                Member Since:{" "}
                {new Intl.DateTimeFormat("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                }).format(new Date())}
              </p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <motion.button
              className="flex flex-col items-center justify-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <CreditCard className="mb-2" />
              <span className="text-sm">Deposit</span>
            </motion.button>
            <motion.button
              className="flex flex-col items-center justify-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Briefcase className="mb-2" />
              <span className="text-sm">Withdraw</span>
            </motion.button>
            <motion.button
              className="flex flex-col items-center justify-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Settings className="mb-2" />
              <span className="text-sm">Settings</span>
            </motion.button>
            <motion.button
              className="flex flex-col items-center justify-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <HelpCircle className="mb-2" />
              <span className="text-sm">Support</span>
            </motion.button>
          </div>
      </motion.div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Token Selection, Details, and Buy Functionality */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Select Token</h2>
          <Select onValueChange={setSelectedToken} defaultValue={selectedToken}>
            <SelectTrigger className="w-full text-gray-600">
              <SelectValue placeholder="Select a token" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CCT">CCT</SelectItem>
              <SelectItem value="MCO2">MCO2</SelectItem>
            </SelectContent>
          </Select>

          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Address:</span>
                <span className="text-green-400">
                  0x4Ac783816...F6698a912E{" "}
                  <CopyIcon
                    className="inline-block ml-2 cursor-pointer"
                    size={16}
                  />
                </span>
              </div>
              <div className="flex justify-between">
                <span>Name:</span>
                <span>Moss Carbon Credit</span>
              </div>
              <div className="flex justify-between">
                <span>Symbol:</span>
                <span>{selectedToken}</span>
              </div>
              <div className="flex justify-between">
                <span>Price USD:</span>
                <span>${currentPrice.toFixed(4)}</span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Buy Carbon Credits</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="buyAmount" className="block text-sm font-medium text-gray-400">Amount to Buy</label>
                <Input
                  id="buyAmount"
                  type="number"
                  value={buyAmount}
                  onChange={(e) => setBuyAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="mt-1 text-gray-700"
                />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Cost: ${totalCost.toFixed(2)}</p>
              </div>
              <Button onClick={handleBuy} className="w-full bg-green-500 hover:bg-green-600">
                Buy {selectedToken}
              </Button>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="lg:col-span-2 bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="mb-4 flex space-x-2 text-black">
            {["1D", "1W", "1M", "3M", "1Y"].map((period) => (
              <Button key={period} variant="outline" size="sm">
                {period}
              </Button>
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
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "none",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#4ade80"
                    strokeWidth={2}
                    dot={false}
                  />
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
                    {["Date", "Amount of Tokens", "Price per Token", "Total Amount"].map((header) => (
                      <th key={header} className="px-4 py-2 text-left">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-gray-800" : "bg-gray-750"}
                    >
                      <td className="px-4 py-2">{tx.date}</td>
                      <td className="px-4 py-2">{tx.amount}</td>
                      <td className="px-4 py-2">${tx.price.toFixed(2)}</td>
                      <td className="px-4 py-2">${tx.total.toFixed(2)}</td>
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

export default BuyPage;
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CopyIcon, ExternalLinkIcon } from "lucide-react";
import { Alert, AlertDescription } from "./Alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useAddress, useContract, useSigner } from "@thirdweb-dev/react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../config";
import { format } from "date-fns";
import Navbar from "./Navbar2";
import { ethers } from "ethers";

const tokenAddress = "0x6F79b8D64C18A32a57D4899D2799898CeE1bdAAD";
const exchangeAddress = "0xCc0955FC5E618B9c70552B987292613B9bA9530D";
const priceFeedAddress = "0x694AA1769357215DE4FAC081bf1f309aDC325306";
const CarbonCreditToken = require("../src/app/utils/CarbonCreditToken.json");
const CarbonCreditExchange = require("../src/app/utils/CarbonCreditExchange.json");
const AggregatorV3InterfaceABI = require("../src/app/utils/AggregatorV3Interface.json");

const page = () => {
  const [listings, setListings] = useState([]);
  const [selectedToken, setSelectedToken] = useState("BALLN");
  const [chartData, setChartData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);

  const address = useAddress();
  const signer = useSigner();

  //   if (signer) console.log("Signer:",  signer.provider.getBalance(address));

  const { contract: token, isLoading: isTokenLoading } = useContract(
    tokenAddress,
    CarbonCreditToken.abi
  );
  const { contract: exchange, isLoading: isExchangeLoading } = useContract(
    exchangeAddress,
    CarbonCreditExchange.abi
  );
  const { contract: priceFeed, isLoading: isPriceFeedLoading } = useContract(
    priceFeedAddress,
    AggregatorV3InterfaceABI
  );

  useEffect(() => {
    // Fetch chart data and transactions
    fetchChartData();
    fetchTransactions();
  }, [selectedToken]);

  useEffect(() => {
    if (address) {
      const q = query(collection(db, "trades"), orderBy("createdAt", "desc"));

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const arr = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setListings(arr);
      });

      return () => unsubscribe();
    }
  }, [address]);

  const fetchChartData = async () => {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/moss-carbon-credit/market_chart?vs_currency=usd&days=30"
      );
      if (!response.ok) throw new Error("Failed to fetch chart data");
      const data = await response.json();
      setChartData(
        data.prices.map(([timestamp, price]) => ({
          date: new Date(timestamp).toISOString().split("T")[0],
          price: price,
        }))
      );
    } catch (err) {
      console.error("Error fetching chart data:", err);
      setError("Failed to load chart data. Please try again later.");
    }
  };

  const fetchTransactions = async () => {
    // Simulated transaction data
    setTransactions([
      {
        time: "2h 24m ago",
        type: "Buy",
        usd: 29.1,
        amount: 87.63,
        avax: 1.13,
        price: 0.3277,
        maker: "1e70e0",
      },
      {
        time: "4h 4m ago",
        type: "Sell",
        usd: 161.42,
        amount: 493.67,
        avax: 6.36,
        price: 0.3275,
        maker: "292cd1",
      },
      // Add more transactions here
    ]);
  };

  async function getLatestEthUsdPrice() {
    const priceFeed = new ethers.Contract(
      priceFeedAddress,
      AggregatorV3InterfaceABI,
      signer
    );
    const latestRoundData = await priceFeed.latestRoundData();
    const price = ethers.utils.formatUnits(latestRoundData.answer, 8);
    return Math.round(price);
  }

  const handleBuyListedTokens = async (amount, sellerUSDTokenPrice, seller) => {
    try {
      if (!address || !signer || !token || !exchange) {
        throw new Error(
          "Signer, provider, or contract instance is not properly initialized."
        );
      }

      const totalUSDPrice = ethers.utils.parseUnits(
        (amount * sellerUSDTokenPrice).toString(),
        18
      );
      const ethPrice = await getLatestEthUsdPrice();
      const priceInWei = totalUSDPrice.div(ethPrice);
      const newPriceInWei = priceInWei.add(
        ethers.utils.parseUnits("0.00001", 18)
      );

      console.log("Price in Wei:", newPriceInWei.toString());

      const tokenBalance = await token.call("balanceOf", [exchangeAddress]);
      const tokenAmount = ethers.utils.parseUnits(amount.toString(), 18);

      console.log("Token balance:", tokenBalance.toString());
      console.log("Token amount:", tokenAmount.toString());

      if (tokenBalance.lt(tokenAmount)) {
        alert("Not enough tokens available");
        return;
      }

      const accountBalance = await signer.provider.getBalance(address);
      console.log("Account balance:", accountBalance);
      if (accountBalance.lt(newPriceInWei)) {
        alert("Insufficient funds for the transaction");
        return;
      }

      try {
        console.log("Amount:", newPriceInWei.toString());
        // const gasEstimate = await exchange.estimateGas.buyListedTokens(
        //   amount,
        //   sellerUSDTokenPrice,
        //   seller,
        //   {
        //     value: newPriceInWei,
        //   }
        // );
        // console.log("Gas estimate:", gasEstimate);
        // const gasEstimate = await exchange.estimateGas("buyListedTokens", [
        //   amount,
        //   sellerUSDTokenPrice,
        //   seller,
        //   {
        //     value: newPriceInWei,
        //   },
        // ]);
        // console.log("Gas estimate:", gasEstimate);

        // const tx = await exchange.buyListedTokens(
        //   amount,
        //   sellerUSDTokenPrice,
        //   seller,
        //   {
        //     value: newPriceInWei,
        //     gasLimit: gasEstimate,
        //   }
        // );
        const tx = await exchange.call(
          "buyListedTokens",
          [amount, sellerUSDTokenPrice, seller],
          {
            value: newPriceInWei,
            // gasLimit: gasEstimate,
          }
        );
        alert("Tokens purchased successfully!");
      } catch (gasError) {
        console.error("Gas estimation failed:", gasError);
        alert("Gas estimation failed. See console for details.");
      }
    } catch (error) {
      console.error("Error buying tokens!", error);
      alert("Error buying tokens. Please try again later...", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <Navbar />
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
            {["1M", "5M", "15M", "1H", "4H", "D", "W", "M"].map((period) => (
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
                    {[
                      "Time",
                      "Type",
                      "USD",
                      "BALLN",
                      "AVAX",
                      "Price",
                      "Maker",
                    ].map((header) => (
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
                      className={
                        index % 2 === 0 ? "bg-gray-800" : "bg-gray-750"
                      }
                    >
                      <td className="px-4 py-2">{tx.time}</td>
                      <td
                        className={`px-4 py-2 ${
                          tx.type === "Buy" ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {tx.type}
                      </td>
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <h2 className="text-2xl font-semibold mb-4 text-green-400">
          Buy Carbon Credits
        </h2>
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Price (USD)
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600">
              {listings.map((listing) => (
                <tr key={listing.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {format(
                      new Date(listing.createdAt.toDate()),
                      "dd-MMM-yyyy"
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {listing.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    ${listing.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() =>
                        handleBuyListedTokens(
                          listing.amount,
                          listing.price,
                          listing.address
                        )
                      }
                      className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                    >
                      Buy
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default page;

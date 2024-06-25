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
import {
  User,
  CreditCard,
  Briefcase,
  Settings,
  HelpCircle,
  XIcon,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { Alert, AlertDescription } from "./Alert";
import { Card, CardHeader, CardContent, CardFooter } from "./Card";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "./Modal";
import { ConnectWallet, useAddress, useContract } from "@thirdweb-dev/react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "../config";
import { ethers } from "ethers";

const tokenAddress = "0x3bbD240FA226B967D7500A58d22EEBAA36B0c7Ed";
const exchangeAddress = "0x8af7B3cF7c97956a4DB75adB9738f422540C664b";
const priceFeedAddress = "0x694AA1769357215DE4FAC081bf1f309aDC325306";
const CarbonCreditToken = require("../src/app/utils/CarbonCreditToken.json");
const CarbonCreditExchange = require("../src/app/utils/CarbonCreditExchange.json");
const AggregatorV3InterfaceABI = require("../src/app/utils/AggregatorV3Interface.json");

function ListingPage() {
  const [chartData, setChartData] = useState([]);
  const [tokenAmount, setTokenAmount] = useState("");
  const [priceUSD, setPriceUSD] = useState("");
  const [listings, setListings] = useState([]);
  const [error, setError] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [portfolio, setPortfolio] = useState({
    credits: 100,
    cash: 5000,
    price: 10,
  });
  const [totalTrades, setTotalTrades] = useState(15);
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const address = useAddress();

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
    if (address) {
      const q = query(collection(db, "trades"), orderBy("createdAt", "desc"));

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const arr = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((item) => item.address === address);

        console.log("Fetched listings:", arr);
        setListings(arr);
      });

      return () => unsubscribe();
    }
  }, [address]);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/coins/moss-carbon-credit/market_chart?vs_currency=usd&days=30"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        const formattedData = data.prices.map(([timestamp, price]) => ({
          date: new Date(timestamp).toISOString().split("T")[0],
          price: price,
        }));
        setChartData(formattedData);

        if (formattedData.length > 0) {
          setCurrentPrice(formattedData[formattedData.length - 1].price);
        }
      } catch (err) {
        console.error("Error fetching chart data:", err);
        setError("Failed to load chart data. Please try again later.");
      }
    };

    fetchChartData();
  }, []);

  async function getLatestEthUsdPrice() {
    const priceFeed = new ethers.Contract(
      priceFeedAddress,
      AggregatorV3InterfaceABI,
      ""
    );
    const latestRoundData = await priceFeed.latestRoundData();
    const price = ethers.utils.formatUnits(latestRoundData.answer, 8);
    console.log(Math.round(price));
    setEthUsdPrice(Math.round(price));
    return Math.round(price);
  }

  const createListing = async (tokenAmount) => {
    const tokenAmountInWei = ethers.utils.parseUnits(
      tokenAmount.toString(),
      18
    );
    try {
      const tokenBalance = await token.call("balanceOf", [address]);
      console.log("Token balance:", tokenBalance.toString());
      const q = query(
        collection(db, "trades"),
        where("address", "==", address)
      );
      const querySnapshot = await getDocs(q);
      const totalListedTokens = querySnapshot.docs.reduce((acc, doc) => {
        const data = doc.data();
        const listedAmountInWei = ethers.utils.parseUnits(
          data.amount.toString(),
          18
        );
        return acc.add(listedAmountInWei);
      }, ethers.BigNumber.from(0));

      const availableBalance = tokenBalance.sub(totalListedTokens);
      if (availableBalance.lt(tokenAmountInWei)) {
        alert("Not enough tokens to list");
        return;
      }

      const approveTx = await token.call("approve", [
        exchangeAddress,
        tokenAmountInWei,
      ]);

      const allowance = await token.call("allowance", [
        address,
        exchangeAddress,
      ]);
      console.log("Allowance:", allowance.toString());

      const listingData = {
        address: address,
        amount: tokenAmount,
        price: priceUSD,
        status: 0,
        createdAt: serverTimestamp(), // Add this line to include a timestamp
      };
      let res = await addDoc(collection(db, "trades"), listingData);
      setTokenAmount("");
      setPriceUSD("");
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
      setTotalTrades(totalTrades + 1);
      console.log(res);
    } catch (error) {
      console.error("Error creating listing:", error);
    }
  };

  const handleCreateListing = async (e) => {
    e.preventDefault();
    if (tokenAmount && priceUSD) {
      try {
        await createListing(tokenAmount);
      } catch (error) {
        console.error("Error creating listing:", error);
        alert("Failed to create listing.");
      }
    }
  };

  const handleRemoveListing = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const confirmRemoveListing = async () => {
    try {
      await deleteDoc(doc(db, "trades", selectedId));
      setShowModal(false);
    } catch (error) {
      console.error("Error removing listing or reducing allowance:", error);
    }
  };

  const accountValue = portfolio.credits * portfolio.price + portfolio.cash;

  return (
    <div>
      <ConnectWallet />
      <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-green-400">
              Carbon Credit Listing
            </h1>
          </header>

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
                  ${accountValue.toFixed(2)}
                </p>
                <div className="mt-2 text-sm text-gray-400">
                  <p>Cash: ${portfolio.cash.toFixed(2)}</p>
                  <p>
                    Credits: {portfolio.credits} ($
                    {(portfolio.credits * portfolio.price).toFixed(2)})
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <h3 className="text-lg font-medium mb-2 text-gray-300">
                  Account Stats
                </h3>
                <p className="text-sm text-gray-400">
                  Total Trades: {totalTrades}
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-gray-800 shadow-lg">
                <CardHeader>
                  <h2 className="text-xl font-semibold text-green-400">
                    Create Listing
                  </h2>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateListing} className="space-y-4">
                    <div>
                      <label
                        htmlFor="tokenAmount"
                        className="block text-sm font-medium text-gray-400 mb-1"
                      >
                        Token Amount:
                      </label>
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
                      <label
                        htmlFor="priceUSD"
                        className="block text-sm font-medium text-gray-400 mb-1"
                      >
                        Price in USD:
                      </label>
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
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-gray-800 shadow-lg h-full">
                <CardHeader>
                  <h2 className="text-xl font-semibold text-green-400">
                    Transaction Overview
                  </h2>
                </CardHeader>
                <CardContent>
                  {tokenAmount && priceUSD ? (
                    <>
                      <p className="flex items-center mb-2">
                        <DollarSign className="mr-2" /> Amount: {tokenAmount}{" "}
                        tokens
                      </p>
                      <p className="flex items-center mb-2">
                        <TrendingUp className="mr-2" /> Price: ${priceUSD}
                      </p>
                      <p className="flex items-center font-bold">
                        <DollarSign className="mr-2" /> Total: $
                        {(
                          parseFloat(tokenAmount) * parseFloat(priceUSD)
                        ).toFixed(2)}
                      </p>
                    </>
                  ) : (
                    <p className="text-gray-400">
                      Enter token amount and price to see transaction details.
                    </p>
                  )}
                </CardContent>
                {tokenAmount && priceUSD && (
                  <CardFooter>
                    <button
                      onClick={handleCreateListing}
                      className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-md transition-colors"
                    >
                      Confirm Listing
                    </button>
                  </CardFooter>
                )}
              </Card>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">
            <motion.div
              className="lg:col-span-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="bg-gray-800 shadow-lg">
                <CardHeader>
                  <h2 className="text-xl font-semibold text-green-400">
                    Market Overview
                  </h2>
                </CardHeader>
                <CardContent>
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
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="bg-gray-800 shadow-lg">
                <CardHeader>
                  <h2 className="text-xl font-semibold text-green-400">
                    Current Price
                  </h2>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-center">
                    ${currentPrice ? currentPrice.toFixed(2) : "-"}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h2 className="text-2xl font-semibold mb-4 text-green-400">
              Your Listings
            </h2>
            <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Price (USD)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-600">
                  {listings.map((listing) => (
                    <tr key={listing.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {listing.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ${listing.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleRemoveListing(listing.id)}
                          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {showSuccessAlert && (
            <Alert className="mt-4 bg-green-500 text-white">
              <AlertDescription>Listing created successfully!</AlertDescription>
            </Alert>
          )}

          {showModal && (
            <Modal onClose={() => setShowModal(false)}>
              <ModalHeader>Confirm Removal</ModalHeader>
              <ModalBody>
                Are you sure you want to remove this listing?
              </ModalBody>
              <ModalFooter>
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRemoveListing}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                >
                  Confirm
                </button>
              </ModalFooter>
            </Modal>
          )}
        </div>
      </div>
    </div>
  );
}

export default ListingPage;

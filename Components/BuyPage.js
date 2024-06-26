"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
import {
  ConnectWallet,
  useAddress,
  useContract,
  useSigner,
} from "@thirdweb-dev/react";
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
import Navbar from "./Navbar2";
import { format } from "date-fns";
import Footer from "./Footer";

const tokenAddress = "0x2181dCA9782E00C217D9a0e9570919A39EF530d8";
const exchangeAddress = "0x2f5e216a8096e6e65228Fab61a1e3D246f718c0E";
const priceFeedAddress = "0x4aDC67696bA383F43DD60A9e78F2C97Fbbfc7cb1";
const CarbonCreditTokenABI = require("../src/app/utils/CarbonCreditToken.json");
const CarbonCreditExchangeABI = require("../src/app/utils/CarbonCreditExchange.json");
const AggregatorV3InterfaceABI = require("../src/app/utils/AggregatorV3Interface.json");

function BuyPage() {
  const [chartData, setChartData] = useState([]);
  const [tokenAmount, setTokenAmount] = useState("");
  const [priceUSD, setPriceUSD] = useState("");
  const [purchases, setPurchases] = useState([]);
  const [error, setError] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [portfolio, setPortfolio] = useState({
    credits: 100,
    cash: 5000,
    price: 10,
  });
  const [totalPurchases, setTotalPurchases] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [myBalance, setMyBalance] = useState(0);
  const [ethUsdPrice, setEthUsdPrice] = useState(0);

  const address = useAddress();
  const signer = useSigner();

  const { contract: token, isLoading: isTokenLoading } = useContract(
    tokenAddress,
    CarbonCreditTokenABI
  );
  const { contract: exchange, isLoading: isExchangeLoading } = useContract(
    exchangeAddress,
    CarbonCreditExchangeABI
  );
  const { contract: priceFeed, isLoading: isPriceFeedLoading } = useContract(
    priceFeedAddress,
    AggregatorV3InterfaceABI
  );

  const getMyBalance = async () => {
    if (address && token) {
      try {
        const balance = await token.call("balanceOf", [address]);
        setMyBalance(ethers.utils.formatUnits(balance.toString(), 18));
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    }
  };

  useEffect(() => {
    if (address) {
      const q = query(
        collection(db, "purchases"),
        orderBy("createdAt", "desc")
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const arr = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((item) => item.address === address);

        setPurchases(arr);
        setTotalPurchases(arr.length);
      });
      getMyBalance();

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
          date: format(new Date(timestamp), "dd-MMM-yy"),
          price: price * 100,
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

    getMyBalance();
    fetchChartData();
  }, []);

  async function getLatestEthUsdPrice() {
    const priceFeed = new ethers.Contract(
      priceFeedAddress,
      AggregatorV3InterfaceABI,
      signer
    );
    const latestRoundData = await priceFeed.latestRoundData();
    const price = ethers.utils.formatUnits(latestRoundData.answer, 8);
    setEthUsdPrice(Math.round(price));
    return Math.round(price);
  }

  const buyTokens = async (tokenAmount, tokenPrice) => {
    try {
      const totalUSDPrice = ethers.utils.parseUnits(
        (tokenAmount * Math.round(tokenPrice)).toString(),
        18
      );
      const ethPrice = await getLatestEthUsdPrice();
      const priceInWei = totalUSDPrice.div(ethPrice);
      const newPriceInWei = priceInWei.add(
        ethers.utils.parseUnits("0.00001", 18)
      );

      const accountBalance = await signer.provider.getBalance(address);
      if (accountBalance.lt(newPriceInWei)) {
        alert("Insufficient funds for the transaction");
        return;
      }

      const tx = await exchange.call(
        "buyTokens",
        [tokenAmount, Math.round(tokenPrice)],
        {
          value: newPriceInWei,
        }
      );
      setMyBalance((Number(myBalance) + Number(tokenAmount)).toFixed(1));
      alert("Tokens purchased successfully!");

      const purchaseData = {
        address: address,
        amount: tokenAmount,
        price: tokenPrice.toFixed(2),
        status: 0,
        createdAt: serverTimestamp(),
      };
      let res = await addDoc(collection(db, "purchases"), purchaseData);
      setTokenAmount("");
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
      setTotalPurchases(totalPurchases + 1);
    } catch (error) {
      console.error("Error making purchase:", error);
    }
  };

  const handleBuyTokens = async () => {
    if (tokenAmount) {
      try {
        await buyTokens(tokenAmount, currentPrice);
      } catch (error) {
        console.error("Error creating listing:", error);
        alert("Enter token amount");
      }
    }
  };

  const handleRemoveListing = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const confirmRemoveListing = async () => {
    try {
      await deleteDoc(doc(db, "listings", selectedId));
      setShowModal(false);
    } catch (error) {
      console.error("Error removing listing or reducing allowance:", error);
    }
  };

  const accountValue = portfolio.credits * portfolio.price + portfolio.cash;

  return (
    <div>
      <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <Navbar />
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-green-400">
              Carbon Credit Buying
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
                  {myBalance} CCT
                  {/* ${accountValue.toFixed(2)} */}
                </p>
                <div className="mt-2 text-sm text-gray-400">
                  <p>Value: ${(myBalance * currentPrice).toFixed(2)}</p>
                  <p>Price: ${currentPrice.toFixed(2)} (per CCT)</p>
                </div>
              </div>

              <div className="flex flex-col items-start sm:items-end">
                <h3 className="text-lg font-medium mb-2 text-gray-300">
                  Account Stats
                </h3>
                <p className="text-sm text-gray-400">
                  Total Purchases: {totalPurchases}
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
              <Card className="bg-gray-800 shadow-lg h-full">
                <CardHeader className="flex flex-row items-center">
                  <h2 className="text-xl font-semibold text-green-400 mr-3">
                    Buy Carbon Credits
                  </h2>
                  <h2 className="text-sm text-gray-400">
                    (Price: ${currentPrice.toFixed(2)})
                  </h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
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
                  </div>
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
                  {tokenAmount ? (
                    <>
                      <p className="flex items-center mb-2">
                        <DollarSign className="mr-2" /> Amount: {tokenAmount}{" "}
                        tokens
                      </p>
                      <p className="flex items-center mb-2">
                        <TrendingUp className="mr-2" /> Price: $
                        {currentPrice.toFixed(2)}
                      </p>
                      <p className="flex items-center font-bold">
                        <DollarSign className="mr-2" /> Total: $
                        {(parseFloat(tokenAmount) * currentPrice).toFixed(2)}
                      </p>
                    </>
                  ) : (
                    <p className="text-gray-400">
                      Enter token amount to see transaction details.
                    </p>
                  )}
                </CardContent>
                {tokenAmount && (
                  <CardFooter>
                    <button
                      onClick={() => {
                        if (address) {
                          handleBuyTokens();
                        } else {
                          alert("Please connect your wallet");
                        }
                      }}
                      className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-md transition-colors"
                    >
                      Confirm Purchase
                    </button>
                  </CardFooter>
                )}
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h2 className="text-2xl font-semibold mb-4 text-green-400">
              Purchase History
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-600">
                  {purchases.map((purchase) => (
                    <tr key={purchase.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-gray-400">
                        {purchase.createdAt &&
                          purchase.createdAt.toDate() &&
                          format(
                            new Date(purchase.createdAt.toDate()),
                            "dd-MMM-yyyy"
                          )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {purchase.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        ${purchase.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {totalPurchases === 0 && (
                <div className="p-4 text-center text-green-400">
                  You have no purchases
                </div>
              )}
            </div>
          </motion.div>

          {showSuccessAlert && (
            <Alert className="mt-4 bg-green-500 text-white">
              <AlertDescription>Purchase made successfully!</AlertDescription>
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
      <Footer />
    </div>
  );
}

export default BuyPage;

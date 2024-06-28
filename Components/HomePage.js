"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart2,
  Globe,
  RefreshCw,
  Shield,
  Wallet,
  Menu,
  X,
} from "lucide-react";

import { ConnectWallet } from "@thirdweb-dev/react";

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollPosition(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Marketplace", path: "/marketplace" },
    { name: "Sell", path: "/sell" },
    { name: "Tokenise", path: "/tokenise" },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <header
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrollPosition > 50
            ? "bg-gray-900/90 backdrop-blur-md py-2"
            : "bg-transparent py-4"
        }`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="text-3xl font-bold text-green-400">
            CarbonDex
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className="text-gray-300 hover:text-green-400 transition-colors duration-300"
              >
                {item.name}
              </Link>
            ))}
            {/* <button className="bg-green-500 text-gray-900 px-4 py-2 rounded-full text-sm font-semibold hover:bg-green-400 transition-all duration-300 transform hover:scale-105 flex items-center">
              <Wallet className="mr-2 h-4 w-4" /> Connect Wallet
            </button> */}
            <ConnectWallet
              style={{ backgroundColor: "rgb(22 163 74)", borderWidth: 0 }}
              theme={"light"}
            />
          </nav>
          <button
            className="md:hidden text-gray-300 hover:text-green-400 transition-colors duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 bg-gray-900 transform ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out md:hidden`}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className="text-2xl text-gray-300 hover:text-green-400 transition-colors duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <button className="bg-green-500 text-gray-900 px-6 py-3 rounded-full text-lg font-semibold hover:bg-green-400 transition-all duration-300 transform hover:scale-105 flex items-center">
            <Wallet className="mr-2 h-5 w-5" /> Connect Wallet
          </button>
        </div>
      </div>

      <main className="pt-20">
        <section className="h-screen flex items-center justify-center text-center px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center opacity-20"></div>
          <div className="relative z-10 max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight">
              Revolutionizing Carbon Credit Trading
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 mb-10">
              Seamless. Transparent. Impactful.
            </p>
            <button className="bg-green-500 text-gray-900 px-8 py-4 rounded-full text-lg font-semibold hover:bg-green-400 transition-all duration-300 transform hover:scale-105">
              Get Started
            </button>
          </div>
        </section>

        <section id="features" className="py-20 bg-gray-800">
          <div className="container mx-auto px-4">
            <h3 className="text-4xl font-bold text-center mb-16 text-white">
              Key Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <Globe className="w-16 h-16 text-green-400 mb-6" />,
                  title: "Global Marketplace",
                  description: "Connect with buyers and sellers worldwide",
                },
                {
                  icon: <BarChart2 className="w-16 h-16 text-green-400 mb-6" />,
                  title: "Real-time Analytics",
                  description:
                    "Make informed decisions with up-to-date market data",
                },
                {
                  icon: <Shield className="w-16 h-16 text-green-400 mb-6" />,
                  title: "Secure Transactions",
                  description: "Blockchain-backed security for all trades",
                },
                {
                  icon: <RefreshCw className="w-16 h-16 text-green-400 mb-6" />,
                  title: "Automated Matching",
                  description: "Efficient pairing of buyers and sellers",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="text-center p-8 bg-gray-700 rounded-lg shadow-lg border border-gray-600 transform transition-all duration-300 hover:scale-105 hover:bg-gray-600"
                >
                  {feature.icon}
                  <h4 className="text-2xl font-semibold mb-4 text-white">
                    {feature.title}
                  </h4>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-20 bg-gray-900">
          <div className="container mx-auto px-4">
            <h3 className="text-4xl font-bold text-center mb-16 text-white">
              How It Works
            </h3>
            <div className="max-w-3xl mx-auto">
              {[
                "Register and verify your account",
                "List your carbon credits or browse available offerings",
                "Use our advanced matching algorithm to find the best deals",
                "Complete secure transactions with blockchain technology",
                "Track your impact and receive detailed reports",
              ].map((step, index) => (
                <div key={index} className="flex items-center mb-12 group">
                  <div className="bg-green-500 text-gray-900 rounded-full w-12 h-12 flex items-center justify-center mr-6 text-xl font-bold transition-all duration-300 group-hover:scale-110">
                    {index + 1}
                  </div>
                  <p className="text-xl text-gray-300 group-hover:text-green-400 transition-colors duration-300">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="py-20 bg-gray-800 text-center">
          <div className="container mx-auto px-4">
            <h3 className="text-4xl font-bold mb-8 text-white">
              Ready to Make a Difference?
            </h3>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Join CarbonDex today and be part of the solution. Together, we can
              create a sustainable future.
            </p>
            <button className="bg-green-500 text-gray-900 px-8 py-4 rounded-full text-lg font-semibold hover:bg-green-400 transition-all duration-300 transform hover:scale-105 flex items-center mx-auto">
              Get Started Now <ArrowRight className="ml-2" />
            </button>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; 2024 CarbonDex. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              href="/privacy-policy"
              className="hover:text-green-400 transition-colors duration-300"
            >
              Privacy Policy
            </Link>
            <Link
              href="/privacy-policy"
              className="hover:text-green-400 transition-colors duration-300"
            >
              Terms of sevice
            </Link>
            <Link
              href="/privacy-policy"
              className="hover:text-green-400 transition-colors duration-300"
            >
              Contact Us
            </Link>
            
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
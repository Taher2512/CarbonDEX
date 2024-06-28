"use client";

import React from "react";
import { ThirdwebProvider, metamaskWallet } from "@thirdweb-dev/react";
import HomePage from "../../Components/HomePage";

const LandingPage = () => {
  return (
    <ThirdwebProvider
      clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}
      // activeChain={"base-sepolia-testnet"}
      activeChain={"sepolia"}
      // supportedWallets={[coinbaseWallet()]}
      supportedWallets={[metamaskWallet()]}
    >
      <HomePage />
    </ThirdwebProvider>
  );
};

export default LandingPage;
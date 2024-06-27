"use client";

import React from "react";
import { ThirdwebProvider, metamaskWallet } from "@thirdweb-dev/react";
import MarketplacePage from "../../../Components/MarketplacePage";

const CarbonCreditListingPage = () => {
  return (
    <ThirdwebProvider
      clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}
      // activeChain={"base-sepolia-testnet"}
      activeChain={"sepolia"}
      // supportedWallets={[coinbaseWallet()]}
      supportedWallets={[metamaskWallet()]}
    >
      <MarketplacePage />
    </ThirdwebProvider>
  );
};

export default CarbonCreditListingPage;

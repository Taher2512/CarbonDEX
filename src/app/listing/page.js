"use client";

import React from "react";
import { ThirdwebProvider, metamaskWallet } from "@thirdweb-dev/react";
import ListingPage from "../../../Components/ListingPage";

const page = () => {
  return (
    <ThirdwebProvider
      clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}
      // activeChain={"base-sepolia-testnet"}
      activeChain={"sepolia"}
      // supportedWallets={[coinbaseWallet()]}
      supportedWallets={[metamaskWallet()]}
    >
      <ListingPage />
    </ThirdwebProvider>
  );
};

export default page;

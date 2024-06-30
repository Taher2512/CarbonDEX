"use client";

import React from "react";
import { ThirdwebProvider, coinbaseWallet } from "@thirdweb-dev/react";
import BuyPage from "../../../Components/BuyPage";

const Buy = () => {
  return (
    <ThirdwebProvider
      clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}
      activeChain={"base-sepolia-testnet"}
      supportedWallets={[coinbaseWallet()]}
    >
      <BuyPage />
    </ThirdwebProvider>
  );
};

export default Buy;

"use client"
import { ThirdwebProvider, metamaskWallet } from '@thirdweb-dev/react'
import React from 'react'
import Stepper from '../../../Components/Stepper'

export default function page({searchParams}) {
    const serialNo = searchParams.serialNo;
    const address = searchParams.address;
  return (
    <ThirdwebProvider
    clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}
      activeChain={"base-sepolia-testnet"}
      // activeChain={"sepolia"}
      // supportedWallets={[coinbaseWallet()]}
      supportedWallets={[metamaskWallet()]}
    >
   <main className="w-screen h-screen bg-gray-900">
    <Stepper contractAddress={process.env.NEXT_TOKENIZE_ADDRESS} address={address} serialNo={serialNo} />
    </main>
    </ThirdwebProvider>
  )
}

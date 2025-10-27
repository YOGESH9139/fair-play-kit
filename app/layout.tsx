'use client'

import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { WalletProvider, WalletManager, NetworkId, WalletId } from '@txnlab/use-wallet-react';

const walletManager = new WalletManager({
  wallets: [
    WalletId.PERA,
    WalletId.DEFLY,
    WalletId.EXODUS,
    // Add more as needed
  ],
  defaultNetwork: NetworkId.TESTNET, // or MAINNET
});

const algodConfig = {
  algodServer: "https://testnet-api.algonode.cloud",
  algodToken: "",
  algodPort: "",
};

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

const Metadata = {
  title: "Fair Play Kit - Provably Fair Gaming for Algorand",
  description:
    "A plug-and-play module that adds verifiable randomness, secure escrow, and commit-reveal fairness to any blockchain game",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <WalletProvider manager={walletManager}>
        {children}
        <Analytics />
        </WalletProvider>
      </body>
    </html>
  )
}

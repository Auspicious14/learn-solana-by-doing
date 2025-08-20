"use client";
import { useState } from "react";
import { useSolanaState } from "@/provider/context";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { BalanceCheckerPage } from "@/modules/wallet-balance/page";

export default function BalanceChecker() {
  
  return (
    <BalanceCheckerPage />
  );
}

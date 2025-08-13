import { createSolanaRpc, mainnet } from "@solana/kit";
import React from "react";

export const solanaProvider = () => {
  const rpc = createSolanaRpc(mainnet("https://api.mainnnet-beta.solana.com"));
  return <div>solanaProvider</div>;
};

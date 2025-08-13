import { Inter } from "next/font/google";
import { useState } from "react";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div>
        <h1>Hey, My name is Abdulganiyu, friends call me Auspicious.</h1>
        <p>Below are the list of projects I have built whilst learning Solana/p>

          <div>
          <Link href="/balance-checker">Wallet Balance Checker </Link>
          </div>
      </div>
    </main>
  );
}

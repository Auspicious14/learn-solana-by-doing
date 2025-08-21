import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-center p-6 sm:p-12 md:p-24 bg-gradient-to-b from-gray-900 to-gray-800 text-white ${inter.className}`}
    >
      <div className="max-w-2xl w-full text-center space-y-8">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          Hey, I'm Abdulganiyu
        </h1>
        <p className="text-lg sm:text-xl text-gray-300">
          Friends call me <span className="font-semibold text-blue-400">Auspicious</span>. Welcome to my Solana journey!
        </p>
        <p className="text-base sm:text-lg text-gray-400">
          Below are some projects I've built while learning Solana development.
        </p>

        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">My Projects</h2>
          <div className="flex flex-col gap-4">
            <Link
              href="/balance-checker"
              className="block px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200 text-center"
            >
              Wallet Balance Checker
            </Link>
            <Link
              href="/nft-viewer"
              className="block px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200 text-center"
            >
              NFT Portfolio Viewer
            </Link>
          
          </div>
        </div>

        <div className="mt-8">
          <p className="text-gray-400 text-sm">
            Want to connect? Find me on{" "}
            <Link
              href="https://x.com/@_auspy_"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              X
            </Link>{" "}
            or check out my{" "}
            <Link
              href="https://github.com/Auspicious14"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              GitHub
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
}

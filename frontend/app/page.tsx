"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import CardItem from "@/components/CardItem";
import axios from "axios";
import "./page.css"; // Ensure this file exists and is correctly linked
import path from "path";

const Page: React.FC = () => {
  const router = useRouter();
  const pathname=usePathname();

  // Navigation Handlers
  const navigateTo = (path: string) => router.push(path);

  const showRankings = () => navigateTo("/Rankings");
  const showLiveCrypto = () => navigateTo("/LiveCrypto");
  const showWatchlist = () => navigateTo("/Watchlist");

  // News Headlines
  const [headlines] = useState<string[]>([
    "Bitcoin hits new all-time high!",
    "Ethereum gas fees surge due to increased activity!",
    "Dogecoin spikes 20% after Elon Musk tweet!",
    "Crypto market sees major volatility today!",
    "SEC considers new crypto regulations!",
  ]);

  // Global Crypto Data
  const [globalData, setGlobalData] = useState<any>(null);
  const [coins, setCoins] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);

  const fetchGlobalData = async () => {
    try {
      const { data } = await axios.get("https://api.coingecko.com/api/v3/global");
      setGlobalData(data.data);
    } catch (error) {
      setGlobalData([]);
      console.error("Error fetching global crypto data:", error);
    }
  };

  const fetchCoins = async () => {
    try {
      const { data } = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
        params: {
          vs_currency: "usd",
          order: "market_cap_desc",
          per_page: 30,
          page: 1,
          sparkline: false,
        },
      });
      setCoins(data);
    } catch (error) {
      setCoins([]);
      console.error("Error fetching coins:", error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await axios.get("https://api.blockchair.com/bitcoin/transactions");

      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        setTransactions(response.data.data.slice(0, 10));
      } else {
        console.error("Unexpected API response structure:", response.data);
      }
    } catch (error) {
      setTransactions([]);
      console.error("Error fetching blockchain transactions:", error);
    }
  };
  const RouteToLogin=()=>{
    if(!localStorage.getItem("token")){
      pathname==="/login"?router.push("/login"):router.push("/login");
    }
  };
  useEffect(() => {
    fetchGlobalData();
    fetchCoins();
    fetchTransactions();
  }, []);

  return (
    <div className="page-content">
      <div className="container text-center">
        
        {/* Heading */}
        <h1 className="crypto-heading">
          Track Coins & Get More Insights on CryptATS
        </h1>

        {/* Cards */}
        <div className="row justify-content-center" onClick={()=>{RouteToLogin()}}>
          {[
            {
              id: 1,
              title: "Rankings",
              description: "View crypto rankings",
              onClick: showRankings,
              image: "/ranking.png",
            },
            {
              id: 2,
              title: "Live Crypto",
              description: "Track live prices",
              onClick: showLiveCrypto,
              image: "/livecryto.png",
            },
            {
              id: 3,
              title: "My Watchlist",
              description: "Manage your favorites",
              onClick: showWatchlist,
              image: "/watchlist.png",
            },
          ].map((card) => (
            <div key={card.id} className="col-md-4 d-flex justify-content-center align-items-center">
              <CardItem card={card} />
            </div>
          ))}
        </div>
      </div>



      

      {/* Global Crypto Stats */}
      <div className="global-stats">
  {globalData ? (
    <div className="stats-container">
      {globalData.active_cryptocurrencies && (
        <p className="stat-item">
          <strong>Coins:</strong> {globalData.active_cryptocurrencies}
        </p>
      )}
      {globalData.markets && (
        <p className="stat-item">
          <strong>Exchanges:</strong> {globalData.markets}
        </p>
      )}
      {globalData.total_market_cap?.usd && (
        <p className="stat-item">
          <strong>Market Cap:</strong> ${globalData.total_market_cap.usd.toLocaleString()} 
          {globalData.market_cap_change_percentage_24h?.usd !== undefined && (
            <span
              className={globalData.market_cap_change_percentage_24h.usd < 0 ? "market-down" : "market-up"}
            >
              {globalData.market_cap_change_percentage_24h.usd.toFixed(1)}%
            </span>
          )}
        </p>
      )}
      {globalData.total_volume?.usd && (
        <p className="stat-item">
          <strong>24h Vol:</strong> ${globalData.total_volume.usd.toLocaleString()}
        </p>
      )}
      {(globalData.market_cap_percentage?.btc !== undefined || globalData.market_cap_percentage?.eth !== undefined) && (
        <p className="stat-item">
          <strong>Dominance:</strong>
          {globalData.market_cap_percentage?.btc !== undefined && ` BTC ${globalData.market_cap_percentage.btc.toFixed(1)}%`}
          {globalData.market_cap_percentage?.eth !== undefined && ` ETH ${globalData.market_cap_percentage.eth.toFixed(1)}%`}
        </p>
      )}
    </div>
  ) : (
    <p>Loading market data...</p>
  )}
</div>

      {/* News Ticker */}
      <div className="news-ticker">
        <div className="ticker-wrapper">
          <div className="ticker-content">
            {headlines.map((headline, index) => (
              <span key={index} className="ticker-item">{headline}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Explore Cryptocurrencies */}
      <div className="explore-section">
        <h2 className="explore-heading">Explore Cryptocurrencies</h2>
        <div className="coin-grid">
          {coins.map((coin) => (
            <a key={coin.id} href={coin.links?.homepage?.[0] || `https://www.coingecko.com/en/coins/${coin.id}`} target="_blank" rel="noopener noreferrer" className="coin-item">
              <img src={coin.image} alt={coin.name} className="coin-logo" />
              <span className="coin-name">{coin.name}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Blockchain Transactions */}

      <div className="transactions-section">
  <h2>Recent Bitcoin Transactions</h2>
  {transactions.length > 0 ? (
    <table className="transactions-table">
      <thead>
        <tr>
          <th>Hash</th>
          <th>Value (BTC)</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((tx, index) => (
          <tr key={index}>
            <td className="hash-cell">{tx.hash}</td>
            <td>{tx.value ? tx.value.toFixed(6) : ""} BTC</td>

          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p>Loading transactions...</p>
  )}
</div>



      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          {["Products", "Company", "Support", "Socials"].map((section, index) => (
            <div key={index} className="footer-section">
              <h4>{section}</h4>
              <ul>
                {[
                  ["Academy", "Advertise", "CMC Labs", "Bitcoin ETFs", "Crypto API", "DexScan", "Global Charts", "NFT"],
                  ["About us", "Terms of use", "Privacy Policy", "Cookie preferences", "Cookie policy", "Community Rules", "Disclaimer", "Methodology", "Careers"],
                  ["Get Listed", "Request Form", "Contact Support", "FAQ", "Glossary"],
                  ["X (Twitter)", "Community", "Telegram", "Instagram", "Facebook", "Reddit", "LinkedIn"]
                ][index].map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
};

export default Page;

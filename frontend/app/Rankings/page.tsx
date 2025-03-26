"use client";

import { useEffect, useState } from "react";
import "./style.css"; // Import the custom CSS with glass effect

interface Coin {
  id: string;
  name: string;
  current_price: number;
  market_cap: number;
  price_change_percentage_24h: number;
  image: string;
}

const Rankings = () => {
  const [coins, setCoins] = useState<Coin[] | null>(null);
  const [fearGreedIndex, setFearGreedIndex] = useState<number | null>(null);
  const [dominantCoin, setDominantCoin] = useState<Coin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [coinsResponse, fearGreedResponse] = await Promise.allSettled([
          fetch(
            "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1&sparkline=false"
          ),
          new Promise((resolve) => setTimeout(resolve, 1500)).then(() =>
            fetch("https://api.alternative.me/fng/")
          ),
        ]);

        // Handle Coin Data Response
        if (coinsResponse.status === "fulfilled" && coinsResponse.value.ok) {
          const coinsData: Coin[] = await coinsResponse.value.json();
          setCoins(coinsData);

          if (coinsData.length > 0) {
            setDominantCoin(
              coinsData.reduce((prev, current) =>
                prev.market_cap > current.market_cap ? prev : current
              )
            );
          }
        } else {
          throw new Error(
            `Failed to fetch CoinGecko data: ${coinsResponse.status === "fulfilled" ? coinsResponse.value.status : "Request Failed"}`
          );
        }

        // Handle Fear & Greed Index Response
        if (fearGreedResponse.status === "fulfilled" && fearGreedResponse.value.ok) {
          const fearGreedData = await fearGreedResponse.value.json();
          setFearGreedIndex(parseInt(fearGreedData.data[0].value, 10));
        } else {
          throw new Error(
            `Failed to fetch Fear & Greed Index: ${fearGreedResponse.status === "fulfilled" ? fearGreedResponse.value.status : "Request Failed"}`
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch cryptocurrency data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="main-bg d-flex flex-column align-items-center py-4">
      {/* Header */}
      <h4 className="mb-3 text-white">
        Trending Coins <span role="img" aria-label="Globe">🌎</span>
      </h4>

      {/* Error Handling */}
      {error && <p className="text-danger">{error}</p>}

      {/* Centered Table */}
      <div className="glass-table p-3 w-75 mx-auto mb-4">
        {loading ? (
          <p className="text-center text-white">Loading...</p>
        ) : (
          coins && (
            <div className="table-responsive">
              <table className="w-100 text-white" style={{ tableLayout: "fixed" }}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Coin</th>
                    <th>Price</th>
                    <th>24h Change</th>
                    <th>Market Cap</th>
                  </tr>
                </thead>
                <tbody>
                  {coins.map((coin, index) => (
                    <tr key={coin.id} className="border-bottom border-secondary">
                      <td>{index + 1}</td>
                      <td className="d-flex align-items-center">
                        <img
                          src={coin.image}
                          alt={coin.name}
                          width="32"
                          height="32"
                          className="me-2 rounded-circle"
                        />
                        <span className="fw-semibold">{coin.name}</span>
                      </td>
                      <td>${coin.current_price.toLocaleString()}</td>
                      <td className={coin.price_change_percentage_24h >= 0 ? "text-success" : "text-danger"}>
                        {coin.price_change_percentage_24h.toFixed(2)}%
                      </td>
                      <td>${coin.market_cap.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>

      {/* Dominance & Fear Meter - Side by Side */}
      <div className="d-flex flex-row justify-content-between w-75 gap-3">
        
        {/* Top Dominating Coin */}
        <div className="glass-table p-3 w-50 text-center">
          <h4 className="mb-3 text-white">
            Top Dominating Coin <span role="img" aria-label="Lightning">⚡</span>
          </h4>
          {!loading && dominantCoin ? (
            <>
              <img
                src={dominantCoin.image}
                alt={dominantCoin.name}
                width="64"
                height="64"
                className="mb-2"
              />
              <h2 className="text-white fw-bold">{dominantCoin.name}</h2>
              <p className="text-muted">Market Cap: ${dominantCoin.market_cap.toLocaleString()}</p>
            </>
          ) : (
            <p className="text-white">Loading...</p>
          )}
        </div>

        {/* Fear & Greed Meter */}
        <div className="glass-table p-3 w-50 text-center">
          <h4 className="mb-3 text-white">
            Luck Meter <span role="img" aria-label="Slot Machine">🎰</span> (Fear &amp; Greed Index)
          </h4>
          {!loading && fearGreedIndex !== null ? (
            <>
              <h2 className={`fw-bold ${
                fearGreedIndex < 30 ? "text-danger" 
                : fearGreedIndex > 70 ? "text-success" 
                : "text-warning"
              }`}>
                {fearGreedIndex}
              </h2>
              <p className="text-white">
                {fearGreedIndex < 10
                  ? "Extreme Fear 😱"
                  : fearGreedIndex < 30
                  ? "Fear 😨"
                  : fearGreedIndex < 50
                  ? "Neutral 😐"
                  : fearGreedIndex < 70
                  ? "Greed 🤑"
                  : "Extreme Greed 🚀"}
              </p>
            </>
          ) : (
            <p className="text-white">Loading...</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default Rankings;

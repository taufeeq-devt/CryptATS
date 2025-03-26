"use client"; // ✅ Fix for useEffect issue

import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // ✅ Import Bootstrap
import "./style.css"; // ✅ Glass effect styles

interface Coin {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  image: string;
  market_cap: number;
  circulating_supply: number;
  price_change_percentage_1h_in_currency?: number;
  price_change_percentage_24h_in_currency?: number;
  total_volume: number;
}

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState<Coin[]>([]);

  // ✅ Load watchlist from local storage on mount
  useEffect(() => {
    const savedWatchlist = localStorage.getItem("watchlist");
    if (savedWatchlist) {
      const parsedData = JSON.parse(savedWatchlist);
      console.log("Watchlist Data:", parsedData); // Debugging
      setWatchlist(parsedData);
    }
  }, []);

  // ✅ Remove a coin from the watchlist
  const removeFromWatchlist = (coinId: string) => {
    const updatedList = watchlist.filter((coin) => coin.id !== coinId);
    setWatchlist(updatedList);
    localStorage.setItem("watchlist", JSON.stringify(updatedList));
  };

  return (
    <div className="container mt-5">
      <h2 className="text-light text-center">📊 My Coin Watchlist</h2>

      {watchlist.length === 0 ? (
        <div className="text-center text-light">
          <h4 className="fw-bold">Your watchlist is empty</h4>
          <p>Start building your crypto watchlist by adding coins.</p>
        </div>
      ) : (
        
        <div className="glass-table table-responsive mx-auto mt-3" style={{ maxHeight: "600px", overflowY: "auto" }}>
          <table className="table table-dark table-hover text-center">
            <thead>
              <tr>
                <th>#</th>
                <th>Coin</th>
                <th>Price</th>
                <th>1h %</th>
                <th>24h %</th>
                <th>Market Cap</th>
                <th>Volume (24h)</th>
                <th>Circulating Supply</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {watchlist.map((coin, index) => (
                <tr key={coin.id}>
                  <td>{index + 1}</td>
                  <td className="d-flex align-items-center justify-content-center">
                    <img src={coin.image} alt={coin.name} width="25" className="me-2" />
                    {coin.name} ({coin.symbol.toUpperCase()})
                  </td>
                  <td>${coin.current_price.toLocaleString()}</td>
                  <td className={coin.price_change_percentage_1h_in_currency! >= 0 ? "text-success" : "text-danger"}>
                    {coin.price_change_percentage_1h_in_currency?.toFixed(2) ?? "N/A"}%
                  </td>
                  <td className={coin.price_change_percentage_24h_in_currency! >= 0 ? "text-success" : "text-danger"}>
                    {coin.price_change_percentage_24h_in_currency?.toFixed(2) ?? "N/A"}%
                  </td>
                  <td>${coin.market_cap.toLocaleString()}</td>
                  <td>${coin.total_volume.toLocaleString()}</td>
                  <td>{coin.circulating_supply.toLocaleString()}</td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => removeFromWatchlist(coin.id)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Watchlist;

"use client";

import { useEffect, useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import "./style.css"; // Glass effect CSS

interface Coin {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  price_change_percentage_1h_in_currency?: number;
  market_cap: number;
  image: string;
  sparkline_in_7d: { price: number[] };
}

const LiveCryptos = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [coinsPerPage] = useState<number>(20);
  const [showMenu, setShowMenu] = useState<string | null>(null);
  const [showTrend, setShowTrend] = useState<boolean>(false);
  const [showMarketCap, setShowMarketCap] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  const fetchData = async (retryCount = 3) => {
    setLoading(true);
    setError(null);
    while (retryCount > 0) {
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${coinsPerPage}&page=${page}&sparkline=true&price_change_percentage=1h,24h`
        );

        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();
        setCoins((prevCoins) => {
          const newCoins = data.filter(
            (newCoin: Coin) => !prevCoins.some((prevCoin) => prevCoin.id === newCoin.id)
          );
          return [...prevCoins, ...newCoins];
        });

        setLoading(false);
        return;
      } catch (err: any) {
        retryCount--;
        if (retryCount === 0) {
          setError("Failed to fetch data. Please try again later.");
          setLoading(false);
        }
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const addToWatchlist = (coin: Coin) => {
    try {
      const savedWatchlist = localStorage.getItem("watchlist");
      let watchlist: Coin[] = savedWatchlist ? JSON.parse(savedWatchlist) : [];

      if (!watchlist.some((item) => item.id === coin.id)) {
        watchlist.push(coin);
        localStorage.setItem("watchlist", JSON.stringify(watchlist));
        alert(`${coin.name} added to watchlist!`);
      } else {
        alert(`${coin.name} is already in the watchlist.`);
      }
    } catch (error) {
      alert("Failed to update watchlist.");
    }
  };

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <div className="container mt-4">
      <h2 className="text-light text-center">Live Cryptocurrency Prices</h2>
      {error && <p className="text-danger text-center">{error}</p>}
      {coins.length === 0 && !loading && <p className="text-light text-center">No data available.</p>}

      <div className="glass-table table-responsive mx-auto mt-3" style={{ maxHeight: "600px", overflowY: "auto" }}>
        <table className="table table-dark table-hover text-center">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Price</th>
              <th>24h Change</th>
              {showTrend && <th>1h Trend</th>}
              {showMarketCap && <th>Market Cap</th>}
              <th>Price Graph (7D)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {coins.map((coin, index) => (
              <tr key={coin.id}>
                <td>{index + 1}</td>
                <td className="d-flex align-items-center justify-content-center">
                  <img src={coin.image} alt={coin.name} width="25" className="me-2" />
                  <span>{coin.name} ({coin.symbol.toUpperCase()})</span>
                </td>
                <td>${coin.current_price.toLocaleString()}</td>
                <td className={coin.price_change_percentage_24h >= 0 ? "text-success" : "text-danger"}>
                  {coin.price_change_percentage_24h.toFixed(2)}%
                </td>
                {showTrend && (
                  <td className={coin.price_change_percentage_1h_in_currency! >= 0 ? "text-success" : "text-danger"}>
                    {coin.price_change_percentage_1h_in_currency?.toFixed(2)}%
                  </td>
                )}
                {showMarketCap && <td>${coin.market_cap.toLocaleString()}</td>}
                <td>
                  <ResponsiveContainer width={100} height={40}>
                    <LineChart data={coin.sparkline_in_7d.price.map((price, i) => ({ index: i, price }))}>
                      <XAxis dataKey="index" hide />
                      <YAxis hide />
                      <Tooltip />
                      <Line type="monotone" dataKey="price" stroke={coin.price_change_percentage_24h >= 0 ? "green" : "red"} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </td>
                <td style={{ position: "relative" }}>
                  <button
                    ref={(el) => {
                      if (el) buttonRefs.current[coin.id] = el;
                    }}
                    className="btn btn-outline-light btn-sm"
                    onClick={() => setShowMenu(showMenu === coin.id ? null : coin.id)}
                  >
                    ⋮
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showMenu && buttonRefs.current[showMenu] && (
        <div
          ref={dropdownRef}
          className="glass-dropdown position-absolute"
          style={{
            top: buttonRefs.current[showMenu]?.offsetTop + buttonRefs.current[showMenu]?.offsetHeight + 5 || 0,
            left: buttonRefs.current[showMenu]?.offsetLeft || 0,
            minWidth: "200px",
            background: "rgba(0, 0, 0, 0.8)",
            borderRadius: "8px",
            padding: "10px",
            zIndex: 1000,
          }}
        >
          <button className="dropdown-item text-light w-100 text-start" onClick={() => addToWatchlist(coins.find((c) => c.id === showMenu)!)}>
            Add to Watchlist
          </button>
          <button className="dropdown-item text-light w-100 text-start" onClick={() => setShowTrend((prev) => !prev)}>
            {showTrend ? "Hide 1h Trend" : "Show 1h Trend"}
          </button>
          <button className="dropdown-item text-light w-100 text-start" onClick={() => setShowMarketCap((prev) => !prev)}>
            {showMarketCap ? "Hide Market Cap" : "Show Market Cap"}
          </button>
        </div>
      )}

      {loading && <p className="text-light text-center">Loading more coins...</p>}
      <div className="text-center">
        <button className="btn btn-primary my-3" onClick={handleLoadMore} disabled={loading}>
          {loading ? "Loading..." : "Load More Coins"}
        </button>
      </div>
    </div>
  );
};

export default LiveCryptos;

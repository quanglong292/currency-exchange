import { PRICE_DATA } from "../constants/currency.constant";
import type { Currency } from "../types/currency.type";

export const CURRENCIES: Currency[] = PRICE_DATA.map((item) => {
  let icon = item.currency.slice(0, 2);
  let name = item.currency;

  switch (item.currency) {
    case "BTC":
    case "WBTC":
      icon = "₿";
      name = item.currency === "WBTC" ? "Wrapped Bitcoin" : "Bitcoin";
      break;
    case "ETH":
    case "wstETH":
      icon = "Ξ";
      name = item.currency === "wstETH" ? "Wrapped stETH" : "Ethereum";
      break;
    case "BLUR":
      icon = "🌀";
      name = "Blur";
      break;
    case "bNEO":
      icon = "🔷";
      name = "Binance NEO";
      break;
    case "USDC":
    case "axlUSDC":
      icon = "$";
      name = item.currency === "axlUSDC" ? "Axelar USDC" : "USD Coin";
      break;
    case "USD":
      icon = "$";
      name = "US Dollar";
      break;
    case "ATOM":
      icon = "⚛️";
      name = "Cosmos";
      break;
    case "OSMO":
      icon = "🧪";
      name = "Osmosis";
      break;
    case "LUNA":
      icon = "🌙";
      name = "Terra Luna";
      break;
  }

  return {
    symbol: item.currency,
    name,
    icon,
    price: item.price,
    change24h: Math.random() * 10 - 5, // Random change for demo
  };
});

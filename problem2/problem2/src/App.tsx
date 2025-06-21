import { useState, useEffect, useCallback } from "react";
import {
  FaExchangeAlt,
  FaExclamationCircle,
  FaCheckCircle,
  FaSpinner,
  FaCoins,
} from "react-icons/fa";
import { CURRENCIES } from "./utils/currency.util";
import CurrencyDropdown from "./components/CurrencyDropdown";
import { Currency } from "./types/currency.type";

interface SwapState {
  fromCurrency: Currency;
  toCurrency: Currency;
  fromAmount: string;
  toAmount: string;
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

export default function CurrencySwapApp() {
  const [swapState, setSwapState] = useState<SwapState>({
    fromCurrency: CURRENCIES[0],
    toCurrency: CURRENCIES[1],
    fromAmount: "",
    toAmount: "",
    isLoading: false,
    error: null,
    success: false,
  });

  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [fromDropdownLoading, setFromDropdownLoading] = useState(false);
  const [toDropdownLoading, setToDropdownLoading] = useState(false);

  const calculateExchangeRate = useCallback(
    (from: Currency, to: Currency): number => {
      return from.price / to.price;
    },
    []
  );

  const updateToAmount = useCallback(
    (fromAmount: string, fromCurrency: Currency, toCurrency: Currency) => {
      if (!fromAmount || isNaN(Number(fromAmount))) return "";
      const rate = calculateExchangeRate(fromCurrency, toCurrency);
      const toAmount = (Number(fromAmount) * rate).toFixed(6);
      return toAmount;
    },
    [calculateExchangeRate]
  );

  const handleFromAmountChange = (value: string) => {
    // Only allow numbers and decimal point
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setSwapState((prev) => ({
        ...prev,
        fromAmount: value,
        error: null,
      }));
    }
  };

  const handleCurrencySwap = () => {
    setSwapState((prev) => ({
      ...prev,
      fromCurrency: prev.toCurrency,
      toCurrency: prev.fromCurrency,
      fromAmount: prev.toAmount,
      toAmount: prev.fromAmount,
    }));
  };

  const handleFromDropdownToggle = async () => {
    if (!showFromDropdown) {
      setFromDropdownLoading(true);
      // Random delay between 0.5s and 0.75s
      const delay = Math.random() * 250 + 500; // 500-750ms
      await new Promise((resolve) => setTimeout(resolve, delay));
      setFromDropdownLoading(false);
    }
    setShowFromDropdown(!showFromDropdown);
  };

  const handleToDropdownToggle = async () => {
    if (!showToDropdown) {
      setToDropdownLoading(true);
      // Random delay between 0.5s and 0.75s
      const delay = Math.random() * 250 + 500; // 500-750ms
      await new Promise((resolve) => setTimeout(resolve, delay));
      setToDropdownLoading(false);
    }
    setShowToDropdown(!showToDropdown);
  };

  const validateSwap = (): string | null => {
    if (!swapState.fromAmount || Number(swapState.fromAmount) <= 0) {
      return "Please enter a valid amount";
    }
    if (swapState.fromCurrency.symbol === swapState.toCurrency.symbol) {
      return "Please select different currencies";
    }
    if (Number(swapState.fromAmount) > 1000000) {
      return "Amount too large for demo";
    }
    return null;
  };

  const handleConfirmSwap = async () => {
    const error = validateSwap();
    if (error) {
      setSwapState((prev) => ({ ...prev, error }));
      return;
    }

    setSwapState((prev) => ({ ...prev, isLoading: true, error: null }));

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simulate random success/failure for demo
    const isSuccess = Math.random() > 0.2; // 80% success rate

    if (isSuccess) {
      setSwapState((prev) => ({
        ...prev,
        isLoading: false,
        success: true,
        fromAmount: "",
        toAmount: "",
      }));

      // Reset success state after 3 seconds
      setTimeout(() => {
        setSwapState((prev) => ({ ...prev, success: false }));
      }, 3000);
    } else {
      setSwapState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Swap failed. Please try again.",
      }));
    }
  };

  const exchangeRate = calculateExchangeRate(
    swapState.fromCurrency,
    swapState.toCurrency
  );

  // Effects
  useEffect(() => {
    if (swapState.fromAmount) {
      const newToAmount = updateToAmount(
        swapState.fromAmount,
        swapState.fromCurrency,
        swapState.toCurrency
      );
      setSwapState((prev) => ({ ...prev, toAmount: newToAmount }));
    }
  }, [
    swapState.fromAmount,
    swapState.fromCurrency,
    swapState.toCurrency,
    updateToAmount,
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-gray-900/90 backdrop-blur-sm rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600">
            <div className="flex items-center gap-2">
              <FaCoins className="w-6 h-6 text-white" />
              <h1 className="text-xl font-bold text-white">Currency Swap</h1>
            </div>
            <p className="text-purple-100 text-sm mt-1">
              Exchange your digital assets instantly
            </p>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-6">
            {swapState.success && (
              <div className="flex items-center gap-2 p-4 bg-green-900/50 border border-green-600 rounded-lg">
                <FaCheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-green-300 font-medium">
                  Swap completed successfully!
                </span>
              </div>
            )}

            {/* Error Message */}
            {swapState.error && (
              <div className="flex items-center gap-2 p-4 bg-red-900/50 border border-red-600 rounded-lg">
                <FaExclamationCircle className="w-5 h-5 text-red-400" />
                <span className="text-red-300">{swapState.error}</span>
              </div>
            )}

            {/* Amount Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Amount to swap
              </label>
              <input
                type="text"
                value={swapState.fromAmount}
                onChange={(e) => handleFromAmountChange(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-lg"
              />
              {swapState.fromAmount && (
                <div className="text-sm text-gray-400">
                  ≈ $
                  {(
                    Number(swapState.fromAmount) * swapState.fromCurrency.price
                  ).toLocaleString()}{" "}
                  USD
                </div>
              )}
            </div>

            {/* Horizontal Currency Selection and Swap */}
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
              {/* From Currency */}
              <div className="flex-1 space-y-2 w-full">
                <label className="block text-sm font-medium text-gray-300">
                  From
                </label>
                <CurrencyDropdown
                  isOpen={showFromDropdown}
                  onToggle={handleFromDropdownToggle}
                  selectedCurrency={swapState.fromCurrency}
                  onSelect={(currency) =>
                    setSwapState((prev) => ({
                      ...prev,
                      fromCurrency: currency,
                    }))
                  }
                  excludeCurrency={swapState.toCurrency}
                  isLoading={fromDropdownLoading}
                />
              </div>

              {/* Double Arrow Exchange Button */}
              <div className="flex flex-col items-center md:pt-6">
                <button
                  type="button"
                  onClick={handleCurrencySwap}
                  className="p-3 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-full transition-all duration-200 hover:scale-105 transform group cursor-pointer"
                >
                  <FaExchangeAlt className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-200 rotate-90 md:rotate-0" />
                </button>
              </div>

              {/* To Currency */}
              <div className="flex-1 space-y-2 w-full">
                <label className="hidden md:block text-sm font-medium text-gray-300">
                  To
                </label>
                <CurrencyDropdown
                  isOpen={showToDropdown}
                  onToggle={handleToDropdownToggle}
                  selectedCurrency={swapState.toCurrency}
                  onSelect={(currency) =>
                    setSwapState((prev) => ({ ...prev, toCurrency: currency }))
                  }
                  excludeCurrency={swapState.fromCurrency}
                  isLoading={toDropdownLoading}
                />
              </div>
            </div>

            {/* You will receive */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                You will receive
              </label>
              <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="text-2xl font-bold text-white">
                  {swapState.toAmount || "0.00"} {swapState.toCurrency.symbol}
                </div>
                {swapState.toAmount && (
                  <div className="text-sm text-gray-400 mt-1">
                    ≈ $
                    {(
                      Number(swapState.toAmount) * swapState.toCurrency.price
                    ).toLocaleString()}{" "}
                    USD
                  </div>
                )}
              </div>
            </div>

            {/* Exchange Rate */}
            {swapState.fromAmount && (
              <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="text-sm text-gray-300">Exchange Rate</div>
                <div className="text-white font-medium">
                  1 {swapState.fromCurrency.symbol} = {exchangeRate.toFixed(6)}{" "}
                  {swapState.toCurrency.symbol}
                </div>
              </div>
            )}

            {/* Confirm Button */}
            <button
              type="button"
              onClick={handleConfirmSwap}
              disabled={swapState.isLoading}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold text-lg rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              {swapState.isLoading ? (
                <>
                  <FaSpinner className="w-6 h-6 animate-spin" />
                  Processing Swap...
                </>
              ) : (
                "SWAP"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

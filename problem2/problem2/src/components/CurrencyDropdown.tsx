import {
  FaArrowDown,
  FaArrowUp,
  FaChevronDown,
  FaSpinner,
} from "react-icons/fa";
import type { Currency } from "../types/currency.type";
import CurrencyIcon from "./Icon/CurrencyIcon";
import { CURRENCIES } from "../utils/currency.util";
import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  isOpen: boolean;
  onToggle: () => void;
  selectedCurrency: Currency;
  onSelect: (currency: Currency) => void;
  excludeCurrency?: Currency;
  isLoading: boolean;
};

const useDropdownPosition = (
  triggerRef: RefObject<HTMLElement | null>,
  isOpen: boolean
) => {
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current || !isOpen) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const scrollX = window.scrollX || document.documentElement.scrollLeft;

    setPosition({
      top: rect.bottom + scrollY,
      left: rect.left + scrollX,
      width: rect.width,
    });
  }, [triggerRef, isOpen]);

  useEffect(() => {
    if (isOpen) {
      calculatePosition();

      // Recalculate position on scroll and resize
      window.addEventListener("scroll", calculatePosition, true);
      window.addEventListener("resize", calculatePosition);

      return () => {
        window.removeEventListener("scroll", calculatePosition, true);
        window.removeEventListener("resize", calculatePosition);
      };
    }
  }, [isOpen, calculatePosition]);

  return position;
};

const useClickOutside = (
  refs: RefObject<HTMLElement | null>[],
  callback: () => void
) => {
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        refs.every((ref) => ref.current && !ref.current.contains(event.target))
      ) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [refs, callback]);
};

const CurrencyDropdown = ({
  isOpen,
  onToggle,
  selectedCurrency,
  onSelect,
  excludeCurrency,
  isLoading,
}: Props) => {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const modalRootRef = useRef<HTMLElement | null>(
    document.getElementById("modal-root")
  );
  const position = useDropdownPosition(triggerRef, isOpen);

  useClickOutside([triggerRef, dropdownRef], () => {
    if (isOpen) {
      onToggle();
    }
  });

  return (
    <div id="currency-select" className="relative w-full">
      <button
        ref={triggerRef}
        type="button"
        onClick={onToggle}
        disabled={isLoading}
        className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-600 transition-all duration-200 min-w-[120px] disabled:opacity-50 w-full cursor-pointer"
      >
        <div className="flex items-center gap-2 flex-1">
          <span className="text-xl">
            {CurrencyIcon({ currency: selectedCurrency.symbol })}
          </span>
          <span className="font-medium text-white">
            {selectedCurrency.symbol}
          </span>
        </div>
        {isLoading ? (
          <FaSpinner className="w-4 h-4 text-gray-400 animate-spin" />
        ) : (
          <FaChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        )}
      </button>

      {isOpen &&
        !isLoading &&
        modalRootRef.current &&
        createPortal(
          <div
            ref={dropdownRef}
            className="currency-dropdown scrollbar-hidden absolute top-full mt-2 bg-gray-800 rounded-xl border border-gray-600 shadow-2xl z-50 overflow-hidden bottom-auto max-h-[200px] w-full overflow-y-auto"
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
              width: `${position.width}px`,
            }}
          >
            <div className="max-h-full overflow-y-auto scrollbar-thin scrollbar-track-gray-700 scrollbar-thumb-gray-500 hover:scrollbar-thumb-gray-400">
              {CURRENCIES.filter(
                (c) => c.symbol !== excludeCurrency?.symbol
              ).map((currency) => (
                <button
                  key={currency.symbol}
                  type="button"
                  onClick={() => {
                    onSelect(currency);
                    onToggle();
                  }}
                  className="w-full px-4 py-3 hover:bg-gray-700 transition-colors flex items-center justify-between group first:rounded-t-xl last:rounded-b-xl"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">
                      {CurrencyIcon({ currency: currency.symbol })}
                    </span>
                    <div className="text-left">
                      <div className="font-medium text-white">
                        {currency.symbol}
                      </div>
                      <div className="text-sm text-gray-400">
                        {currency.name}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-white">
                      ${currency.price.toLocaleString()}
                    </div>
                    <div
                      className={`text-xs flex items-center gap-1 ${
                        currency.change24h >= 0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {currency.change24h >= 0 ? (
                        <FaArrowUp className="w-3 h-3" />
                      ) : (
                        <FaArrowDown className="w-3 h-3" />
                      )}
                      {Math.abs(currency.change24h).toFixed(1)}%
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>,
          modalRootRef.current
        )}
    </div>
  );
};

export default CurrencyDropdown;

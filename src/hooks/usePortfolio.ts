import { useState, useEffect } from 'react';
import { PortfolioPosition, StockData } from '@/types/trading';

export function usePortfolio() {
  const [portfolio, setPortfolio] = useState<PortfolioPosition[]>([]);
  const [balance, setBalance] = useState<number>(100000);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const response = await fetch('/api/balance');
      const data = await response.json();
      if (typeof data.balance === 'number') {
        setBalance(data.balance);
      }
      if (Array.isArray(data.positions)) {
        setPortfolio(data.positions);
      }
    } catch (error) {
      console.error('Failed to load initial data:', error);
      setError('Failed to load initial data');
    } finally {
      setDataLoading(false);
    }
  };

  const getTotalPortfolioValue = (currentStockData: StockData | null) => {
    if (!Array.isArray(portfolio)) return 0;
    
    return portfolio.reduce((total, position) => {
      const currentPrice = position.symbol === currentStockData?.symbol 
        ? currentStockData.price 
        : position.avgPrice;
      return total + (position.shares * currentPrice);
    }, 0);
  };

  const executeTransaction = async (
    stockData: StockData,
    shares: number,
    action: 'BUY' | 'SELL'
  ) => {
    try {
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: stockData.symbol,
          shares,
          avgPrice: stockData.price,
          action
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      const balanceResponse = await fetch('/api/balance');
      const balanceData = await balanceResponse.json();
      setBalance(balanceData.balance);
      setPortfolio(balanceData.positions);
      
      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err.message || `Failed to ${action.toLowerCase()} shares` };
    }
  };

  return {
    portfolio,
    balance,
    dataLoading,
    error,
    getTotalPortfolioValue,
    executeTransaction
  };
}
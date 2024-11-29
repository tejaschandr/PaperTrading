import { useState } from 'react';
import { StockData, PriceHistoryData } from '@/types/trading';

const API_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY;

export function useStockData() {
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [priceHistory, setPriceHistory] = useState<PriceHistoryData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchStock = async (searchTerm: string) => {
    if (!searchTerm) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${searchTerm}&apikey=${API_KEY}`
      );
      const data = await response.json();
      
      if (data['Global Quote']) {
        setStockData({
          symbol: data['Global Quote']['01. symbol'],
          price: parseFloat(data['Global Quote']['05. price']),
          change: parseFloat(data['Global Quote']['09. change']),
          changePercent: data['Global Quote']['10. change percent']
        });
        
        const historyResponse = await fetch(
          `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${searchTerm}&apikey=${API_KEY}`
        );
        const historyData = await historyResponse.json();
        
        if (historyData['Time Series (Daily)']) {
          const history = Object.entries(historyData['Time Series (Daily)'])
            .slice(0, 30)
            .map(([date, values]: [string, any]) => ({
              date,
              price: parseFloat(values['4. close'])
            }))
            .reverse();
          setPriceHistory(history);
        }
      } else {
        setError('Stock not found');
      }
    } catch (err) {
      setError('Error fetching stock data');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    stockData,
    priceHistory,
    loading,
    error,
    searchStock,
    setError
  };
}
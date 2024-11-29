import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { StockSearch } from '@/components/trading/StockSearch';
import { StockInfo } from '@/components/trading/StockInfo';
import { PriceChart } from '@/components/trading/PriceChart';
import { PortfolioList } from '@/components/trading/PortfolioList';
import { BalanceDisplay } from '@/components/trading/BalanceDisplay';
import { ErrorDisplay } from '@/components/trading/ErrorDisplay';
import { useStockData } from '@/hooks/useStockData';
import { usePortfolio } from '@/hooks/usePortfolio';

export default function TradingApp() {
  const [searchTerm, setSearchTerm] = useState('');
  const [shares, setShares] = useState<number>(0);
  
  const { 
    stockData, 
    priceHistory, 
    loading, 
    error: stockError,
    searchStock,
    setError: setStockError 
  } = useStockData();

  const {
    portfolio,
    balance,
    dataLoading,
    error: portfolioError,
    getTotalPortfolioValue,
    executeTransaction
  } = usePortfolio();

  const buyStock = async () => {
    if (!stockData || shares <= 0) return;
    
    const totalCost = shares * stockData.price;
    if (totalCost > balance) {
      setStockError('Insufficient funds');
      return;
    }

    const result = await executeTransaction(stockData, shares, 'BUY');
    if (result.success) {
      setShares(0);
      setStockError(null);
    } else {
      setStockError(result.error);
    }
  };
  
  const sellStock = async () => {
    if (!stockData || shares <= 0) return;
    
    const position = portfolio.find(p => p.symbol === stockData.symbol);
    if (!position || position.shares < shares) {
      setStockError('Insufficient shares');
      return;
    }

    const result = await executeTransaction(stockData, shares, 'SELL');
    if (result.success) {
      setShares(0);
      setStockError(null);
    } else {
      setStockError(result.error);
    }
  };

  if (dataLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Paper Trading Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <BalanceDisplay 
            balance={balance}
            portfolioValue={getTotalPortfolioValue(stockData)}
          />
          
          <StockSearch
            searchTerm={searchTerm}
            loading={loading}
            onSearchTermChange={setSearchTerm}
            onSearch={() => searchStock(searchTerm)}
          />

          <ErrorDisplay error={stockError || portfolioError} />

          {stockData && (
            <div className="space-y-4">
              <StockInfo
                stockData={stockData}
                shares={shares}
                onSharesChange={setShares}
                onBuy={buyStock}
                onSell={sellStock}
              />

              {priceHistory.length > 0 && (
                <PriceChart priceHistory={priceHistory} />
              )}
            </div>
          )}

          {portfolio.length > 0 && (
            <PortfolioList portfolio={portfolio} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
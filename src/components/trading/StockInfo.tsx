import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TrendingUp, DollarSign } from 'lucide-react';
import { StockData } from '../../types/trading';

interface StockInfoProps {
  stockData: StockData;
  shares: number;
  onSharesChange: (shares: number) => void;
  onBuy: () => void;
  onSell: () => void;
}

export function StockInfo({
  stockData,
  shares,
  onSharesChange,
  onBuy,
  onSell
}: StockInfoProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardContent className="pt-4">
          <h3 className="text-xl mb-2">{stockData.symbol}</h3>
          <div className="text-2xl">${stockData.price.toFixed(2)}</div>
          <div className={stockData.change >= 0 ? "text-green-500" : "text-red-500"}>
            {stockData.change.toFixed(2)} ({stockData.changePercent})
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-4">
          <div className="space-y-4">
            <div>
              <Input
                type="number"
                min="0"
                placeholder="Number of shares..."
                value={shares || ''}
                onChange={(e) => onSharesChange(parseInt(e.target.value) || 0)}
              />
              <div className="text-sm text-gray-500 mt-1">
                Total: ${((shares || 0) * stockData.price).toLocaleString()}
              </div>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={onBuy}>
                <TrendingUp className="w-4 h-4 mr-2" />
                Buy
              </Button>
              <Button className="flex-1" onClick={onSell} variant="destructive">
                <DollarSign className="w-4 h-4 mr-2" />
                Sell
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
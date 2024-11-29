import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PortfolioPosition } from '../../types/trading';

interface PortfolioListProps {
  portfolio: PortfolioPosition[];
}

export function PortfolioList({ portfolio }: PortfolioListProps) {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Portfolio</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {portfolio.map((position) => (
            <div 
              key={position.id} 
              className="flex justify-between items-center p-4 border rounded hover:bg-gray-50"
            >
              <div>
                <div className="font-bold">{position.symbol}</div>
                <div className="text-sm text-gray-500">
                  {position.shares} shares
                </div>
              </div>
              <div className="text-right">
                <div>Avg Price: ${position.avgPrice.toFixed(2)}</div>
                <div className="text-sm text-gray-500">
                  Value: ${(position.shares * position.avgPrice).toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
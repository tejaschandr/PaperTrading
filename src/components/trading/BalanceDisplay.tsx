import React from 'react';

interface BalanceDisplayProps {
  balance: number;
  portfolioValue: number;
}

export function BalanceDisplay({ balance, portfolioValue }: BalanceDisplayProps) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div>
        <div className="text-sm text-gray-500">Available Balance</div>
        <div className="text-2xl font-bold">
          ${balance.toLocaleString()}
        </div>
      </div>
      <div>
        <div className="text-sm text-gray-500">Portfolio Value</div>
        <div className="text-2xl font-bold">
          ${portfolioValue.toLocaleString()}
        </div>
      </div>
    </div>
  );
}
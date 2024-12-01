import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface Transaction {
  id: string;
  symbol: string;
  shares: number;
  price: number;
  type: 'BUY' | 'SELL';
  createdAt: string;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {transactions.map((transaction) => (
            <div 
              key={transaction.id} 
              className="flex justify-between items-center p-4 border rounded hover:bg-gray-50"
            >
              <div>
                <div className="font-bold">{transaction.symbol}</div>
                <div className="text-sm text-gray-500">
                  {transaction.type === 'BUY' ? 'Bought' : 'Sold'} {transaction.shares} shares
                </div>
              </div>
              <div className="text-right">
                <div>${transaction.price.toFixed(2)}</div>
                <div className="text-sm text-gray-500">
                  {new Date(transaction.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


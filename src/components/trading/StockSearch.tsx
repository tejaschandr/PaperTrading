import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface StockSearchProps {
  searchTerm: string;
  loading: boolean;
  onSearchTermChange: (term: string) => void;
  onSearch: () => void;
}

export function StockSearch({ 
  searchTerm, 
  loading, 
  onSearchTermChange, 
  onSearch 
}: StockSearchProps) {
  return (
    <div className="flex gap-2 mb-4">
      <Input
        placeholder="Enter stock symbol (e.g., AAPL)"
        value={searchTerm}
        onChange={(e) => onSearchTermChange(e.target.value.toUpperCase())}
        maxLength={5}
      />
      <Button onClick={onSearch} disabled={loading}>
        <Search className="w-4 h-4 mr-2" />
        {loading ? 'Searching...' : 'Search'}
      </Button>
    </div>
  );
}
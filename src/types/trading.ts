export interface StockData {
    symbol: string;
    price: number;
    change: number;
    changePercent: string;
  }
  
  export interface PortfolioPosition {
    id: string;
    symbol: string;
    shares: number;
    avgPrice: number;
    userId: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface PriceHistoryData {
    date: string;
    price: number;
  }
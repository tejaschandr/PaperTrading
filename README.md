# Paper Trading Platform

Paper Trading Platform designed to simulate stock market trading without real money risk. Users can create accounts, manage portfolios, execute trades, and track their performance using real-time market data.

## Deployment Link
https://paper-trading-kappa.vercel.app/

## Features

- User Authentication & Personal Portfolios
- Real-time Stock Data via Alpha Vantage API
- Market Buy/Sell Orders
- Portfolio Performance Tracking
- Transaction History
- Interactive Price Charts
- Session-persistent User Data

## Technologies Used

- Frontend:
  - React/Next.js for UI
  - TailwindCSS for styling
  - Recharts for data visualization
  - ShadcnUI for components

- Backend:
  - Next.js API Routes
  - Prisma ORM for database management
  - PostgreSQL database
  - NextAuth.js for authentication

- Third Party Integration:
  - Alpha Vantage API for real-time stock data



## Dependencies Required

- Node.js 18+ 
- npm/yarn
- A free Alpha Vantage API key (get one at https://www.alphavantage.co/support/#api-key)

## Setup Instructions

1. Clone the repository
2. Copy `.env.example` to `.env` and update the values
3. Install dependencies: `npm install`
4. Generate the database: `npx prisma generate`
5. Set up the database: `npx prisma db push`
6. Seed the database: `npx prisma db seed`
7. Run the development server: `npm run dev`

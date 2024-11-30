
# Paper Trading Platform

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

import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function portfolioHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userId = process.env.DEFAULT_USER_ID;

  if (req.method === 'GET') {
    try {
      const positions = await prisma.position.findMany({
        where: { userId },
      });
      return res.status(200).json(positions);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch portfolio' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { symbol, shares, avgPrice, action } = req.body;

      console.log('Received request:', { symbol, shares, avgPrice, action });

      if (!symbol || !shares || !avgPrice || !action) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      if (typeof shares !== 'number' || shares <= 0) {
        return res.status(400).json({ error: 'Invalid shares amount' });
      }

      if (typeof avgPrice !== 'number' || avgPrice <= 0) {
        return res.status(400).json({ error: 'Invalid price' });
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      console.log('Current user state:', user);

      if (action === 'BUY') {
        const totalCost = shares * avgPrice;
        console.log('Purchase attempt:', { totalCost, currentBalance: user.balance });

        if (totalCost > user.balance) {
          return res.status(400).json({ 
            error: 'Insufficient funds',
            details: {
              required: totalCost,
              available: user.balance
            }
          });
        }

        const result = await prisma.$transaction(async (tx) => {
          const updatedUser = await tx.user.update({
            where: { id: userId },
            data: { balance: user.balance - totalCost },
          });

          const existingPosition = await tx.position.findUnique({
            where: { userId_symbol: { userId, symbol } },
          });

          let position;
          if (existingPosition) {
            const newShares = existingPosition.shares + shares;
            const newAvgPrice = (
              (existingPosition.avgPrice * existingPosition.shares) + 
              (avgPrice * shares)
            ) / newShares;

            position = await tx.position.update({
              where: { userId_symbol: { userId, symbol } },
              data: { 
                shares: newShares,
                avgPrice: newAvgPrice
              },
            });
          } else {
            position = await tx.position.create({
              data: {
                userId,
                symbol,
                shares,
                avgPrice
              },
            });
          }

          return { user: updatedUser, position };
        });

        console.log('Transaction result:', result);

        return res.status(200).json({
          message: 'Purchase successful',
          position: result.position,
          newBalance: result.user.balance
        });
      }

      if (action === 'SELL') {
        const existingPosition = await prisma.position.findUnique({
          where: { userId_symbol: { userId, symbol } },
        });

        if (!existingPosition || existingPosition.shares < shares) {
          return res.status(400).json({ error: 'Insufficient shares' });
        }

        const totalValue = shares * avgPrice;

        const result = await prisma.$transaction(async (tx) => {
          const updatedUser = await tx.user.update({
            where: { id: userId },
            data: { balance: user.balance + totalValue },
          });

          let position;
          if (existingPosition.shares === shares) {
            await tx.position.delete({
              where: { userId_symbol: { userId, symbol } },
            });
            position = null;
          } else {
            position = await tx.position.update({
              where: { userId_symbol: { userId, symbol } },
              data: { shares: existingPosition.shares - shares },
            });
          }

          return { user: updatedUser, position };
        });

        return res.status(200).json({
          message: 'Sale successful',
          position: result.position,
          newBalance: result.user.balance
        });
      }

      return res.status(400).json({ error: 'Invalid action' });
      
    } catch (error) {
      console.error('Portfolio update error:', error);
      return res.status(500).json({ error: 'Failed to update portfolio' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
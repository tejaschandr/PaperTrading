import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const userId = session.user.id;
  

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

      // Log the incoming request for debugging
      console.log('Received request:', { symbol, shares, avgPrice, action });

      // Validate inputs
      if (!symbol || !shares || !avgPrice || !action) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const existingPosition = await prisma.position.findUnique({
        where: { userId_symbol: { userId, symbol } },
      });

      if (action === 'BUY') {
        const totalCost = shares * avgPrice;
        const user = await prisma.user.findUnique({
          where: { id: userId },
        });

        if (!user || user.balance < totalCost) {
          return res.status(400).json({ error: 'Insufficient funds' });
        }

        // Begin transaction
        const result = await prisma.$transaction(async (tx) => {
          const updatedUser = await tx.user.update({
            where: { id: userId },
            data: { balance: user.balance - totalCost },
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
              data: { shares: newShares, avgPrice: newAvgPrice },
            });
          } else {
            position = await tx.position.create({
              data: { userId, symbol, shares, avgPrice },
            });
          }

          return { user: updatedUser, position };
        });

        return res.status(200).json({
          message: 'Purchase successful',
          position: result.position,
          newBalance: result.user.balance
        });
      }

      if (action === 'SELL') {
        if (!existingPosition || existingPosition.shares < shares) {
          return res.status(400).json({ error: 'Insufficient shares' });
        }

        const totalValue = shares * avgPrice;
        const user = await prisma.user.findUnique({
          where: { id: userId },
        });

        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }

        // Begin transaction
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
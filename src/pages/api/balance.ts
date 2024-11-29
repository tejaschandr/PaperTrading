import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function balanceHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userId = process.env.DEFAULT_USER_ID;

  if (req.method === 'GET') {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { positions: true },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json({
        balance: user.balance,
        positions: user.positions,
      });
    } catch (error) {
      console.error('Balance fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch balance' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
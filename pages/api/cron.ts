import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Perform the task you want to run as a cron job
  console.log('Cron job is running!');
  res.status(200).end();
}

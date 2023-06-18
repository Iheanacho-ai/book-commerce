import cronJob from '../../cronJob';

export default function handler(req, res) {
  cronJob(); // Start the cron job
  res.status(200).json({ message: 'Cron job started.' });
}

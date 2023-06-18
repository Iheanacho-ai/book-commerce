import Stripe from 'stripe';
import { NextApiRequest, NextApiResponse } from 'next';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2020-08-27', // Replace with your desired Stripe API version
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email } = req.body;
  // Check if customer already exists
  try {
    const checkCustomer = await stripe.customers.search({
      query: `email: '${email}'`,
    });
    res.status(200).json({
      code: 'search_done',
      checkCustomer,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      code: 'customer_check_failed',
      error: error,
    });
  }
};

export default handler;

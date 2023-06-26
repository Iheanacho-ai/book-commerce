import Stripe from 'stripe';
import { NextApiRequest, NextApiResponse } from 'next';


export const stripeKey: string = (process.env.STRIPE_SECRET_KEY as string)

const stripe = new Stripe(stripeKey, {
  apiVersion: '2022-11-15',
  // Replace with your desired Stripe API version
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email } = req.body;
  try {
    const customer = await stripe.customers.create({
      email: email,
    });
    res.status(200).json({
      code: 'customer_created',
      customer,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      code: 'customer_creation_failed',
      error: error,
    });
  }
};

export default handler;




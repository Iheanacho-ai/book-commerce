import Stripe from 'stripe';
import { NextApiRequest, NextApiResponse } from 'next';
import { stripeKey } from './create-customer';

const stripe = new Stripe(stripeKey, {
  apiVersion: '2022-11-15',
  // Replace with your desired Stripe API version
});

const handler = async (req:NextApiRequest, res:NextApiResponse) => {
  //gather all the subscriptions created on the database
  try {
    const subscriptionList = await stripe.subscriptions.list({
      limit: 3,
    });
    res.status(200).json({
      code: 'search_done',
      subscriptionList
    })
    
    }catch (error) {
      console.log(error);
      res.status(400).json({
        code: 'subscription_check_failed',
        error: error
      })
  }
    
};


export default handler;
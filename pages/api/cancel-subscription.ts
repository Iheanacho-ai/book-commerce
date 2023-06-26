import Stripe from 'stripe';
import { NextApiRequest, NextApiResponse } from 'next';
import { stripeKey } from './create-customer';

const stripe = new Stripe(stripeKey, {
  apiVersion: '2022-11-15',
  // Replace with your desired Stripe API version
});

const handler= async (req:NextApiRequest, res:NextApiResponse) => {
    const {subscriptionId} = req.body
    try {
        const deletedSubscription = await stripe.subscriptions.del(
            subscriptionId
        );

        res.status(200).json({
            code: 'subscription_deleted',
            deletedSubscription,
        });
    } catch (e) {
        console.error(e);
        res.status(400).json({
            code: 'subscription_deletion_failed',
            error: e,
        });
    }
};

export default handler;


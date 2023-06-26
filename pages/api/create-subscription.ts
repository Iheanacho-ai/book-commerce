import Stripe from 'stripe';
import { NextApiRequest, NextApiResponse } from 'next';
import { stripeKey } from './create-customer';

const stripe = new Stripe(stripeKey, {
  apiVersion: '2022-11-15',
  // Replace with your desired Stripe API version
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { customerID, priceID } = req.body;
  try {
    // Create the subscription. Note we're expanding the Subscription's
    // latest invoice and that invoice's payment_intent
    // so we can pass it to the front end to confirm the payment
    const subscription = await stripe.subscriptions.create({
      customer: customerID,
      items: [{ price: priceID }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });

    if (typeof subscription.latest_invoice === 'string' ) {
      // Handle case where latest_invoice is a string
      throw new Error('Invalid invoice data');
    }

    const clientSecret =
      (subscription.latest_invoice?.payment_intent as Stripe.PaymentIntent)
        ?.client_secret || '';
    
    res.send({
      subscriptionId: subscription.id,
      clientSecret: clientSecret,
    });

    console.log(subscription);
  } catch (error:any) {
    console.log(error);
    return res.status(400).send({ error: { message: error.message } });
  }
};

export default handler;




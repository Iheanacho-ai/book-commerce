import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const handler = async (req, res) => {
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
        code: 'customer_check_failed',
        error: error
      })
  }
    
};


export default handler;
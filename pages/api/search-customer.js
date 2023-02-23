import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const handler = async (req, res) => {
    const {email} = req.body
  //check if customer already exists
  try {
    const checkCustomer = await stripe.customers.search({
      query: `email: '${email}'`
    });
    res.status(200).json({
      code: 'search_done',
      checkCustomer,
    })     
  } catch (error) {
      console.log(error);
      res.status(400).json({
        code: 'customer_check_failed',
        error: error
      })
  }
    
};


export default handler;
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const YOUR_DOMAIN= "http://localhost:3000/"

const handler = async (req, res) => {
    
    console.log('yeah yeah')
    try {
        const prices = await stripe.prices.list({
            lookup_keys: [req.body.lookup_key],
            expand: ['data.product'],
        });
        const session = await stripe.checkout.sessions.create({
            billing_address_collection: 'auto',
            line_items: [
            {
                price: prices.data[0].id,
                // For metered billing, do not pass quantity
                quantity: 1,
        
            },
            ],
            mode: 'subscription',
            success_url: `${YOUR_DOMAIN}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${YOUR_DOMAIN}?canceled=true`,
        });

        console.log(session);
        
    } catch (error) {
        console.log(error)
        
    }
};


export default handler;


import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const handler = async (req, res) => {
    const {email} = req.body
    try {
        const customer = await stripe.customers.create({
            email: email
        });
        res.status(200).json({
            code: 'customer_created',
            customer,
        })

        
    } catch (error) {
        console.log(error);
        res.status(400).json({
            code: 'customer_creation_failed',
            error: error
        })
        
    }
};


export default handler;


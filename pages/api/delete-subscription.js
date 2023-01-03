import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const handler= async (req, res) => {
    try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2020-08-27' });
        const { subscriptionId } = req.body;

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
import {useState} from 'react';
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const PaymentForm = () => {
    const [error, setError] = useState()
    const options = {
        clientSecret: '{{CLIENT_SECRET}}',
        // Fully customizable with appearance API.
        appearance: {/*...*/},
    };
      
    // Set up Stripe.js and Elements to use in checkout form, passing the client secret obtained in step 5
    const elements = stripe.elements(options);
      
    // Create and mount the Payment Element
    const paymentElement = elements.create('payment');
    paymentElement.mount('#payment-element');


    const confirmPayment = async (e) => {
        e.preventDefault();
        const {error} = await stripe.confirmPayment({
            //`Elements` instance that was used to create the Payment Element
            elements,
            confirmParams: {
              return_url: "https://localhost:3000/catalog-page",
            }
        });

        // Retrieve the "payment_intent_client_secret" query parameter appended to
        // your return_url by Stripe.js
        const clientSecret = new URLSearchParams(window.location.search).get(
        'payment_intent_client_secret'
        );

        // Retrieve the PaymentIntent
        stripe.retrievePaymentIntent(clientSecret).then(({paymentIntent}) => {

        // Inspect the PaymentIntent `status` to indicate the status of the payment
        // to your customer.
        //
        // Some payment methods will [immediately succeed or fail][0] upon
        // confirmation, while others will first enter a `processing` state.
        //
        // [0]: https://stripe.com/docs/payments/payment-methods#payment-notification
        switch (paymentIntent.status) {
            case 'succeeded':
            alert('Success! Payment received.');
            break;

            case 'processing':
            alert("Payment processing. We'll update you when payment is received.");
            break;

            case 'requires_payment_method':
            alert('Payment failed. Please try another payment method.');
            // Redirect your user back to your payment page to attempt collecting
            // payment again
            break;

            default:
            alert('Something went wrong.');
            break;
        }
        });


        if (error) {
            // This point will only be reached if there is an immediate error when
            // confirming the payment. Show error to your customer (for example, payment
            // details incomplete)
            setError(error)
        } else {
            // Your customer will be redirected to your `return_url`. For some payment
            // methods like iDEAL, your customer will be redirected to an intermediate
            // site first to authorize the payment, then redirected to the `return_url`.
        }

    }

    return(
        <div className="payment-form-page">
            <head>
                <script src="https://js.stripe.com/v3/"></script>
            </head>
            <form id="payment-form" onSubmit={confirmPayment}>
                <div id="payment-element">
                
                </div>
                <button id="submit">Subscribe</button>
                <div id="error-message">
                    {error}
                </div>
            </form> 

        </div>
    )
}

export default PaymentForm;
import {loadStripe} from '@stripe/stripe-js';
import {Elements} from '@stripe/react-stripe-js';
import { supabase } from '../utils/index';
import CheckoutForm from '../components/checkout-form';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const Payment = ({clientSecret}) => {
  return(
  <Elements stripe={stripePromise} >
    <CheckoutForm clientSecret={clientSecret} />
  </Elements>)
};

export const getServerSideProps = async (ctx) => {
  // get the client secret from the supabase database
    const { data, error } = await supabase
    .from('stripe_data')
    .select()
    
    if (error) {
      console.log(error)
    }
  
    return {
      props: {
        clientSecret: data[0].clientSecret
      },
    }
}

export default Payment;
import {loadStripe} from '@stripe/stripe-js';
import {Elements} from '@stripe/react-stripe-js';
import CheckoutForm from '../components/checkout-form';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const Payment = ({clientSecret}) => {
  return(
  <Elements stripe={stripePromise} >
    <CheckoutForm clientSecret={clientSecret} />
  </Elements>)
};

export const getServerSideProps = async (ctx) => {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(ctx)
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession()

    if (!session)
      return {
        redirect: {
          destination: '/signin',
          permanent: false,
        },
    }

     // get the client secret from the supabase database
    const { data, error } = await supabase
      .from('stripeData')
      .select('*')
    
    console.log(data, 'payment')
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
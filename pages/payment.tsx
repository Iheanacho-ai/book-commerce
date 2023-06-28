import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../components/checkout-form';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { GetServerSideProps, NextPage } from 'next';


interface PaymentProps {
  clientSecret: string;
}

const publishableKey: string = (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)
const stripePromise = loadStripe(publishableKey); // Replace with your actual Stripe publishable key


const Payment: NextPage<PaymentProps> = ({ clientSecret }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm clientSecret={clientSecret} />
    </Elements>
  );
};

export const getServerSideProps: GetServerSideProps<PaymentProps> = async (ctx) => {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(ctx);
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session)
    return {
      redirect: {
        destination: '/signin',
        permanent: false,
      },
    };

  // get the client secret from the supabase database
  const { data, error } = await supabase.from('stripe_data').select('*');

  if (error) {
    console.log(error);
    return{
      redirect: {
        destination: '/error',
        permanent: false,

      }
    }
  }

  return {
    props: {
      clientSecret: data ? data[0].clientSecret : null
    },
  };
};

export default Payment;

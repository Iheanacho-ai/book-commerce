import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../components/checkout-form';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { GetServerSideProps, NextPage } from 'next';


interface PaymentProps {
  clientSecret: string;
}

const Payment: NextPage<PaymentProps> = ({ clientSecret }) => {
  return (
    <CheckoutForm clientSecret={clientSecret} />
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

  console.log(data, 'payment');
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

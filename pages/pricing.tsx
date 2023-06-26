import ProductDisplay from "../components/product-display";
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { server } from '../config';
import { GetServerSideProps, NextPage } from 'next';

interface PricingProps {
  email: string;
  customerID: string;
  sessionid: string;
}

const Pricing: NextPage<PricingProps> = ({ email, customerID, sessionid }) => {
  return (
    <div>
      <ProductDisplay customerID={customerID} sessionid={sessionid} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<PricingProps> = async (ctx) => {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(ctx);
  // get the user session from supabase
  const { data: { session } } = await supabase.auth.getSession();
  // get the user email from the session
  const email = session?.user?.email || ''; 

  const createCustomerID = async () => {
    let findCustomer;
    // check if customer already exists
    try {
      const res = await fetch(`${server}/api/search-customer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        },
        body: JSON.stringify({
          email,
        }),
      });

      const searchedCustomer = await res.json();

      //save customer data in a variable
      findCustomer = searchedCustomer.checkCustomer.data;
    } catch (error) {
      console.log(error);
    }

    // save the customer ID if the customer exists
    if (findCustomer && findCustomer.length > 0) {
      return findCustomer[0].id;
    } else {
      // if the customer does not exist, create customer
      try {
        const res = await fetch(`${server}/api/create-customer`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
          },
          body: JSON.stringify({
            email,
          }),
        });

        const newCustomer = await res.json();
        return newCustomer.customer.id;
      } catch (error) {
        console.log(error);
      }
    }
  };

  const customerID = await createCustomerID();

  const findExisitingSubscriptions = async (customerID: string) => {
    // retrieve all the subscriptions from the Stripe database
    try {
      const res = await fetch(`${server}/api/search-subscriptions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        },
      });

      const ListedSubscriptions = await res.json();
      const subscriptionData = ListedSubscriptions.subscriptionList.data;

      if (subscriptionData && subscriptionData.length > 0) {
        // filter through the subscriptions using the customer ID
        const filteredSubscription = ListedSubscriptions.subscriptionList.data.filter((subscription: { customer: string }) => {
          return subscription.customer === customerID;
        });

        return filteredSubscription[0].status;
      } else {
        return;
      }
    } catch (error) {
      console.log('error retrieving the subscriptions', error);
    }
  };

  const status = await findExisitingSubscriptions(customerID);

  console.log(status)

  if (!session) {
    // if there is no active user session, redirect to the signin page
    return {
      redirect: {
        destination: '/signin',
        permanent: false,
      },
    };
  } 
  
  else if (status === 'active') {
    // if the user is authenticated and has an active subscription, redirect to the catalog page
    return {
      redirect: {
        destination: '/catalog-page',
        permanent: false,
      },
    };
  } 
  
  else if (status !== 'active'){
    // if the user is authenticated but does not have active subscription, render the Pricing Page
    return {
      props: {
        email,
        customerID,
        sessionid: session.user.id,
      },
    }
  }

  return {
    props: {
      email,
      customerID,
      sessionid: session.user.id,
    },
  };
};

export default Pricing;

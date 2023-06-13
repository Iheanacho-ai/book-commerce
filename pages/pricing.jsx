import ProductDisplay from "../components/product-display";
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { server } from '../config';

const Pricing = ({ email, customerID}) => { 
  return (
    <div>
      <ProductDisplay customerID={customerID} />
    </div>
  )
}



export const getServerSideProps = async (ctx) => {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(ctx)
  // get the user session from supabase
  const { data: { session }, } = await supabase.auth.getSession()
  //get the user email from the session
  let email

  if(session){
    email = session.user.email
  }

  // let customerID

  const createCustomerID = async () => {
    let findCustomer
    //check if customer already exists
    try {
      const res = await fetch(`${server}/api/search-customer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`

        },
        body: JSON.stringify({
          email
        })
      })
      
    
      const searchedCustomer = await res.json();
      findCustomer = searchedCustomer.checkCustomer.data
    } catch (error) {
      console.log(error)
    }

  

    //saves the customer ID if the customer exists
    if (findCustomer && findCustomer.length > 0) {
      return findCustomer[0].id
    } else {
      // if the customer does not exist create customer
      try {
        const res = await fetch(`${server}/api/create-customer`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`
          },
          body: JSON.stringify({
            email
          })
        })

        const newCustomer = await res.json();
        return newCustomer.customer.id
      } catch (error) {
        console.log(error)
      }
    }
  }


  const customerID = await createCustomerID()


  // find if the customer has created an exiting subscription already
  const findExisitingSubcriptions = async (customerID) => {
    //retreive all the subscriptions on the stripe database
    try {
      const res = await fetch(`${server}/api/search-subscriptions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`
        }
      })
      const ListedSubscriptions = await res.json();
      const subscriptionData = ListedSubscriptions.subscriptionList.data
      if(subscriptionData && subscriptionData.length > 0){
        // filter through the subscriptions using the customer ID

        const filteredSubscription = ListedSubscriptions.subscriptionList.data.filter(subscription => {
          return subscription.customer === customerID
        })

        return filteredSubscription[0].status
        
      }else{
        return
      }
      
    } catch (error) {
      console.log('error retrieving the subscriptions', error)
      
    }
  }

  const status = await findExisitingSubcriptions(customerID)

  if (!session) {
    // if there is no active user session, redirect to the signin page
    return {
      redirect: {
        destination: '/signin',
        permanent: false,
      },
    }
  } else if (status === 'active') {
    // if user is authenticated and has an active subscription, redirect to the catalog page
    return {
      redirect: {
        destination: '/catalog-page',
        permanent: false,
      },
    }
  }
 

  return {
    props: {
      email,
      customerID
    }
  }
}

export default Pricing;
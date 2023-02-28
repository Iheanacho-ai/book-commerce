import ProductDisplay from "../components/product-display";
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from "react";

const Pricing = ({ email}) => {
  const [customerID, setCustomerID] = useState()
  const createStripeCustomer = async () => {
    let findCustomer
    //check if customer already exists
    try {
      const res = await fetch('/api/search-customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
    if (findCustomer.length !== 0) {
      setCustomerID(findCustomer[0].id)
    } else {
      // if the customer does not exist create customer
      try {
        const res = await fetch('/api/create-customer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email
          })
        })

        const newCustomer = await res.json();
        setCustomerID(newCustomer.customer.id)
      } catch (error) {
        console.log(error)
      }
    }
  }

  useEffect(() => {
   //create new customer when the page loads
    createStripeCustomer()
  }, [])


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

  //check if there is an active subscription

  const res = await fetch('http://localhost:3000/api/search-subscriptions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email
    })
  })
  

  const searchedSubscriptions = await res.json();
  const emailSubscription = searchedSubscriptions.subscription.data

  if (!session) {
    // if there is no active user session, redirect to the signin page
    return {
      redirect: {
        destination: '/signin',
        permanent: false,
      },
    }
  }else if(emailSubscription){
    // if there is an active user session and an active subscription redirect to the catalog page
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
      emailSubscription
    }
  }
}

export default Pricing;
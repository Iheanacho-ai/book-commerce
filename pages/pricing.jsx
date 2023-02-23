import ProductDisplay from "../components/product-display";
import { Stripe } from 'stripe';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from "react";

const Pricing = ({ email }) => {
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
      console.log('findCustomer', findCustomer)
    } catch (error) {
      console.log(error)
    }

    //saves the customer ID if the customer exists
    if (findCustomer.length !== 0) {
      setCustomerID(findCustomer[0].id)
      console.log('customer ID first', findCustomer[0].id)
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
        console.log('customer ID second', newCustomer.customer.id)
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
  console.log(session)
  //get the user email from the session
  const email = session.user.email

  if (!session) {
    return {
      redirect: {
        destination: '/signin',
        permanent: false,
      },
    }
  }

  return {
    props: {
      email
    }
  }
}

export default Pricing;
import ProductDisplay from "../components/product-display";
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from "react";
import { server } from '../config';

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
          'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`

        },
        body: JSON.stringify({
          email
        })
      })
      
    
      const searchedCustomer = await res.json();
      findCustomer = searchedCustomer.checkCustomer.data
      console.log('find customer', findCustomer)
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
            'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`
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

  const findExisitingSubcriptions = async () => {
    try {
      const res = await fetch('/api/search-subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`
        }
      })
      const ListedSubscriptions = await res.json();
      console.log(ListedSubscriptions)
    } catch (error) {
      console.log(error)
      
    }
  }

  useEffect(() => {
   //create new customer when the page loads
    createStripeCustomer()
    findExisitingSubcriptions()
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


  if (!session) {
    // if there is no active user session, redirect to the signin page
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
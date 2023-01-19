import ProductDisplay from "../components/product-display"
import { Stripe } from 'stripe';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const Pricing = ({customerId}) => {
  console.log(customerId, 'Customerid Pricing')
  return(
    <div>
      <ProductDisplay customerId={customerId}/>
    </div>
  )
}

export const getServerSideProps = async (ctx) => {
  //create customer variable
  let customerId
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(ctx)
  // get the user session from supabase
  const { data: { session }, } = await supabase.auth.getSession()
  //get the user email from the session
  const email = session.user.email


  //create stripe customer
  const createCustomer = async () => {
    let createdCustomer;
    let customerAvailable;
    
    try {
      const checkCustomer = await stripe.customers.search({
        query: `email: '${email}'`
      })  
      
      createdCustomer = JSON.parse(JSON.stringify(checkCustomer))
      customerAvailable = createdCustomer.data
      
    } catch (error) {
      console.log(error)
      
    }
    
    if (customerAvailable.length) {
      customerId = createdCustomer.data[0].id
    } else {
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
          customerId = newCustomer.customer.id

        } catch (error) {
          console.log(error) 
        }
      }

  }

  if (session) {
    createCustomer()
      
  } else {
      return{
        redirect: {
            destination: '/signin',
            permanent: false,
        }
      }
    }

  return {
    props: {
      customerId
    },
  }
}

export default Pricing;
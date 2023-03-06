import ProductDisplay from "../components/product-display";
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { server } from '../config';

const Pricing = ({ email, customerID}) => { 
  console.log('customer ID pricing', customerID)
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
    if (findCustomer) {
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




  if (!session) {
    // if there is no active user session, redirect to the signin page
    return {
      redirect: {
        destination: '/signin',
        permanent: false,
      },
    } 
  }
 
  console.log('custommerID', customerID)

  return {
    props: {
      email,
      customerID
    }
  }
}

export default Pricing;
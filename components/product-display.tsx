import React from 'react';
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { GetServerSideProps } from 'next';

interface ServerSideProps {
  sessionid: string;
}

interface ProductDisplayProps {
    customerID: string;
    sessionid: string;
}

const subscriptionPackages = [
    {
        subscriptionPackage: "Starter",
        price: "30",
        priceID: "price_1MLWJFBpQhjuYMrzoyyf6uwq",
        loading: false
    },
    {
        subscriptionPackage: "Pro",
        price: "50",
        priceID: "price_1MLWKoBpQhjuYMrzcjP4I4xm",
        loading: false
    },
    {
        subscriptionPackage: "Family",
        price: "100",
        priceID: "price_1MLWXPBpQhjuYMrzCRJnTnZF",
        loading: false
    },
]


const ProductDisplay: React.FC<ProductDisplayProps> = ({ customerID, sessionid }) => {
    const router = useRouter()
    const [overlay, setOverlay] = useState(false)
    const user = useUser()
    const supabaseClient = useSupabaseClient()

    const addIdToStripe = async (subscriptionId: string, clientSecret: string) => {
        if (subscriptionId && clientSecret) {
          if (user) {
            // retrieve the data on the database to create ids
            const { data, error } = await supabaseClient
              .from('stripe_data')
              .select('*');
      
            if (!error) {
              console.log(data, 'data in the if and else block');
              console.log(data.length, 'data length in the if and else block');
              if (data.length > 0) {
                // if there is an existing stripe data, update the data
                const { error } = await supabaseClient
                  .from('stripe_data')
                  .update({ subscriptionId, clientSecret })
                  .eq('id', 1);
      
                if (error) {
                  console.log('error creating updating stripe data database', error);
                } else {
                  // if there is no error, route to the payment page to collect user information
                  router.push('/payment');
                }
              } else {
                alert('yeah');
                // create a unique id for each user that signs in
                const uniqueId = `${sessionid}-1`;
                // if there is no existing stripe data, create a new one
                const { error } = await supabaseClient
                  .from('stripe_data')
                  .insert({
                    id: 1,
                    subscriptionId: subscriptionId,
                    clientSecret: clientSecret,
                    item_id: uniqueId
                  });
      
                if (error) {
                  console.log('error creating a new stripe data on the database', error);
                } else {
                  // if there is no error, route to the payment page to collect user information
                  router.push('/payment');
                }
              }
            } else {
              console.log('error retrieving data', error);
            }
          } else {
            return;
          }
        }
    };
      

    const createSubscription = async (priceID: string) => {
        // Change the button to Loading
        const UpdateLoading = subscriptionPackages.find((obj) => obj.priceID === priceID) as typeof subscriptionPackages[number] | undefined;
        if (UpdateLoading) {
          UpdateLoading.loading = true;
        }
        
        setOverlay(true);
        // create a new subscription
        try {
          const subscriptionDetails = await fetch('/api/create-subscription', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`
            },
            body: JSON.stringify({
              priceID,
              customerID
            })
          });
      
          const newSubscription = await subscriptionDetails.json();
          const { subscriptionId, clientSecret } = newSubscription;
      
          // add the subscriptionId and Client secret data from stripe to supabase
          addIdToStripe(subscriptionId, clientSecret);
        } catch (error) {
          // console any error encountered during gathering of the data
          console.log(error);
        }
    };
      
      


    return (
        <div className={`flex pt-[30px] px-[40px] ${overlay ? 'opacity-50' : ''}`}>
            <div className="min-w-full">
                <p className="text-[#00153B] text-[20px] leading-[40px] font-semibold">
                    Your Subscription
                </p>

                <div>
                    <p className="text-[#717F87] text-[15px] leading-[27px] font-medium">
                        Choose the Package that works with you.
                    </p>
                </div>

                <div className="mt-[20px] display:block lg:grid grid-cols-3 gap-[20px] position:relative">
                    
                    {
                        subscriptionPackages.map(({ subscriptionPackage, price, priceID, loading }) => (
                            <div key={priceID} className="mt-5 w-full bg-[#fff] rounded-[10px] shadow-[0px 1px 2px #E1E3E5] border border-[#E1E3E5] divide-y">
                                <div className="pt-[15px] px-[25px] pb-[25px]">
                                    <div className="flex justify-end">
                                        <div className="bg-[#F6F6F7] rounded-[20px] flex justify-center align-center px-[12px]">
                                            <p className="text-[#00153B] text-[12px] leading-[28px] font-bold">
                                                {subscriptionPackage}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col justify-center px-2 py-8 space-y-4">
                                        <p className="text-5xl font-bold">{price}$
                                            <span className="text-xl"> /mo</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-[25px] px-[25px] pb-[35px]">
                                    <div className="mt-[25px]">
                                        <input type="hidden" name="lookup_key" />
                                        <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-semibold rounded-lg text-sm py-[15px] px-[25px] text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center" id={priceID} onClick={() => { createSubscription(priceID) }}>
                                            {
                                                loading ? (
                                                    <div>
                                                        <svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                                                        </svg>
                                                        Loading...
                                                    </div>

                                                ): <div>
                                                    Choose Plan
                                                </div>
                                            }
                                           
                                        </button>
                                    </div>
                                </div>
                            </div>

                        ))
                    }
                </div>
            </div>
        </div>
    )
}


export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (ctx) => {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(ctx);
  
  // Check if we have a session
  const { data: { session } } = await supabase.auth.getSession();
  
  // collect the subscription of a user
  
  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  
  return {
    props: {
      sessionid: session.user.id,
    },
  };
};


export default ProductDisplay;
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'
import { useState } from 'react'


const AccountPage = ({user}) => {
    const supabaseClient = useSupabaseClient()
    const router = useRouter()
    

    const cancelSubscription = async () => {
        const { data, error } = await supabase
            .from('stripe_data')
            .select()
      
        if (error) {
          console.log(error)
        }
        try {
            await fetch('/api/cancel-subscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                   subscriptionId: data.subscriptionId
                })
            }) 
        } catch (error) {
            console.log(error)            
        }

    }


    const signOut = async () => {
       await supabaseClient.auth.signOut();
       router.reload()
    }
    
    return(
        <div className="account-page w-full flex justify-center">
            <div className="overflow-hidden bg-white shadow sm:rounded-lg w-3/5">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">User Information</h3>
                </div>
                <div className="border-t border-gray-200">
                    <dl>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">User name</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{user.name}</dd>
                        </div>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Email address</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{user.email}</dd>
                        </div>
                    </dl>
                </div>
                <button className='lg:inline-block py-2 px-6 mt-6 mb-6 ml-4 text-white bg-blue-600 hover:bg-blue-700 text-sm text-gray-900 font-bold rounded-xl right-0' onClick={signOut}>Sign Out</button>
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Subscription</h3>
                </div>
                <div className="border-t border-gray-200">
                    <dl>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Subscription Tier</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">user.name</dd>
                        </div>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Email address</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">user.email</dd>
                        </div>
                    </dl>
                    <button className='lg:inline-block ml-4 lg:mr-3 py-2 px-6 mt-6 mb-6 text-white bg-red-600 hover:bg-blue-700 text-sm text-gray-900 font-bold rounded-xl right-0' onClick={cancelSubscription}>Cancel Subscription</button>
                </div>
            </div>     
        </div>
    )
} 

export const getServerSideProps = async (ctx) => {
    // Create authenticated Supabase Client
    const supabase = createServerSupabaseClient(ctx)
    // Check if we have a session
    const {
      data: { session },
    } = await supabase.auth.getSession()
  
    if (!session)
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      }
  
    return {
      props: {
        initialSession: session,
        user: session.user,
      },
    }
}

export default AccountPage;

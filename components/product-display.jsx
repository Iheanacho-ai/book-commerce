import { supabase } from '../utils/index';
import { useRouter } from 'next/router'
import { useState } from 'react';

const subscriptionPackages = [
    {
        subscriptionPackage: "Starter",
        price: "30",
        priceID: "price_1MLWJFBpQhjuYMrzoyyf6uwq"
    },
    {
        subscriptionPackage: "Pro",
        price: "50",
        priceID: "price_1MLWKoBpQhjuYMrzcjP4I4xm"
    },
    {
        subscriptionPackage: "Family",
        price: "100",
        priceID: "price_1MLWXPBpQhjuYMrzCRJnTnZF"
    },
]

const ProductDisplay = ({ customerID }) => {
    const router = useRouter()
    console.log('product display ID', customerID)
    const [subscriptionId, setSubscriptionId] = useState()
    const [clientSecret, setClientSecret] = useState()

    const addIdToStripe = async () => {
        if(subscriptionId && clientSecret){
            const { error } = await supabase
                .from('stripe_data')
                .insert(
                    {
                        id: 1,
                        subscriptionId: subscriptionId,
                        clientSecret: clientSecret
                    }
    
    
                )


            if(error){
                console.log(error)
            }else{
               router.push('/payment') 
            }

        }

    }

    const createSubscription = async (priceID) => {
        // create a new subscription
        try {
            const subscriptionDetails = await fetch('/api/create-subscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    priceID,
                    customerID
                })
            })

            const newSubscription = await subscriptionDetails.json();
            const {subscriptionId, clientSecret} = newSubscription
            setSubscriptionId(subscriptionId)
            setClientSecret(clientSecret)

            // add the subscriptionId and Client secret data from stripe to supabase
            
            addIdToStripe()


        } catch (error) {
            console.log(error)
        }
    }


    return (
        <div className='flex pt-[30px] px-[40px]'>
            <div className="min-w-full">
                <p className="text-[#00153B] text-[20px] leading-[40px] font-semibold">
                    Your Subscription
                </p>

                <div>
                    <p className="text-[#717F87] text-[15px] leading-[27px] font-medium">
                        Choose the Package that works with you.
                    </p>
                </div>

                <div className="mt-[20px] grid grid-cols-3 gap-[20px]">
                    {
                        subscriptionPackages.map(({ subscriptionPackage, price, priceID }) => (
                            <div key={priceID} className="w-full bg-[#fff] rounded-[10px] shadow-[0px 1px 2px #E1E3E5] border border-[#E1E3E5] divide-y">
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
                                        <button className="bg-[#006EF5] rounded-[5px] py-[15px] px-[25px] text-[#fff] text-[14px] leading-[17px] font-semibold" id={priceID} type="button" onClick={() => { createSubscription(priceID) }}>Choose Plan</button>
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


export default ProductDisplay;
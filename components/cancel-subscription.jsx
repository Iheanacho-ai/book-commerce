import {useState} from 'react';

const CancelSubscriptionButton = () => {
    const [subscriptionId, setSubscriptionId] = useState()

    const cancelSubscription = async() => {
        try {
            const response = await fetch('/api/cancel-subscription', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`
                },
                body: JSON.stringify({
                    subscriptionId: subscriptionId,
                }),
            })
    
            alert('subscription has been cancelled')
        } catch (error) {
            console.log(error)
            
        }

    }
    return(
        <div className="cancel-subscription">
            <button className="bg-[#006EF5] rounded-[5px] py-[15px] px-[25px] text-[#fff] text-[14px] leading-[17px] font-semibold" onClick={cancelSubscription}> Cancel Subscription</button>
        </div>
    )
}

export default CancelSubscription
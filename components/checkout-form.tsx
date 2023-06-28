import React, { useState } from 'react';
import PaymentSuccess from './payment-success-modal';
import {
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

interface CheckoutFormProps {
  clientSecret: string;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ clientSecret }) => {
  const stripeInstance = useStripe();
  const elements = useElements();
  const [name, setName] = useState<string | undefined>();
  const [open, setOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    //
    event.preventDefault();
    if (elements == null || stripeInstance == null) {
      return;
    }

    setIsProcessing(true)
  
    const cardElement = elements.getElement(CardElement);
  
    if (cardElement) {
      const { paymentIntent, error } = await stripeInstance.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name,
          },
        },
      });
  
      if (error) {
        console.log("Error", error)
      } else if (paymentIntent.status === 'succeeded') {
        setOpen(true);
      } else {
        console.log('Unexpected PaymentIntent status', paymentIntent.status);
      }

      setIsProcessing(false)
    } else {
      console.log('Card element is null');
      setIsProcessing(false)
    }
  };

  return (
    <section className="abg-gray-100 text-gray-600 min-h-3/4 p-4">
      <PaymentSuccess open={open} setOpen={setOpen} />
      <h2 className="mb-7 text-center font-bold font-mono">Input your card details to complete the subscription</h2>
      <div className="h-full">
        <form onSubmit={handleSubmit}>
          <div className="relative px-4 sm:px-6 lg:px-8 pb-8 max-w-lg mx-auto" x-data="{ card: true }">
            <div className="bg-white px-8 pb-6 rounded-b shadow-lg">
              <div x-show="card ">
                <div className="space-y-4 ">
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="card-name">
                      Name on Card <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="card-name"
                      className="text-sm text-gray-800 bg-white border rounded leading-5 py-2 px-3 border-gray-200 hover:border-gray-300 focus:border-indigo-300 shadow-sm placeholder-gray-400 focus:ring-0 w-full"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="card-name">
                      Card Details <span className="text-red-500">*</span>
                    </label>
                    <CardElement />
                  </div>
                </div>
                <div className="mt-6">
                  <div className="mb-4">
                    <button
                      className="font-medium text-sm inline-flex items-center justify-center px-3 py-2 border border-transparent rounded leading-5 shadow-sm transition duration-150 ease-in-out w-full bg-indigo-500 hover:bg-indigo-600 text-white focus:outline-none focus-visible:ring-2"
                      type="submit"
                      disabled={!stripeInstance || !elements || isProcessing}
                    >
                      {isProcessing ? "Processing" : "Subscribe"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CheckoutForm;

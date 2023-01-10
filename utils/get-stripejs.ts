// ./utils/get-stripejs.ts
import { Stripe, loadStripe } from '@stripe/stripe-js';
import { createClient } from '@supabase/supabase-js'

let stripePromise: Promise<Stripe | null>;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};

const getstripe = getStripe()

// Create a single supabase client for interacting with your database
export const supabase = createClient('https://kquopthsrnfngrtqsbiq.supabase.co', process.env.NEXT_PUBLIC_SUPABASE_KEY)

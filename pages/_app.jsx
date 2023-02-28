import '../styles/globals.css'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider, Session } from '@supabase/auth-helpers-react'
import { useState } from 'react'
// import type { AppProps } from 'next/app'
import NavBar from '../components/navbar'
import Footer from '../components/footer'

export default function App({ Component, pageProps }) {
  // Create a new supabase browser client on every first render.
  const [supabaseClient] = useState(() => createBrowserSupabaseClient())
  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <div>
        <NavBar/>
        <div className= 'bookify-body'>
          <Component {...pageProps} />
        </div>
        <Footer/>
      </div>
    </SessionContextProvider>
  )
}



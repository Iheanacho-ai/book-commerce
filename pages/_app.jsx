import '../styles/globals.css'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider, Session } from '@supabase/auth-helpers-react'
import { useState } from 'react'
// import type { AppProps } from 'next/app'
import NavBar from '../components/navbar'
import Footer from '../components/footer'
import { Cron } from 'react-js-cron'
import 'react-js-cron/dist/styles.css'

export default function App({ Component, pageProps }) {
  // Create a new supabase browser client on every first render.
  const [supabaseClient] = useState(() => createBrowserSupabaseClient())
  const [value, setValue] = useState('0 20 28 * 6')
  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <div>
        <NavBar/>
        <div className= 'bookify-body'>
          <Cron value={value} setValue={setValue} />
          <Component {...pageProps} />
        </div>
        <Footer/>
      </div>
    </SessionContextProvider>
  )
}



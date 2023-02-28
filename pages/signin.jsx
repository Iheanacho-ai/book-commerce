import { Auth, ThemeSupa } from '@supabase/auth-ui-react'
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const LoginPage = () => {
  const [path, setPath] = useState()
  const supabaseClient = useSupabaseClient()
  const user = useUser()
  const router = useRouter()

  if(user){
    router.push('/pricing');
  }

  useEffect(() => {
    setPath(`${window.location.hostname}/catalog-page`)
  })

  useEffect(()=> {
    console.log(path, 'path')
  }, [path])

  if (!user)
    return (
      <div className="auth w-full flex justify-center">
        <div className="justify-center  h-[65vh] mt-11 w-96">
          <Auth
            redirectTo='http://localhost:3000/pricing'
            appearance={{ theme: ThemeSupa }}
            supabaseClient={supabaseClient}
            providers={['google']}
            socialLayout="vertical"
          />
        </div>
      </div>
    )

}

export default LoginPage
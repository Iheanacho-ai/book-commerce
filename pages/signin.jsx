import { Auth, ThemeSupa } from '@supabase/auth-ui-react'
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'

const LoginPage = () => {
  const supabaseClient = useSupabaseClient()
  const user = useUser()
  const router = useRouter()

  if(user){
    router.push('/pricing');
  }


  if (!user)
    return (
      <div className="auth w-full flex justify-center">
        <div className="justify-center  h-[65vh] mt-11 w-96">
          <Auth
            redirectTo="http://localhost:3000/catalog-page"
            appearance={{ theme: ThemeSupa }}
            supabaseClient={supabaseClient}
            providers={['google']}
            socialLayout="horizontal"
          />
        </div>
      </div>
    )

}

export default LoginPage
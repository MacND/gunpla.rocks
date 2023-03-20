import { createClient } from '@supabase/supabase-js';
import router from '@/router'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const handleOAuthLogin = async (p) => {
  await supabase.auth.signInWithOAuth({ 
    provider: p.provider,
    options: {
      redirectTo: window.location.origin
    }
  });
};

export const signOut = async() => {
  try {
    let { error } = await supabase.auth.signOut()
    if (error) throw error
    router.push({name: "login"})
  } catch (error) {
    console.error(error.message)
  }
}

export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession()
  const { session, user } = data
  return session
}

export const getUserData = async (session) => {
  try {
    return await supabase.auth.getSession().session.user;
  } catch {
    console.log('Error while retrieving user data')
  }
}


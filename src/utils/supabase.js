import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const handleOAuthLogin = async () => {
    const loginRes = await supabase.auth.signInWithOAuth({ provider: "discord" });
};

export const signOut = async() => {
    try {
      let { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error(error.message)
    }
  }

export const getSession = async () => {
    return await supabase.auth.getSession();
}
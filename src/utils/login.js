import router from '../router';
import { supabase } from '../supabase'

export async function handleLogin() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'discord'
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
    }
  }
}

export async function signOut() {
  try {
    let { error } = await supabase.auth.signOut()
    if (error) throw error
    router.push({name: 'login'})
  } catch (error) {
    console.error(error.message)
  }
}

export async function getSession() {
  try {
    let {data, error} = await supabase.auth.getSession();
    if (data) {
      return data.session
    }
    if (error) throw error
  } catch (error) {
    console.error(error.message)
  }
}

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
    console.error(error)
  }
}

export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession()
  const { session, user } = data
  return session
}

export const getSelfCollection = async () => {
  try {
    const session = await getSession();

    const { data, error } = await supabase
      .from('user_collection')
      .select('*')
      .eq('user_id', session.user.id);

    if (error) throw error

    return data
  } catch (error) {
    console.error(error)
  }
}

export const addKitToCollection = async (kitNumber) => {
  try {
    const { data, error } = await supabase
      .from('collections')
      .insert([
        { model_number: kitNumber },
      ])

    if (error) throw error
  } catch (error) {
    console.error(error)
  }
}

export const insertExtendedProfileName = async (userID, Name) => {
  try {
    const { data, error } = await supabase.rpc('insert_profile_name', { userID: userID, Name: Name });
    if (error) throw error
  } catch (error) {
    console.error(error)
  }
}

export const getExtendedProfile = async () => {
  try {
    const session = await getSession();

    const { data, error } = await supabase
      .from('extended_profiles_view')
      .select('*')
      .eq('id', session.user.id)
      .limit(1)

    if (error) throw error

    return data.pop()
  } catch (error) {
    console.error(error)
  }
}
import { createClient } from '@supabase/supabase-js';
import router from '@/router'
import { compileScript } from 'vue/compiler-sfc';

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

export const getUserProfile = async (userID) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userID);
  
    if (error) throw error

    return data.pop()
  } catch (error) {
    console.error(error)
  }
}

export const getSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession()

    if (error) throw error
    
    if (data) {
      const { session, user } = data
      return session
    }

  } catch (error) {
    console.error(error)
  }
}

export const getUser = async (username) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username);
  
    if (error) throw error

    return data.pop()
    } catch (error) {
      console.error(error)
    }
}

export const getSelfCollection = async () => {
  try {
    const session = await getSession();

    if (session) {
      const { data, error } = await supabase
        .from('user_collection')
        .select('*')
        .eq('user_id', session.user.id);

      if (error) throw error

      return data
    }
  } catch (error) {
    console.error(error)
  }
}

export const getCollectionForUser = async (userID) => {
  try {

    const { data, error } = await supabase
      .from('user_collection')
      .select('*')
      .eq('user_id', userID);

    if (error) throw error

    return data

  } catch (error) {
    console.error(error)
  }
}

export const removeKitFromCollection = async (kitNumber) => {
  try {
    const { data, error } = await supabase
      .from('collections')
      .delete()
      .eq('model_number', kitNumber)

    if (error) throw error
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

export const getSelfProfile = async () => {
  try {
    const session = await getSession();

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .limit(1)

    if (error) throw error

    return data.pop()
  } catch (error) {
    console.error(error)
  }
}
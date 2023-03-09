<script setup lang="ts">
import { Auth, type Appereance, css, ThemeSupa } from 'vue-auth-ui'

import { supabase } from '../../utils/supabase'

const appearance: Appereance = {
  theme: ThemeSupa,
  themeVariant: 'dark',
  // In addition to theme and variant you can specify other preferences.
  // More on that in the "customization" section.
  prependedClassName: 'oauthLoginButtons',
  className: {
    button: css({
      margin: "0 auto",
      width: "50vw"
    })
  }
}

let myError: string | undefined
</script>

<template>
  <Auth
    :providers="['discord', 'google']"
    socialLayout="col"
    :appearance="appearance"
    :error="myError"
    :onlyThirdPartyProviders="true"
    @signInWithOAuth="provider => supabase.auth.signInWithOAuth(provider)"
  />
</template>

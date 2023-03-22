// plugins/vuetify.js
import { createVuetify } from 'vuetify'
import 'vuetify/styles'

import '@fortawesome/fontawesome-free/css/all.css'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

export default createVuetify({
  theme: {
    defaultTheme: 'dark'
  },
  icons: {
    defaultSet: 'mdi',
    iconfont: 'mdi',
    aliases,
    sets: {
      mdi
    },
    // github: {
    //   component: FontAwesomeIcon,
    //   props: {
    //     icon: ["fab", "github"]
    //   }
    // }
  }
})
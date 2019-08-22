import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify)

export default new Vuetify({
    icons: {
        iconfont: 'mdi',
    },
    theme: {
        themes: {
            light: {
                primary: colors.orange.darken1,
                secondary: colors.orange.lighten2,
                accent: colors.indigo.lighten2,
            },
            dark: {
                primary: colors.indigo.darken1,
                secondary: colors.indigo.lighten2,
                accent: colors.orange,
            }
        }
    }
})

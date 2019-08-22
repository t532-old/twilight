import colors from 'vuetify/lib/util/colors'
export default function initTheme(ref, name) {
    ref.$vuetify.theme.themes.light.primary = colors[name].darken1
    ref.$vuetify.theme.themes.light.secondary = colors[name].lighten2
    ref.$vuetify.theme.themes.dark.primary = colors[name].darken1
    ref.$vuetify.theme.themes.dark.secondary = colors[name].lighten2
}

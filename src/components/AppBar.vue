<template>
    <v-app-bar app color="secondary black--text">
        <v-app-bar-nav-icon color="black" @click="nav.drawer = !nav.drawer"></v-app-bar-nav-icon>
        <v-toolbar-title class="headline">
            <span>WhoJudge</span>
            <span class="font-weight-light">OJ</span>
        </v-toolbar-title>
        <v-spacer />
        <v-btn @click="$vuetify.theme.dark = !$vuetify.theme.dark" icon>
            <v-icon v-if="$vuetify.theme.dark" color="black">mdi-lightbulb</v-icon>
            <v-icon v-else color="black">mdi-lightbulb-outline</v-icon>
        </v-btn>
        <v-btn icon :to="userPage">
            <v-icon color="black">mdi-account</v-icon>
        </v-btn>
    </v-app-bar>
</template>

<script>
import nav from '@/shared/nav'
import user from '@/shared/user'
export default {
    name: 'AppBar',
    data: () => ({
        nav,
        user
    }),
    computed: {
        userPage() {
            return this.user.info.id ? `/user/${this.user.info.id}` : `/login`
        }
    }
}
</script>

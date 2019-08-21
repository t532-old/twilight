<template>
    <v-app-bar app color="primary white--text">
        <v-app-bar-nav-icon color="white" @click="nav.drawer = !nav.drawer"></v-app-bar-nav-icon>
        <v-toolbar-title class="headline">
            <span>WhoJudge</span>
            <span class="font-weight-light">OJ</span>
        </v-toolbar-title>
        <v-spacer />
        <v-btn :href="userPage" icon>
            <v-icon color="white">mdi-account</v-icon>
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

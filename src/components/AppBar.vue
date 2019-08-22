<template>
    <v-app-bar app color="secondary black--text">
        <v-app-bar-nav-icon color="black" @click="nav.drawer = !nav.drawer"></v-app-bar-nav-icon>
        <v-toolbar-title class="headline hover-and-display-parent">
            <span>Wh</span>
            <span class="font-weight-light">OJ</span>
            <span class="font-weight-light hover-and-display-child">udge</span>
        </v-toolbar-title>
        <v-spacer />
        <v-btn @click="toggleDarkMode" icon>
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
    methods: {
        toggleDarkMode() {
            this.$vuetify.theme.dark = !this.$vuetify.theme.dark
            localStorage.setItem('darkMode', this.$vuetify.theme.dark)
        }
    },
    computed: {
        userPage() {
            return this.user.info.id ? `/user/${this.user.info.id}` : `/login`
        }
    },
    mounted() {
        this.$vuetify.theme.dark = localStorage.getItem('darkMode') === 'true' ? true : false
    },
}
</script>

<style scoped>
.headline {
    cursor: default;
}
.hover-and-display-child {
    opacity: 0;
    transition: .2s opacity ease;
}
.hover-and-display-parent:hover .hover-and-display-child {
    opacity: 1;
}
a {
    text-decoration: none;
}
</style>

<template>
    <v-app>
        <NavDrawer />

        <AppBar />

        <v-content>
            <router-view />
        </v-content>
    </v-app>
</template>

<script>
import gql from 'graphql-tag'
import NavDrawer from './components/NavDrawer'
import AppBar from './components/AppBar'

import user from './shared/user'
import client from '@/util/client'
import { validateID } from '@/util/misc'

export default {
    name: 'App',
    components: {
        NavDrawer,
        AppBar,
    },
    data: () => ({
        user,
    }),
    async mounted() {
        const token = localStorage.getItem('userToken')
        if (token) {
            const { data: { token } } = await client.query({
                query: gql`query userInfo($userToken: String!) {
                    token(token: $userToken) {
                        user {
                            isAdmin
                            id
                            username
                        }
                    }
                }`,
                variables: {
                    userToken: localStorage.getItem('userToken') || ''
                }
            })
            this.user.info = token ? token.user : this.user.info
        }
    }
};
</script>

<style>
pre {
    font-family: 'Ubuntu Mono', 'Fira Code', 'Consolas', 'Monaco', 'Menlo', monospace !important;
}

pre[class*="language-"] {
    background: hsl(0, 0%, 8%) !important;
}

pre[class*="language-"] code {
    background: none !important;
    color: #f8f8f2 !important;
    font-family: 'Ubuntu Mono', 'Fira Code', 'Consolas', 'Monaco', 'Menlo', monospace !important;
    font-size: 1em !important;
    box-shadow: none !important;
}

pre[class*="language-"] code::before {
    letter-spacing: initial !important;
    content: initial !important;
}

pre[class*="language-"] code::after {
    letter-spacing: initial !important;
    content: initial !important;
}
</style>

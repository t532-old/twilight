<template>
    <v-container
        fluid
    >
        <v-card class="elevation-12 mx-auto" width="700" tile>
            <v-toolbar
                color="primary"
                dark
                flat
            >
                <v-toolbar-title>
                    <template v-if="typeof user.info.username === 'string'">
                        おかえり、{{ user.info.username }}さん♪
                    </template>
                    <template v-else>
                        ファ↑きょうもいいてんき★
                    </template>
                </v-toolbar-title>
                <v-spacer />
                <span class="text--secondary">twilight 1.0.0 / whojudge 1.0.0 / alice 1.0.1</span>
            </v-toolbar>
            <v-card-text>
                Welcome to WhoJudge!
                Start by clicking at the top-left menu button.
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
import initTheme from '@/theme'
import user from '@/shared/user'
export default {
    name: 'Home',
    data: () => ({
        user,
    }),
    mounted() {
        initTheme(this, 'blueGrey')
    }
}
</script>

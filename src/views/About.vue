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
                    Wh<span class="font-weight-light">OJudge</span>
                </v-toolbar-title>
                <v-spacer />
                <span class="text--secondary">twilight 1.0.0 / whojudge 1.0.0 / alice 1.0.1</span>
            </v-toolbar>
            <v-card-text>
                <p>The light, modern, simplistic online judge.</p>
                <p>A combination of a set of open-source projects, distributed under MIT License.</p>
                <div style="display: flex; justify-content: space-between;">
                    <div>
                        Frontend "twilight"
                        <div class="text--primary">t532 @ sfls</div>
                    </div>
                    <div>
                        Backend "whojudge"
                        <div class="text--primary">t532 @ sfls</div>
                    </div>
                    <div>
                        Judger "alice"
                        <div class="text--primary">t532 @ sfls</div>
                    </div>
                </div>
            </v-card-text>
            <v-card-actions>
                <v-btn href="https://github.com/sfls" text>
                    <v-icon>mdi-account-group</v-icon>
                    Org@sfls
                </v-btn>
                <v-spacer />
                <v-btn href="https://github.com/sfls/whojudge" text>
                    <v-icon>mdi-server</v-icon>
                    Backend
                </v-btn>
                <v-btn href="https://github.com/sfls/alice" text>
                    <v-icon>mdi-scale-balance</v-icon>
                    Judger
                </v-btn>
            </v-card-actions>
            <v-card-actions>
                <v-btn href="https://github.com/t532" text>
                    <v-icon>mdi-dev-to</v-icon>
                    Dev@t532
                </v-btn>
                <v-spacer />
                <v-btn href="https://github.com/t532/twilight" text>
                    <v-icon>mdi-application</v-icon>
                    Frontend
                </v-btn>
            </v-card-actions>
            <v-card-actions>
                <v-btn href="https://github.com/StephaneZhang" text>
                    <v-icon>mdi-dev-to</v-icon>
                    Dev@StephaneZ
                </v-btn>
                <v-spacer />
                <v-btn href="https://github.com/sfls/salicia" text>
                    <v-icon>mdi-application</v-icon>
                    Frontend
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-container>
</template>

<script>
import initTheme from '@/util/theme'
export default {
    name: 'About',
    mounted() {
        initTheme(this, 'green')
    }
}
</script>

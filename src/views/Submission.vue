<template>
    <v-container
        fluid
    >
        <v-card class="elevation-12 mx-auto" width="1000" tile>
            <v-toolbar
                color="primary"
                dark
                flat
            >
                <v-toolbar-title>
                    <span class="text--secondary">
                        Submission
                    </span>
                    by
                    <router-link class="white--text" :to="`/user/${info.user.id}`">{{ info.user.username }}</router-link>
                    on
                    <router-link class="white--text" :to="`/problem/${info.problem.id}`">{{ info.problem.title }}</router-link>
                </v-toolbar-title>
                <template v-slot:extension>
                    <v-tabs
                        v-model="tab"
                        background-color="primary"
                        dark
                        style="overflow: hidden"
                    >
                        <v-tabs-slider></v-tabs-slider>

                        <v-tab :to="`/submission/${info.id}/status`" style="margin-left: 0;">
                            <v-icon>mdi-information</v-icon>
                            Status
                        </v-tab>
                        <v-tab :to="`/submission/${info.id}/code`">
                            <v-icon>mdi-code-braces</v-icon>
                            Code
                        </v-tab>
                    </v-tabs>
                </template>
            </v-toolbar>
            
            <template v-if="mode === 'status'">
                <v-card-title>
                    <span :class="`${colorMap[info.status]}--text`">{{ info.status }}&nbsp;</span>
                    / {{ info.detail.reduce((a, i) => a + i.point, 0) }}&nbsp;
                    <span class="text--secondary">Points</span>
                </v-card-title>
                <v-card-text>
                    <v-expansion-panels>
                        <v-expansion-panel
                            v-for="dt in info.detail"
                            :key="dt.order"
                        >
                            <v-expansion-panel-header>
                                Testcase #{{ dt.order }}
                                <div style="margin-left: 10px;"><v-chip :color="colorMap[dt.status]">{{ dt.status }}</v-chip></div>
                            </v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <div style="display: flex; justify-content: space-between;">
                                    <div>
                                        {{ dt.point }}
                                        <div class="text--secondary">Points</div>
                                    </div>
                                    <div>
                                        {{ dt.time }}
                                        <div class="text--secondary">Time</div>
                                    </div>
                                    <div>
                                        {{ dt.memory }}
                                        <div class="text--secondary">Memory</div>
                                    </div>
                                </div>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <span style="font-size: smaller" class="text--secondary">Submission#{{ info.id }}</span>
                </v-card-actions>
                <v-card-actions>
                    <v-spacer />
                    <router-link :to="`/user/${info.user.id}`" style="font-size: smaller" class="text--secondary">By {{ info.user.username }} (User#{{ info.user.id }})</router-link>
                </v-card-actions>
                <v-card-actions>
                    <v-spacer />
                    <router-link :to="`/problem/${info.problem.id}`" style="font-size: smaller" class="text--secondary">At {{ info.problem.title }} (Problem#{{ info.problem.id }})</router-link>
                </v-card-actions>
            </template>
            
            <template v-if="mode === 'code'">
                <v-card-text>
                    <div class="text-uppercase">Language: {{ info.language }}</div>
                    <pre :class="`language-${langMap[info.language]}`"><code v-html="highlightedCode"></code></pre>
                </v-card-text>
            </template>
        </v-card>
        <v-snackbar v-model="onError">
            {{ error ? error.message.split(':')[1] : 'Something went wrong' }}
            <v-btn
                color="accent"
                text
                @click="onError = false"
            >
                Close
            </v-btn>
        </v-snackbar>
    </v-container>
</template>

<script>
import initTheme from '@/util/theme'
import client from '@/util/client'
import render from '@/util/markdown'
import user from '@/shared/user'
import gql from 'graphql-tag'
import router from '@/router'
import Prism from 'prismjs'
import loadHighlights from '@/util/loadHighlights'
import { submissionStatus } from '@/util/palette'

loadHighlights(Prism)

export default {
    name: 'Submission',
    props: ['mode'],
    data: () => ({
        tab: null,
        info: {
            id: '...',
            problem: {
                id: '...',
                title: '...',
            },
            user: {
                id: '...',
                username: '...',
            },
            code: '(Empty)',
            detail: [],
            status: 'UNKNOWN',
            language: 'cpp',
        },
        colorMap: submissionStatus,
        langMap: {
            cpp: 'cpp',
            cpp11: 'cpp',
            python3: 'python',
        },
        onError: false,
        error: null,
        user,
        highlightedCode: '(Empty)',
    }),
    computed: {
        shortenedId() {
            return this.info.id.slice(0, 5) + '...' + this.info.id.slice(-5)
        },
    },
    methods: {
        async init() {
            try {
                this.info = (await client.query({
                    query: gql`query fetchSub($idInput: ID!) {
                        submission(id: $idInput) {
                            id
                            problem {
                                id
                                title
                            }
                            user {
                                id
                                username
                            }
                            code
                            detail {
                                time
                                memory
                                point
                                status
                                order
                            }
                            language
                            status
                        }
                    }`,
                    variables: {
                        idInput: this.$route.params.id,
                    },
                    context: {
                        headers: {
                            Authorization: localStorage.getItem('userToken')
                        }
                    },
                    fetchPolicy: 'network-only'
                })).data.submission
            } catch (err) {
                this.onError = true
                this.error = err
            }
        },
        poll() {
            const thisRef = this
            setTimeout(async () => {
                await this.init()
                if (this.info.status === 'JUDGING')
                    this.poll()
            }, 2500)
        },
        highlightCode() {
            this.highlightedCode = Prism.highlight(
                this.info.code,
                Prism.languages[this.langMap[this.info.language]],
                this.langMap[this.info.language],
            )
        }
    },
    async mounted() {
        initTheme(this, 'indigo')
        await this.init()
        this.highlightCode()
        this.poll()
    }
}
</script>

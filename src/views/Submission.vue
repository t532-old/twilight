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
import initTheme from '@/theme'
import client from '@/client'
import render from '@/markdown'
import user from '@/shared/user'
import gql from 'graphql-tag'
import router from '@/router'
import Prism from 'prismjs'
import loadHighlights from '@/loadHighlights'
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
        colorMap: {
            JUDGING: 'blue',
            ACCEPTED: 'green',
            NOT_ACCEPTED: 'red',
            ERROR: 'orange',
            WRONG_ANSWER: 'red',
            PARTIALLY_CORRECT: 'orange',
            TIME_LIMIT_EXCEEDED: 'indigo',
            MEMORY_LIMIT_EXCEEDED: 'indigo',
            RUNTIME_ERROR: 'purple',
            SPECIAL_JUDGE_ERROR: 'gray',
            COMPILE_ERROR: 'gray',
            UNKNOWN_ERROR: 'gray',
        },
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
                    }
                })).data.submission
                this.highlightCode()
            } catch (err) {
                this.onError = true
                this.error = err
            }
        },
        highlightCode() {
            this.highlightedCode = Prism.highlight(
                this.info.code,
                Prism.languages[this.langMap[this.info.language]],
                this.langMap[this.info.language],
            )
        }
    },
    mounted() {
        initTheme(this, 'indigo')
        this.init()
    }
}
</script>

<template>
    <div>
        <v-card-text>
            <v-expansion-panels>
                <v-expansion-panel
                    class="elevation-2"
                    v-for="(part, idx) in participants"
                    :key="part.id"
                >
                    <v-expansion-panel-header>
                        <span>
                            <span class="text--secondary">Rank #{{ idx + 1 }}</span>
                            {{ part.user.username }}
                        </span>
                        {{ part.score.reduce((a, i) => a + i.score, 0) }} Points
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-list class="elevation-2">
                            <v-list-item
                                v-for="(score, idx) in part.score"
                                :key="idx"
                            >
                                <span class="text--secondary">Problem #{{ idx + 1 }}</span>
                                <v-spacer />
                                {{ typeof score.score === 'number' ? score.score : '' }} Points
                                <span class="text--secondary">({{ score.time }}ms)</span>
                            </v-list-item>
                        </v-list>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </v-card-text>
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
    </div>
</template>

<script>
import client from '@/client'
import gql from 'graphql-tag'

export default {
    name: 'ParticipantListing',
    props: ['scope'],
    data: () => ({
        participants: [],
        onError: false,
        error: null,
    }),
    watch: {
        scope() {
            this.init()
        }
    },
    methods: {
        async init() {
            try {
                this.participants = (await client.query({
                    query: gql`query participantsList(
                        $scopeInput: ID!
                    ) {
                        sortedParticipants(
                            id: $scopeInput
                        ) {
                            user {
                                username
                            }
                            score
                        }
                    }`,
                    variables: {
                        scopeInput: this.scope,
                    },
                    context: {
                        headers: {
                            Authorization: localStorage.getItem('userToken')
                        }
                    }
                })).data.sortedParticipants
            } catch (err) {
                this.onError = true
                this.error = err
            }
        }
    },
    beforeRouteEnter(_1, _2, next) {
        next(vm => vm.init())
    },
    beforeRouteUpdate(_1, _2, next) {
        this.init()
        next()
    },
    mounted() {
        this.init()
    },
}
</script>

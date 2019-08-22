<template>
    <v-container
        class="fill-height"
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
                        Scope ::
                    </span>
                    {{ info.title }}
                </v-toolbar-title>
            </v-toolbar>
            <v-tabs
                v-model="tab"
                background-color="primary"
                dark
                style="overflow: hidden"
            >
                <v-tabs-slider></v-tabs-slider>

                <v-tab :to="`/scope/${info.id}/info`">
                    <v-icon>mdi-information</v-icon>
                    Info
                </v-tab>
                <v-tab :to="`/scope/${info.id}/problems`" >
                    <v-icon>mdi-playlist-check</v-icon>
                    Problems
                </v-tab>
            </v-tabs>
            
            <template v-if="mode === 'info'">
                <v-card-text>
                    <p class="text--secondary">Scope#{{ info.id }}</p>
                    <div class="text-uppercase">Description</div>
                    <v-card>
                        <v-card-text class="text--primary markdown">
                            {{ info.description }}
                        </v-card-text>
                    </v-card>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-dialog
                        v-model="onEdit"
                        width="768"
                    >
                        <template v-slot:activator="{ on }">
                            <v-btn v-on="on" v-if="user.info.isAdmin" icon>
                                <v-icon>mdi-pencil</v-icon>
                            </v-btn>
                        </template>

                        <v-card>
                            <v-card-text>
                                <v-form @input="error = false">
                                    <v-card-title>Basic Info</v-card-title>
                                    <v-text-field
                                        label="Scope Title"
                                        name="title"
                                        prepend-icon="mdi-textbox"
                                        type="text"
                                        v-model="info.title"
                                    />
                                    <v-textarea
                                        label="Description"
                                        name="description"
                                        prepend-icon="mdi-pen"
                                        v-model="info.description"
                                    />
                                    <v-checkbox
                                        label="Visible to Normal Users"
                                        name="visible"
                                        prepend-icon="mdi-eye"
                                        v-model="info.visible"
                                    />
                                    <v-card-title>Extensions</v-card-title>
                                    Warning: This part should NOT be modified once any participants are created!
                                    <v-checkbox
                                        label="Linear (Storied) Scope"
                                        name="isLinear"
                                        prepend-icon="mdi-blur-linear"
                                        v-model="info.isLinear"
                                    />
                                    <v-text-field
                                        label="Skippable Steps"
                                        name="skippable"
                                        prepend-icon="mdi-skip-next"
                                        type="number"
                                        v-if="info.isLinear"
                                        v-model="info.skippable"
                                    />
                                    <v-checkbox
                                        label="Contest Scope"
                                        name="isContest"
                                        prepend-icon="mdi-account-group"
                                        v-model="info.isContest"
                                    />
                                    <v-select
                                        label="Contest Mode"
                                        name="contestMode"
                                        prepend-icon="mdi-clipboard-text"
                                        :items="modes"
                                        v-model="info.contestMode"
                                        v-if="info.isContest"
                                    />
                                    <v-card-title>Time</v-card-title>
                                    <v-checkbox
                                        label="Has Start Time (UTC)"
                                        name="from"
                                        prepend-icon="mdi-timer"
                                        v-model="hasFrom"
                                    />
                                    <v-date-picker
                                        name="fromDate"
                                        v-model="fromDate"
                                        v-if="hasFrom"
                                        height="500"
                                    />
                                    <v-time-picker
                                        name="fromTime"
                                        v-model="fromTime"
                                        v-if="hasFrom"
                                    />
                                    <v-checkbox
                                        label="Has End Time (UTC)"
                                        name="to"
                                        prepend-icon="mdi-timer-off"
                                        v-model="hasTo"
                                    />
                                    <v-date-picker
                                        name="toDate"
                                        v-model="toDate"
                                        v-if="hasTo"
                                    />
                                    <v-time-picker
                                        name="toTime"
                                        v-model="toTime"
                                        v-if="hasTo"
                                        
                                    />
                                </v-form>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer />
                                <v-btn @click="update(); onEdit = false" color="primary">Save</v-btn>
                                <v-btn @click="onEdit = false">Discard</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-card-actions>
            </template>

            <template v-if="mode === 'problem'">
                <v-card v-if="info.isLinear">
                    <v-card-title>
                        <span class="font-weight-light">Current Step:</span>
                        {{ participant.step }}
                    </v-card-title>
                    <v-card-text>
                        <v-card-actions>
                            {{ participant.skippedStep }}
                            of
                            {{ info.skippable }}
                            <span class="font-weight-light">Steps Skipped</span>
                            <v-spacer />
                            <v-btn
                                v-if="participant.skippedStep < info.skippable"
                                @click="skipOneStep()"
                            >
                                Skip
                                <v-icon>mdi-skip-next</v-icon>
                            </v-btn>
                        </v-card-actions>
                    </v-card-text>
                </v-card>
                <ProblemListing :scopeInfo="info" />
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
import user from '@/shared/user'
import client from '@/client'
import { validateID } from '@/util'
import gql from 'graphql-tag'
import ProblemListing from './sub/ProblemListing'

function toMomentCompatibleString(date, time) {
    return `${date}T${time}`
}

export default {
    name: 'Scope',
    props: ['mode'],
    data: () => ({
        modes: ['oi', 'ioi', 'acm'],
        tab: null,
        onError: false,
        error: null,
        info: {
            id: '...',
            title: '...',
            isLinear: false,
            skippable: 0,
            isContest: false,
            contestMode: null,
            description: '...',
            visible: true,
            from: null,
            to: null,
        },
        participant: {
            id: '...',
            step: null,
            skippedStep: null,
        },
        hasFrom: false,
        hasTo: false,
        fromDate: new Date().toISOString().slice(0, 10),
        fromTime: '00:00:00',
        toDate: new Date().toISOString().slice(0, 10),
        toTime: '00:00:00',
        onEdit: false,
        user,
    }),
    components: {
        ProblemListing,
    },
    methods: {
        async update() {
            const updateData = {
                title: this.info.title,
                isLinear: this.info.isLinear,
                skippable: this.info.isLinear ? Number(this.info.skippable) : null,
                isContest: this.info.isContest,
                contestMode: this.info.isContest ? this.info.contestMode : null,
                description: this.info.description,
                visible: this.info.visible,
                from: this.hasFrom ? toMomentCompatibleString(this.fromDate, this.fromTime) : null,
                to: this.hasTo ? toMomentCompatibleString(this.toDate, this.toTime) : null
            }
            try {
                await client.mutate({
                    mutation: gql`mutation editScope(
                        $idInput: ID!
                        $dataInput: ScopeUpdateInput!
                    ) {
                        updateScope(
                            id: $idInput
                            data: $dataInput
                        ) {
                            id
                        }
                    }`,
                    variables: {
                        idInput: this.info.id,
                        dataInput: updateData,
                    },
                    context: {
                        headers: {
                            Authorization: localStorage.getItem('userToken')
                        }
                    }
                })
            } catch (err) {
                this.onError = true
                this.error = err
            }
        },
        async skipOneStep() {
            try {
                await client.mutate({
                    mutation: gql`mutation skipOneStep($idInput: ID!) {
                        skipParticipantStep(id: $idInput) {
                            id
                        }
                    }`,
                    variables: {
                        idInput: this.participant.id,
                    },
                    context: {
                        headers: {
                            Authorization: localStorage.getItem('userToken')
                        }
                    }
                })
            } catch (err) {
                this.onError = true
                this.error = err
            }
        }
    },
    async mounted() {
        try {
            const id = validateID(this.$route.params.id)
            if (id) {
                this.info = (await client.query({
                    query: gql`query scope($idInput: ID!) {
                        scope(id: $idInput) {
                            id
                            title
                            isLinear
                            skippable
                            isContest
                            contestMode
                            description
                            visible
                            from
                            to
                        }
                    }`,
                    variables: {
                        idInput: id
                    },
                    context: {
                        headers: {
                            Authorization: localStorage.getItem('userToken')
                        }
                    }
                })).data.scope
                if (this.info.from) {
                    this.fromDate = this.info.from.slice(0, 10)
                    this.fromTime = this.info.from.slice(11, 19)
                    this.hasFrom = true
                }
                if (this.info.to) {
                    this.toDate = this.info.to.slice(0, 10)
                    this.toTime = this.info.to.slice(11, 19)
                    this.hasTo = true
                }
                this.participant = (await client.query({
                    query: gql`query selfParticipant($userInput: ID!, $scopeInput: ID!) {
                        participant(user: $userInput, scope: $scopeInput) {
                            id
                            step
                            skippedStep
                        }
                    }`,
                    variables: {
                        userInput: user.info.id,
                        scopeInput: this.info.id,
                    },
                    context: {
                        headers: {
                            Authorization: localStorage.getItem('userToken')
                        }
                    }
                })).data.participant
            }
        } catch (err) {
            this.onError = true
            this.error = err
        }
    }
}
</script>

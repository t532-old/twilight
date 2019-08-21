<template>
    <v-container
        class="fill-height"
        fluid
    >
        <v-row
          justify="center"
        >
            <v-col
                cols="12"
                sm="8"
                md="8"
            >
                <v-card class="elevation-12">
                    <v-toolbar
                        color="primary"
                        dark
                        flat
                    >
                        <v-toolbar-title>
                            <span class="text--secondary">
                                {{ info.isAdmin ? 'Admin' : '' }}
                                User ::
                            </span>
                            {{ info.username }}
                        </v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                        <p class="text--secondary">User#{{ info.id }}</p>
                        <div class="text-uppercase">Attended Scopes</div>
                        <v-chip-group style="margin-bottom: 1.5em;">
                            <v-chip
                                v-for="part in info.participants"
                                :key="part.id"
                                :href="`/scope/${part.scope.id}`"
                            >{{ part.scope.title }}</v-chip>
                        </v-chip-group>
                        <div class="text-uppercase">Introduction</div>
                        <v-card>
                            <v-card-text class="text--primary markdown">
                                {{ info.introduction }}
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
                                <v-btn v-on="on" v-if="isSelf" icon>
                                    <v-icon>mdi-account-edit</v-icon>
                                </v-btn>
                            </template>

                            <v-card>
                                <v-card-title>Edit your account info.</v-card-title>
                                <v-card-text>
                                    <v-form @input="error = false">
                                        <v-text-field
                                            label="Username"
                                            name="username"
                                            prepend-icon="mdi-account"
                                            type="text"
                                            v-model="info.username"
                                        ></v-text-field>
                                        <v-textarea
                                            id="introduction"
                                            label="Introduction"
                                            name="introduction"
                                            prepend-icon="mdi-pen"
                                            type="text"
                                            v-model="info.introduction"
                                        ></v-textarea>
                                    </v-form>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer />
                                    <v-btn @click="update(); onEdit = false" color="primary">Save</v-btn>
                                    <v-btn :href="`/user/${info.id}`">Discard</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                        <v-tooltip top>
                            <template v-slot:activator="{ on }">
                                <v-btn v-on="on" v-if="isSelf" icon @click="logout">
                                    <v-icon>mdi-account-key</v-icon>
                                </v-btn>
                            </template>
                            <span>Logout</span>
                        </v-tooltip>
                        <v-tooltip top>
                            <template v-slot:activator="{ on }">
                                <v-btn v-on="on" v-if="user.info.isAdmin" icon>
                                    <v-icon>mdi-account-off</v-icon>
                                </v-btn>
                            </template>
                            <span>Delete Account (!!)</span>
                        </v-tooltip>
                        <v-tooltip top>
                            <template v-slot:activator="{ on }">
                                <v-btn v-on="on" v-if="user.info.isAdmin" icon>
                                    <span v-if="info.isAdmin">
                                        <v-icon>mdi-account-alert-outline</v-icon>
                                    </span>
                                    <span v-else>
                                        <v-icon>mdi-account-check</v-icon>
                                    </span>
                                </v-btn>
                            </template>
                            <span>Toggle Admin (!!)</span>
                        </v-tooltip>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
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

export default {
    name: 'User',
    data: () => ({
        onError: false,
        error: null,
        info: {
            id: '...',
            username: '...',
            isAdmin: false,
            introduction: '...',
            participants: [],
        },
        user,
        onEdit: false,
    }),
    computed: {
        isSelf() {
            return this.info.id === user.info.id
        }
    },
    methods: {
        async update() {
            try {
                await client.mutate({
                    mutation: gql`mutation editUser($dataInput: UserUpdateInput!) {
                        updateUser(data: $dataInput) {
                            id
                        }
                    }`,
                    variables: {
                        dataInput: {
                            username: this.info.username,
                            introduction: this.info.introduction,
                        },
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
        async logout() {
            try {
                await client.mutate({
                    mutation: gql`mutation logout($tokenInput: ID!) {
                        deleteToken(id: $tokenInput) {
                            id
                        }
                    }`,
                    variables: {
                        tokenInput: localStorage.getItem('userToken')
                    },
                    context: {
                        headers: {
                            Authorization: localStorage.getItem('userToken')
                        }
                    }
                })
                localStorage.removeItem('userToken')
                location.href = '/'
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
                    query: gql`query user($idInput: ID!) {
                        user(id: $idInput) {
                            id
                            username
                            introduction
                            isAdmin
                            participants {
                                id
                                scope {
                                    id
                                    title
                                }
                            }
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
                })).data.user
            } 
        } catch (err) {
            this.onError = true
            this.error = err
        }
    }
}
</script>

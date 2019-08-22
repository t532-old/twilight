<template>
    <v-container
        class="fill-height"
        fluid
    >
        <v-card class="elevation-12 mx-auto" width="500" tile>
            <v-toolbar
                color="primary"
                dark
                flat
            >
                <v-toolbar-title>Login to WhoJudge</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
                <v-form @input="error = false">
                    <v-text-field
                        label="Login"
                        name="login"
                        prepend-icon="mdi-account"
                        type="text"
                        v-model="username"
                    ></v-text-field>
                    <v-text-field
                        id="password"
                        label="Password"
                        name="password"
                        prepend-icon="mdi-lock"
                        type="password"
                        v-model="pass"
                    ></v-text-field>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="login">Login</v-btn>
            </v-card-actions>
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
import gql from 'graphql-tag'
export default {
    name: 'Login',
    methods: {
        async login() {
            let id, user
            try {
                ({ data: { createToken: { id, user } } } = await client.mutate({
                    mutation: gql`mutation login($inputUsername: String!, $inputPass: String!) {
                        createToken(username: $inputUsername, pass: $inputPass) {
                            id
                            user {
                                id
                                username
                            }
                        }
                    }`,
                    variables: {
                        inputUsername: this.username,
                        inputPass: this.pass,
                    }
                }))
            } catch (err) {
                this.onError = true
                this.error = err
                return
            }
            this.user.info = user
            localStorage.setItem('userToken', id)
            location.pathname = '/'
        }
    },
    data: () => ({
        user,
        onError: false,
        error: null,
        username: '',
        pass: '',
    })
}
</script>

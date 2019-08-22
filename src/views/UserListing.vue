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
                <v-toolbar-title class="text--secondary">Users Listing</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
                <v-list-item
                    class="elevation-2"
                    v-for="user in users"
                    :key="user.id"
                    :to="`/user/${user.id}`"
                >
                    <v-list-item-content>
                        <v-list-item-title>{{ user.username }}</v-list-item-title>
                        <v-list-item-subtitle>
                            consectetur adipiscing elit.
                        </v-list-item-subtitle>
                    </v-list-item-content>
                    <v-spacer />
                    <v-icon>mdi-chevron-right</v-icon>
                </v-list-item>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" :to="String(Number($route.params.page) - 1)" v-if="Number($route.params.page)" icon>
                    <v-icon>mdi-arrow-left</v-icon>
                </v-btn>
                <v-btn color="primary" :to="String(Number($route.params.page) + 1)" v-if="this.users.length === this.pagination.itemsPerPage" icon>
                    <v-icon>mdi-arrow-right</v-icon>
                </v-btn>
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
import client from '@/client'
import pagination from '@/shared/pagination'
import gql from 'graphql-tag'
import initTheme from '@/theme'

export default {
    name: 'UserListing',
    data: () => ({
        users: [],
        filter: {},
        onError: false,
        error: null,
        pagination,
    }),
    methods: {
        async init(page = this.$route.params.page) {
            try {
                this.users = (await client.query({
                    query: gql`query userListing(
                        $whereInput: UserWhereInput!
                        $firstInput: Int!
                        $skipInput: Int!
                    ) {
                        users(
                            where: $whereInput
                            first: $firstInput
                            skip: $skipInput
                        ) {
                            id
                            username
                        }
                    }`,
                    variables: {
                        whereInput: this.filter,
                        firstInput: pagination.itemsPerPage,
                        skipInput: Number(page) * pagination.itemsPerPage,
                    },
                    context: {
                        headers: {
                            Authorization: localStorage.getItem('userToken')
                        }
                    }
                })).data.users
            } catch (err) {
                this.onError = true
                this.error = err
            }
        }
    },
    beforeRouteEnter(_1, _2, next) {
        next(vm => vm.init())
    },
    beforeRouteUpdate(to, _, next) {
        this.init(to.params.page)
        next()
    },
    mounted() {
        initTheme(this, 'indigo')
    }
}
</script>

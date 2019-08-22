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
                <v-toolbar-title class="text--secondary">Scopes Listing</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
                
                <v-list-item
                    class="elevation-2"
                    v-for="scope in scopes"
                    :key="scope.id"
                    :to="`/scope/${scope.id}`"
                >
                    <v-list-item-content>
                        <v-list-item-title>
                            <span class="text--secondary">{{ typeOf(scope) }}::</span>
                            {{ scope.title }}
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            {{ metadataOf(scope) }}
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
                <v-btn color="primary" :to="String(Number($route.params.page) + 1)" v-if="this.scopes.length === this.pagination.itemsPerPage" icon>
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
    name: 'ScopeListing',
    data: () => ({
        scopes: [],
        filter: {},
        onError: false,
        error: null,
        pagination,
    }),
    methods: {
        async init(page = this.$route.params.page) {
            try {
                this.scopes = (await client.query({
                    query: gql`query scopeListing(
                        $whereInput: ScopeWhereInput!
                        $firstInput: Int!
                        $skipInput: Int!
                    ) {
                        scopes(
                            where: $whereInput
                            first: $firstInput
                            skip: $skipInput
                        ) {
                            id
                            creator {
                                username
                            }
                            title
                            isLinear
                            isContest
                            contestMode
                        }
                    }`,
                    variables: {
                        whereInput: this.filter,
                        firstInput: pagination.itemsPerPage,
                        skipInput: page * pagination.itemsPerPage,
                    },
                    context: {
                        headers: {
                            Authorization: localStorage.getItem('userToken')
                        }
                    }
                })).data.scopes
            } catch (err) {
                this.onError = true
                this.error = err
            }
        },
        metadataOf(scope) {
            const md = [`Created by ${scope.creator.username}`]
            if (scope.isContest)
                md.push(scope.contestMode)
            if (scope.isLinear)
                md.push(`${scope.skippable} steps skippable`)
            return md.join(' · ')
        },
        typeOf(scope) {
            let result = ''
            if (scope.isLinear)
                result += 'Storied '
            if (scope.isContest)
                result += 'Contest '
            else result += 'Scope '
            return result
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
        initTheme(this, 'orange')
    }
}
</script>

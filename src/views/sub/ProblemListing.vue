<template>
    <div>
        <v-card-text>
            <v-list-item
                class="elevation-2"
                v-for="problem in problems"
                :key="problem.id"
                :to="`/problem/${problem.id}`"
            >
                <v-list-item-content>
                    <v-list-item-title>
                        <span class="text--secondary">Problem #{{ problem.order + 1 }} ::</span>
                        {{ problem.title }}
                        
                    </v-list-item-title>
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
            <v-btn color="primary" :click="init()" :to="String(Number($route.params.page) + 1)" v-if="problems.length === pagination.itemsPerPage" icon>
                <v-icon>mdi-arrow-right</v-icon>
            </v-btn>
    </v-card-actions>
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
import pagination from '@/shared/pagination'
import gql from 'graphql-tag'

export default {
    name: 'ProblemListing',
    props: ['scopeInfo', 'page'],
    data: () => ({
        problems: [],
        filter: {},
        onError: false,
        error: null,
        orderBy: 'order_ASC',
        pagination,
    }),
    watch: {
        scopeInfo() {
            this.init()
        }
    },
    methods: {
        async init(page = this.$route.params.page) {
            try {
                this.problems = (await client.query({
                    query: gql`query problemListing(
                        $scopeInput: ID!
                        $whereInput: ProblemWhereInput!
                        $firstInput: Int!
                        $skipInput: Int!
                        $orderByInput: ProblemOrderByInput!
                    ) {
                        problems(
                            scope: $scopeInput
                            where: $whereInput
                            first: $firstInput
                            skip: $skipInput
                            orderBy: $orderByInput
                        ) {
                            order
                            id
                            title
                        }
                    }`,
                    variables: {
                        scopeInput: this.scopeInfo.id,
                        whereInput: this.filter,
                        firstInput: pagination.itemsPerPage,
                        skipInput: page * pagination.itemsPerPage,
                        orderByInput: this.orderBy,
                    },
                    context: {
                        headers: {
                            Authorization: localStorage.getItem('userToken')
                        }
                    }
                })).data.problems
            } catch (err) {
                this.onError = true
                this.error = err
            }
        }
    },
    beforeRouteEnter(_1, _2, next) {
        next(vm => vm.init())
    },
    beforeRouteUpdate(to, _2, next) {
        this.init(to.params.page)
        next()
    },
    mounted() {
        this.init()
    },
}
</script>

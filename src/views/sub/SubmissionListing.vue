<template>
    <div>
        <v-card-text>
            <v-list-item
                class="elevation-2"
                v-for="submission in submissions"
                :key="submission.id"
                :to="`/submission/${submission.id}`"
            >
                <v-list-item-content>
                    <v-list-item-title>
                        <span class="text--secondary">
                            Submission by
                            <router-link
                                :to="`/user/${submission.user.id}`"
                                class="text--secondary"
                            >{{ submission.user.username }}</router-link>
                            ::
                        </span>
                        <span :class="`${colorMap[submission.status]}--text`">
                            {{ submission.status }}
                        </span>
                    </v-list-item-title>
                    <v-list-item-subtitle>{{ submission.detail.reduce((a, i) => a + i.point, 0) }} Points · Created At {{ submission.createdAt }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-spacer />
                <v-icon>mdi-chevron-right</v-icon>
            </v-list-item>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" :href="String(Number($route.params.page) - 1)" v-if="Number($route.params.page)" icon>
                <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <v-btn color="primary" :click="init()" :href="String(Number($route.params.page) + 1)" v-if="submissions.length === pagination.itemsPerPage" icon>
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
import client from '@/util/client'
import user from '@/shared/user'
import pagination from '@/shared/pagination'
import router from '@/router'
import { submissionStatus } from '@/util/palette'
import gql from 'graphql-tag'

export default {
    name: 'SubmissionListing',
    props: ['problemInfo', 'page'],
    data: () => ({
        submissions: [],
        tags: [],
        filter: {},
        onError: false,
        error: null,
        orderBy: 'createdAt_DESC',
        pagination,
        user,
        colorMap: submissionStatus,
    }),
    watch: {
        problemInfo() {
            this.init()
        }
    },
    methods: {
        async init(page = this.$route.params.page) {
            try {
                this.submissions = (await client.query({
                    query: gql`query submissionListing(
                        $problemInput: ID!
                        $whereInput: SubmissionWhereInput!
                        $firstInput: Int!
                        $skipInput: Int!
                        $orderByInput: SubmissionOrderByInput!
                    ) {
                        submissions(
                            problem: $problemInput
                            where: $whereInput
                            first: $firstInput
                            skip: $skipInput
                            orderBy: $orderByInput
                        ) {
                            id
                            user {
                                id
                                username
                            }
                            status
                            createdAt
                            detail {
                                point
                            }
                        }
                    }`,
                    variables: {
                        problemInput: this.problemInfo.id,
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
                })).data.submissions
            } catch (err) {
                this.onError = true
                this.error = err
            }
        },
    },
    mounted() {
        this.init()
    },
}
</script>

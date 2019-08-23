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
                        Problem ::
                    </span>
                    {{ info.title }}
                </v-toolbar-title>
                <template v-slot:extension>
                    <v-tabs
                        v-model="tab"
                        background-color="primary"
                        dark
                        style="overflow: hidden"
                    >
                        <v-tabs-slider></v-tabs-slider>

                        <v-tab :to="`/problem/${info.id}/info`" style="margin-left: 0;">
                            <v-icon>mdi-information</v-icon>
                            Info
                        </v-tab>
                        <v-tab :to="`/problem/${info.id}/submit`">
                            <v-icon>mdi-arrow-up-bold</v-icon>
                            Submit
                        </v-tab>
                        <v-tab :to="`/problem/${info.id}/submissions`">
                            <v-icon>mdi-playlist-check</v-icon>
                            Submissions
                        </v-tab>
                    </v-tabs>
                </template>
            </v-toolbar>
            <template v-if="mode === 'info'">

                <v-overlay
                    :value="showStoryOverlay"
                    opacity="0.9"
                >
                    <div style="height: 100vh; width: 100vw; overflow: auto">
                        <v-card-title>Story</v-card-title>
                        <v-divider />
                        <v-card-text v-html="render(info.story)"></v-card-text>
                        <v-card-actions>
                        <v-btn text @click="showStoryOverlay = false">
                            <v-icon>mdi-arrow-right</v-icon>
                            Enter
                        </v-btn>
                        </v-card-actions>
                    </div>
                </v-overlay>

                <v-card-title>Background</v-card-title>
                <v-card-text v-if="info.background" class="text--primary" v-html="render(info.background)"></v-card-text>
                <v-card-text v-else>(Empty)</v-card-text>
                <v-divider />

                <v-card-title>Description</v-card-title>
                <v-card-text v-if="info.description" class="text--primary" v-html="render(info.description)"></v-card-text>
                <v-card-text v-else>(Empty)</v-card-text>
                <v-divider />

                <v-card-title>Input Format</v-card-title>
                <v-card-text v-if="info.inputFormat" class="text--primary" v-html="render(info.inputFormat)"></v-card-text>
                <v-card-text v-else>(Empty)</v-card-text>
                <v-divider />

                <v-card-title>Output Format</v-card-title>
                <v-card-text v-if="info.outputFormat" class="text--primary" v-html="render(info.outputFormat)"></v-card-text>
                <v-card-text v-else>(Empty)</v-card-text>
                <v-divider />

                <v-card-title>Examples</v-card-title>
                <v-expansion-panels v-if="info.examples.length">
                    <v-expansion-panel
                        v-for="(ex, idx) in info.examples"
                        :key="idx"
                    >
                        <v-expansion-panel-header>Example #{{ idx }}</v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-card-text>
                                Input
                                <v-card class="elevation-2">
                                    <v-card-text>
                                        <pre>{{ ex.input }}</pre>
                                    </v-card-text>
                                </v-card>
                                Output
                                <v-card class="elevation-2">
                                    <v-card-text>
                                        <pre>{{ ex.output }}</pre>
                                    </v-card-text>
                                </v-card>
                            </v-card-text>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
                <v-card-text v-else>(Empty)</v-card-text>
                <v-divider />

                <v-card-title>Tips</v-card-title>
                <v-card-text v-if="info.tips" class="text--primary" v-html="render(info.tips)"></v-card-text>
                <v-card-text v-else>(Empty)</v-card-text>

                <v-card-actions>
                    <v-spacer />
                    <span style="font-size: smaller" class="text--secondary">Problem#{{ info.id }}</span>
                </v-card-actions>

                <v-card-actions>
                    <v-spacer />
                    <v-tooltip top>
                        <template v-slot:activator="{ on }">
                            <v-btn v-on="on" @click="deleteProblem" v-if="user.info.isAdmin" icon>
                                <v-icon>mdi-pencil-off</v-icon>
                            </v-btn>
                        </template>
                        <span>Delete Problem</span>
                    </v-tooltip>
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
                                        label="Problem Title"
                                        prepend-icon="mdi-text"
                                        type="text"
                                        v-model="info.title"
                                    />
                                    <v-checkbox
                                        label="Visible to Normal Users"
                                        prepend-icon="mdi-eye"
                                        v-model="info.visible"
                                    />
                                    <v-text-field
                                        label="Order"
                                        prepend-icon="mdi-reorder-horizontal"
                                        type="number"
                                        v-model="info.order"
                                        @input="info.order = Number(info.order)"
                                    />
                                    <v-card-title>Content</v-card-title>
                                    <v-textarea
                                        label="Story"
                                        prepend-icon="mdi-script-text"
                                        v-model="info.story"
                                    />
                                    <v-textarea
                                        label="Background"
                                        prepend-icon="mdi-sign-text"
                                        v-model="info.background"
                                    />
                                    <v-textarea
                                        label="Description"
                                        prepend-icon="mdi-clipboard-text"
                                        v-model="info.description"
                                    />
                                    <v-textarea
                                        label="Input Format"
                                        prepend-icon="mdi-textbox"
                                        v-model="info.inputFormat"
                                    />
                                    <v-textarea
                                        label="Output Format"
                                        prepend-icon="mdi-textbox-password"
                                        v-model="info.outputFormat"
                                    />
                                    <v-textarea
                                        label="Tips"
                                        prepend-icon="mdi-tooltip-text"
                                        v-model="info.tips"
                                    />
                                    <v-card-title>
                                        Examples
                                        <v-spacer />
                                        <v-btn
                                            class="text--primary"
                                            icon
                                            @click="info.examples.push({ input: '', output: '' })"
                                        >
                                            <v-icon>mdi-playlist-plus</v-icon>
                                        </v-btn>
                                    </v-card-title>
                                    <v-expansion-panels v-if="info.examples.length">
                                        <v-expansion-panel
                                            v-for="(ex, idx) in info.examples"
                                            :key="idx"
                                        >
                                            <v-expansion-panel-header>Example #{{ idx }}</v-expansion-panel-header>
                                            <v-expansion-panel-content>
                                                <v-card-text>
                                                    <v-textarea
                                                        label="Input"
                                                        prepend-icon="mdi-textbox"
                                                        v-model="ex.input"
                                                    />
                                                    <v-textarea
                                                        label="Output"
                                                        prepend-icon="mdi-textbox-password"
                                                        v-model="ex.output"
                                                    />
                                                </v-card-text>
                                                <v-card-actions>
                                                    <v-spacer />
                                                    <v-btn
                                                        class="text--primary"
                                                        icon
                                                        @click="info.examples.splice(idx, 1)"
                                                    >
                                                        <v-icon>mdi-playlist-remove</v-icon>
                                                    </v-btn>
                                                </v-card-actions>
                                            </v-expansion-panel-content>
                                        </v-expansion-panel>
                                    </v-expansion-panels>
                                    <v-card-text v-else>(Empty)</v-card-text>
                                    <v-card-title>
                                        Testcases
                                        <v-spacer />
                                        <v-btn
                                            class="text--primary"
                                            icon
                                            @click="info.testcases.push({ time: 1000, memory: 128 * 1024 * 1024, point: 10 })"
                                        >
                                            <v-icon>mdi-playlist-plus</v-icon>
                                        </v-btn>
                                    </v-card-title>
                                    <v-expansion-panels v-if="info.testcases.length">
                                        <v-expansion-panel
                                            v-for="(ex, idx) in info.testcases"
                                            :key="idx"
                                        >
                                            <v-expansion-panel-header>Testcase #{{ idx }}</v-expansion-panel-header>
                                            <v-expansion-panel-content>
                                                <v-card-text>
                                                    <v-text-field
                                                        label="Time Limit"
                                                        prepend-icon="mdi-timer"
                                                        type="number"
                                                        v-model="ex.time"
                                                        suffix="ms"
                                                        @input="normalizeTestcase(ex)"
                                                    />
                                                    <v-text-field
                                                        label="Memory Limit"
                                                        prepend-icon="mdi-memory"
                                                        type="number"
                                                        v-model="ex.memory"
                                                        suffix="Bytes"
                                                        @input="normalizeTestcase(ex)"
                                                    />
                                                    <v-text-field
                                                        label="Points"
                                                        prepend-icon="mdi-star-four-points"
                                                        type="number"
                                                        v-model="ex.point"
                                                        @input="normalizeTestcase(ex)"
                                                    />
                                                    <v-file-input
                                                        v-model="IN"
                                                        label="Upload Infile..."
                                                        append-icon="mdi-upload"
                                                        :success="uploadSuccess.IN"
                                                        @click:append="upload(idx, 'IN')"
                                                    />
                                                    <v-file-input
                                                        v-model="OUT"
                                                        label="Upload Outfile..."
                                                        append-icon="mdi-upload"
                                                        :success="uploadSuccess.OUT"
                                                        @click:append="upload(idx, 'OUT')"
                                                    />
                                                </v-card-text>
                                                <v-card-actions>
                                                    <v-spacer />
                                                    <v-btn
                                                        class="text--primary"
                                                        icon
                                                        @click="info.testcase.splice(idx, 1)"
                                                    >
                                                        <v-icon>mdi-playlist-remove</v-icon>
                                                    </v-btn>
                                                </v-card-actions>
                                            </v-expansion-panel-content>
                                        </v-expansion-panel>
                                    </v-expansion-panels>
                                    <v-card-text v-else>(Empty)</v-card-text>
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
export default {
    name: 'Problem',
    props: ['mode'],
    data: () => ({
        tab: null,
        info: {
            id: '...',
            title: '...',
            story: '',
            scope: {
                id: '...'
            },
            background: '',
            description: '',
            inputFormat: '',
            outputFormat: '',
            tips: '',
            examples: [],
            testcases: [],
            visible: false,
            order: -1,
        },
        showStoryOverlay: false,
        onError: false,
        error: null,
        onEdit: false,
        user,
        IN: null,
        OUT: null,
        uploadSuccess: {
            IN: false,
            OUT: false,
        },
    }),
    methods: {
        async init() {
            try {
                this.info = (await client.query({
                    query: gql`query fetchProblem($idInput: ID!) {
                        problem(id: $idInput) {
                            scope {
                                id
                            }
                            id
                            title
                            story
                            background
                            description
                            inputFormat
                            outputFormat
                            tips
                            visible
                            order
                            examples {
                                input
                                output
                            }
                            testcases {
                                point
                                time
                                memory
                            }
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
                })).data.problem
                if (this.info.story)
                    this.showStoryOverlay = true
            } catch (err) {
                this.onError = true
                this.error = err
            }
        },
        render,
        normalizeTestcase(tc) {
            tc.time = Number(tc.time)
            tc.memory = Number(tc.memory)
            tc.point = Number(tc.point)
        },
        async upload(idx, mode) {
            try {
                await client.mutate({
                    mutation: gql`mutation uploadCaseFile(
                        $idInput: ID!
                        $idxInput: Int!
                        $typeInput: TestcaseFileType!
                        $fileInput: Upload!
                    ) {
                        uploadTestcaseFile(
                            id: $idInput
                            idx: $idxInput
                            type: $typeInput
                            file: $fileInput
                        )
                    }`,
                    variables: {
                        idInput: this.info.id,
                        idxInput: idx,
                        typeInput: mode,
                        fileInput: this[mode],
                    },
                    context: {
                        headers: {
                            Authorization: localStorage.getItem('userToken')
                        }
                    }
                })
                this.uploadSuccess[mode] = true
            } catch (err) {
                this.onError = true
                this.error = err
            }
        },
        async update() {
            try {
                const data = {
                    background: this.info.background,
                    description: this.info.description,
                    examples: this.info.examples
                        .map(i => ({
                            input: i.input,
                            output: i.output,
                        })),
                    inputFormat: this.info.inputFormat,
                    outputFormat: this.info.outputFormat,
                    story: this.info.story,
                    testcases: this.info.testcases
                        .map(i => ({
                            time: i.time,
                            memory: i.memory,
                            point: i.point
                        })),
                    tips: this.info.tips,
                    title: this.info.title,
                    visible: this.info.visible,
                    order: this.info.order,
                }
                await client.mutate({
                    mutation: gql`mutation updateProb(
                        $idInput: ID!
                        $dataInput: ProblemUpdateInput!
                    ) {
                        updateProblem(
                            id: $idInput
                            data: $dataInput
                        ) {
                            id
                        }
                    }`,
                    variables: {
                        idInput: this.info.id,
                        dataInput: data,
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
        async deleteProblem() {
            try {
                await client.mutate({
                    mutation: gql`mutation delProb(
                        $idInput: ID!
                    ) {
                        deleteProblem(id: $idInput) {
                            id
                        }
                    }`,
                    variables: {
                        idInput: this.info.id,
                    },
                    context: {
                        headers: {
                            Authorization: localStorage.getItem('userToken')
                        }
                    }
                })
                if (this.info.scope)
                    router.push({ path: `/scope/${this.info.scope.id}/problems` })
                else router.push({ path: '/scopes' })
            } catch (err) {
                this.onError = true
                this.error = err
            }
        },
    },
    mounted() {
        initTheme(this, 'blue')
        this.init()
    }
}
</script>

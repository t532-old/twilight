import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [{
        path: '/',
        name: 'home',
        component: Home
    }, {
        path: '/about',
        name: 'about',
        component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }, {
        path: '/scopes',
        name: 'scopelisting',
        component: () => import(/* webpackChunkName: "scopelisting" */ './views/ScopeListing.vue')
    }, {
        path: '/scope/:id',
        name: 'scope',
        component: () => import(/* webpackChunkName: "scope" */ './views/Scope.vue')
    }, {
        path: '/problems/:scope',
        name: 'problisting',
        component: () => import(/* webpackChunkName: "problisting" */ './views/ProblemListing.vue')
    }, {
        path: '/problem/:id',
        name: 'prob',
        component: () => import(/* webpackChunkName: "prob" */ './views/Problem.vue')
    }, {
        path: '/users',
        name: 'userlisting',
        component: () => import(/* webpackChunkName: "userlisting" */ './views/UserListing.vue')
    }, {
        path: '/user/:id',
        name: 'user',
        component: () => import(/* webpackChunkName: "user" */ './views/User.vue')
    }, {
        path: '/submissions/:problem',
        name: 'sublisting',
        component: () => import(/* webpackChunkName: "sublisting" */ './views/SubmissionListing.vue')
    }, {
        path: '/submission/:id',
        name: 'sub',
        component: () => import(/* webpackChunkName: "sub" */ './views/Submission.vue')
    }, {
        path: '/login',
        name: 'login',
        component: () => import(/* webpackChunkName: "login" */ './views/Login.vue')
    }]
})

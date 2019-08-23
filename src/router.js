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
        redirect: '/scopes/0',
    }, {
        path: '/scopes/:page',
        name: 'scopelisting',
        component: () => import(/* webpackChunkName: "scopelisting" */ './views/ScopeListing.vue')
    }, {
        path: '/scope/:id',
        redirect: to => `/scope/${to.params.id}/info`,
    }, {
        path: '/scope/:id/info',
        name: 'scopeinfo',
        component: () => import(/* webpackChunkName: "scope" */ './views/Scope.vue'),
        props: { mode: 'info' }
    }, {
        path: '/scope/:id/problems',
        redirect: to => `/scope/${to.params.id}/problems/0`
    }, {
        path: '/scope/:id/problems/:page',
        name: 'scopeprob',
        component: () => import(/* webpackChunkName: "scope" */ './views/Scope.vue'),
        props: { mode: 'problem' }
    }, {
        path: '/scope/:id/participants',
        name: 'scopepart',
        component: () => import(/* webpackChunkName: "scope" */ './views/Scope.vue'),
        props: { mode: 'participant' }
    }, {
        path: '/problem/:id',
        redirect: to => `/problem/${to.params.id}/info`,
    }, {
        path: '/problem/:id/info',
        name: 'probinfo',
        component: () => import(/* webpackChunkName: "prob" */ './views/Problem.vue'),
        props: { mode: 'info' }
    }, {
        path: '/problem/:id/submit',
        name: 'probcrsub',
        component: () => import(/* webpackChunkName: "prob" */ './views/Problem.vue'),
        props: { mode: 'submit' }
    }, {
        path: '/problem/:id/submissions',
        redirect: to => `/problem/${to.params.id}/submissions/0`
    }, {
        path: '/problem/:id/submissions/:page',
        name: 'probsub',
        component: () => import(/* webpackChunkName: "prob" */ './views/Problem.vue'),
        props: { mode: 'submissions' },
    }, {
        path: '/users/:page',
        name: 'userlisting',
        component: () => import(/* webpackChunkName: "userlisting" */ './views/UserListing.vue')
    }, {
        path: '/users',
        redirect: '/users/0',
    }, {
        path: '/user/:id',
        name: 'user',
        component: () => import(/* webpackChunkName: "user" */ './views/User.vue')
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

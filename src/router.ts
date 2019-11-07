import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '*',
            name: 'notFound',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import(/* webpackChunkName: "about" */ './views/NotFound.vue')
        },
        {
            path: '/',
            name: 'loginDefault',
            component: () => import(/* webpackChunkName: "about" */ './views/Login.vue')
        },
        {
            path: '/login',
            name: 'login',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import(/* webpackChunkName: "about" */ './views/Login.vue')
        },
        {
            path: '/forbidden',
            name: 'forbidden',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import(/* webpackChunkName: "about" */ './views/Forbidden.vue')
        },
        {
            path: '/home',
            /* name: 'home', */
            component: () => import(/* webpackChunkName: "about" */ './views/Home.vue'),

            children: [
                {
                    path: '',
                    name: 'home',
                    component: () => import(/* webpackChunkName: "about" */ './components/HelloWorld.vue')
                },
                {
                    path: '/about',
                    name: 'about',
                    // route level code-splitting
                    // this generates a separate chunk (about.[hash].js) for this route
                    // which is lazy-loaded when the route is visited.
                    component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
                },
                {
                    path: '/profile',
                    name: 'profile',
                    // route level code-splitting
                    // this generates a separate chunk (about.[hash].js) for this route
                    // which is lazy-loaded when the route is visited.
                    component: () => import(/* webpackChunkName: "about" */ './views/Profile.vue')
                },
                {
                    path: '/management/users',
                    name: 'userManagement',
                    // route level code-splitting
                    // this generates a separate chunk (about.[hash].js) for this route
                    // which is lazy-loaded when the route is visited.
                    component: () => import(/* webpackChunkName: "about" */ './views/UserManagement.vue')
                },
                {
                    path: '/management/users/edit/:user',
                    name: 'editUser',
                    // route level code-splitting
                    // this generates a separate chunk (about.[hash].js) for this route
                    // which is lazy-loaded when the route is visited.
                    component: () => import(/* webpackChunkName: "about" */ './views/AddUser.vue')
                },
                {
                    path: '/management/users/add',
                    name: 'addUser',
                    // route level code-splitting
                    // this generates a separate chunk (about.[hash].js) for this route
                    // which is lazy-loaded when the route is visited.
                    component: () => import(/* webpackChunkName: "about" */ './views/AddUser.vue')
                },
/////////////////////////////////////////////////////////////////////////////////////////

                {
                    path: '/search/documents',
                    name: 'searchDocuments',
                    // route level code-splitting
                    // this generates a separate chunk (about.[hash].js) for this route
                    // which is lazy-loaded when the route is visited.
                    component: () => import(/* webpackChunkName: "about" */ './views/document/DocumentSearch.vue')
                },
                {
                    path: '/document/:documentId',
                    name: 'viewDocument',
                    // route level code-splitting
                    // this generates a separate chunk (about.[hash].js) for this route
                    // which is lazy-loaded when the route is visited.
                    component: () => import(/* webpackChunkName: "about" */ './views/document/DocumentView.vue')
                },



/////////////////////////////////////////////////////////////////////////////////////////





                {
                    path: '/showcase/buttons',
                    name: 'shc-buttons',
                    // route level code-splitting
                    // this generates a separate chunk (about.[hash].js) for this route
                    // which is lazy-loaded when the route is visited.
                    component: () => import(/* webpackChunkName: "about" */ './views/showcase/ShcButtons.vue')
                },
                {
                    path: '/showcase/toolbars',
                    name: 'shc-toolbars',
                    // route level code-splitting
                    // this generates a separate chunk (about.[hash].js) for this route
                    // which is lazy-loaded when the route is visited.
                    component: () => import(/* webpackChunkName: "about" */ './views/showcase/ShcToolbars.vue')
                },
                {
                    path: '/showcase/forms',
                    name: 'shc-forms',
                    // route level code-splitting
                    // this generates a separate chunk (about.[hash].js) for this route
                    // which is lazy-loaded when the route is visited.
                    component: () => import(/* webpackChunkName: "about" */ './views/showcase/ShcForms.vue')
                },
                {
                    path: '/showcase/agGrid',
                    name: 'shc-agGrid',
                    // route level code-splitting
                    // this generates a separate chunk (about.[hash].js) for this route
                    // which is lazy-loaded when the route is visited.
                    component: () => import(/* webpackChunkName: "about" */ './views/showcase/GridContainer.vue')
                },
                {
                    path: '/vuejs/decorated',
                    name: 'vuejs-decorated',
                    // route level code-splitting
                    // this generates a separate chunk (about.[hash].js) for this route
                    // which is lazy-loaded when the route is visited.
                    component: () => import(/* webpackChunkName: "about" */ './components/showcase/DecoratedComponent.vue')
                },
                {
                    path: '/vuejs/traditional',
                    name: 'vuejs-traditional',
                    // route level code-splitting
                    // this generates a separate chunk (about.[hash].js) for this route
                    // which is lazy-loaded when the route is visited.
                    component: () => import(/* webpackChunkName: "about" */ './components/showcase/TraditionalComponent.vue')
                }
            ]
        }
    ]
});

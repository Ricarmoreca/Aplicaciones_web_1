const { createApp } = Vue;
const { createRouter, createWebHashHistory } = VueRouter;

const routes = [
    { path: '/', component: Home },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { path: '/forgot-password', component: ForgotPassword },
    { path: '/dashboard', component: Dashboard },
    { path: '/publications', component: Publications },
    { path: '/query', component: Query },
    { path: '/review', component: ReviewPublications },
    { path: '/register-publication', component: RegisterPublication },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

const app = createApp({
    template: '<router-view></router-view>'
});

app.use(router);
app.mount('#app');

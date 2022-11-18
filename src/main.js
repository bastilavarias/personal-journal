import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import('@/app.scss');
import { VueMasonryPlugin } from 'vue-masonry';
import apiService from '@/services/api';

apiService.init();

Vue.config.productionTip = false;
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(VueMasonryPlugin);

new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount('#app');

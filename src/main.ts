import '@babel/polyfill';
import 'mutationobserver-shim';
import Vue from 'vue';
import './plugins/fontawesome-vue';
import './plugins/bootstrap-vue';
import './plugins/modules-js-to-ts';
import './plugins/v-calendar';
import './plugins/ag-grid-vue';
import './plugins/axios-vue';
import './plugins/session-vue';
import './plugins/el-elements-vue';

import router from './router';
import i18n from './plugins/i18n'

import App from './App.vue';

//using custom directives
import './directives/ClickOutsideDirective';

Vue.config.productionTip = false;

new Vue({
  router,
  i18n,
  render: (h) => h(App)
}).$mount('#app');

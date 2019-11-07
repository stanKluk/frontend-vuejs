import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import i18n from '../plugins/i18n';

//see https://element.eleme.io/#/fr-FR/component/datetime-picker
Vue.use(ElementUI, {i18n: (key, value) => i18n.t(key, value)})

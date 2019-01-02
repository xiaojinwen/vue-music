import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import FastClick from 'fastclick'
import 'common/stylus/index.styl'
import VueLazyLoad from 'vue-lazyload'

/* eslint-disable no-unused-vars */
// import VConsole from 'vconsole'

if (process.env.NODE_ENV !== 'production') {
    // let vConsole = new VConsole()
}
// 手机调试vConsole

Vue.config.productionTip = false
FastClick.attach(document.body)
Vue.use(VueLazyLoad)
// Vue.use(VueLazyLoad, {
//     loading: require('common/image/default.png')
// })
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
/* eslint-disable */
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import Mint from 'mint-ui'
import store from '@/store/index'
import 'mint-ui/lib/style.css'
import filter from './filter/index'
import directive from './directive/index'
import {Page, PageRouter} from '@/components/page'
import Scroll from '@/components/scroll'
// import FastClick from 'fastclick'
import native from '@/service/common/native/native.service'
/* import mtCellSwipe from '@/lib/.2.2.7@mint-ui/packages/cell-swipe'
 import mtSwipe from '@/lib/.2.2.7@mint-ui/packages/swipe' */
// 过滤器
Vue.use(directive)
Vue.use(filter)
Vue.use(Mint)
// 必须要在vue初始化之前加载
PageRouter.router(router, store)

/*  获取APP城市选择，初始化默认城市 */
if(native.isApp()){
  native.todoNative('common_native', 'switchCity', {showSwitchCity: '0'}).then(data => {
    let selectCity = {}
    selectCity.province = data.province
    selectCity.city = data.city
    selectCity.country = data.country === '' ? null : data.country
    store.commit('SelectCityMutation', selectCity)
  })
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App},
  data: {
    eventHub: new Vue()
  }
})
Vue.component('zyt-page', Page)
Vue.component('zyt-scroll', Scroll)
/* Vue.component('mt-cell-swipe', mtCellSwipe)
 Vue.component('mt-swipe', mtSwipe) */
/*FastClick.attach(document.body)*/

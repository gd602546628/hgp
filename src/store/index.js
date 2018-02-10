/**
 * Created by gd on 2017/6/12/012.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './action'
import localStorageService from '@/service/common/localStorage/localStorage.service'
import UserStore from './modules/user/index'
import OrderStore from './modules/order/index'

Vue.use(Vuex)

const state = {
  isBack: true,
  pageTransition: '_slide',
  test: '',
  selectCity: localStorageService.getStorage('selectCity') || {
    province: '云南省',
    city: '玉溪市',
    country: null
  },
  transitionType: '',
  tempComponent: [],
  showSearch: false,
  indexTabState: {}, // 控制首页tab
  collectedTab: {
    index: 0
  }, // 控制收藏界面的tab
  /***************/
  keepAliveInclude: [],
  keepAliveExclude: [],
  /*****************/
  isAuditingIosApp: false
}
export default new Vuex.Store({
  state,
  mutations,
  actions,
  modules: {
    UserStore,
    OrderStore
  }
})

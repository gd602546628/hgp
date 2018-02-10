/**
 * Created by gd on 2017/6/12/012.
 */
import localStorageService from '@/service/common/localStorage/localStorage.service'

export default {
  setIsBack (state, isBack) {
    state.isBack = isBack
  },
  addExclude (state, name) {
    state.keepAliveExclude.push(name)
  },
  removeExclude (state, name) {
    state.keepAliveExclude = state.keepAliveExclude.filter(item => {
      return item !== name
    })
  },
  addInclude (state, name) {
    if (state.keepAliveInclude.indexOf(name) === -1) {
      state.keepAliveInclude.push(name)
    }
  },
  removeInclude (state, name) {
    state.keepAliveInclude = state.keepAliveInclude.filter(item => {
      return item !== name
    })
  },
  mutationTest (state, data) {
    state.test = data
  },
  SelectCityMutation (state, data) {
    state.selectCity = data
    localStorageService.setStorage('selectCity', state.selectCity)
  },
  addTempComponent (state, data) {
    state.tempComponent.push(data)
  },
  clearTempComponent (state) {
    while (state.tempComponent.length > 0) {
      let component = state.tempComponent.push()
      if (component.$destroy) {
        component.$destroy()
      }
    }
  },
  openPageTransition (state, flag) {
    if (flag) {
      state.pageTransition = '_slide'
    } else {
      state.pageTransition = '_slide-stop'
    }
  },
  showSearchMutation (state, flag) {
    state.showSearch = flag
  },
  switchIndexTab (state, {index, params}) {
    state.indexTabState = {
      index,
      params
    }
  },
  switchCollectedTab (state, {index}) {
    state.collectedTab = {
      index
    }
  },
  setAuditingIosApp (state, {isAuditingIosApp}) {
    state.isAuditingIosApp = isAuditingIosApp
  }
}

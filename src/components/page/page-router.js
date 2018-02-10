/**
 * Created by guooug on 2017/6/14.
 */
import Vue from 'Vue'
import WeixinService from '@/service/weixin/weixin.service'
import ShareService from '@/service/share/share.service'
import Native from '@/service/common/native/native.service'
import Util from '@/service/common/utils/util.service'

class RouterConfig {
  constructor(router, store) {
    this.store = store
    this.router = router
  }

  isBack(to, from) {
    let toTime = parseInt(to.query._time || 0)
    let fromTime = parseInt(from.query._time || 0)
    if (toTime <= fromTime) {
      return true
    }
    return false
  }

  setCacheBeforeEach(to, from) {
    if (to.name !== from.name) {
      let hasCache = this.store.state.keepAliveInclude.indexOf(to.name) !== -1
      let isPush = !this.isBack(to, from)
      if (hasCache && isPush) { // 进入下一页 并且缓存中已经有数据，则清除缓存
        this.store.commit('addExclude', to.name)
        this.store.commit('removeInclude', to.name)
      }
      if (!isPush || to.meta.clearBeforeRouteCache) { // 后退，清除后面的数据
        this.store.commit('addExclude', from.name)
        this.store.commit('removeInclude', from.name)
      }
    }
  }

  setCacheAfterEach(to, from) {
    if (to.name !== from.name) {
      this.store.commit('removeExclude', to.name)
      this.store.commit('addInclude', to.name)
    }
  }

  goToSecondWebView(url) {
    Native.todoNative('convenient_life', 'gotoSecondWebView', {
      url: url
    })
  }

  config = () => {
    this.router.beforeEach((to, from, next) => {
      if (Native.isApp() && to.params.secondWebView || this.store.state.isAuditingIosApp) {
        let url = window.location.href.split('#')[0] + '#' + (to.fullPath || to.path)
        this.goToSecondWebView(url)
        next(false)
        return
      }
      let isPush = !this.isBack(to, from)
      this.store.commit('setIsBack', !isPush)
      this.setCacheBeforeEach(to, from)
      // 判断权限
      if (to.meta.requireAuth && isPush) {
        // 已经具有权限
        if (this.store.getters.hasAuth) {
          next()
        } else {
          this.store.dispatch('getUserToken', {
            type: 'getUserToken',
            forceLogin: true,
            to
          }).then((userInfo) => {
            if (Native.isApp()) {
              next()
            }
          }).catch((e) => {
            next(false)
          })
        }
      } else {
        next()
      }
    })
    this.router.afterEach((to, from, next) => {
      // 设置标题，设置微信分享的链接和分享图
      if (to.meta.title) {
        Util.setTitle(to.meta.title)
      }
      Vue.nextTick((e) => {
        // 将当前的page添加到缓存中
        this.setCacheAfterEach(to, from)
        // 如果在微信中将设置分享的内容
        if (!to.meta.noSetShare) {
          setTimeout(() => {
            if (WeixinService.isWeixin()) {
              // 在微信分享的时候分享默认的地址
              let shareData = null
              if (to.meta.wxShareDefaultUrl) {
                shareData = ShareService.getWxDefaultInfo(true)
                WeixinService.setShare(shareData)
              } else {
                shareData = ShareService.getServantMainDefaultInfo()
              }
              if (shareData.title) {
                WeixinService.setShare(shareData)
              }
            }
          }, 300)
        }
      })
    })
  }
}

export default {
  router(router, store) {
    const rc = new RouterConfig(router, store)
    rc.config()
  }
}

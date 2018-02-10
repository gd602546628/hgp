/**
 * Created by guooug on 2017/6/14.
 */
import Vue from 'Vue'
import WeixinService from '@/service/weixin/weixin.service'
import img from '@/assets/img/bai_bg.png'
import Util from '@/service/common/utils/util.service'
class RouterConfig {
  constructor (router, store) {
    this.store = store
    this.router = router
    this.parentSelector = '._parent-view'
    this.mainSelector = '._main'
    this.childViewSelector = '._child-view'
    this.reverseClassName = '_transition-reverse'
    this.enterClassName = '_transition_active'
    this.scrollTops = {}
  }

  config = () => {
    this.router.beforeEach((to, from, next) => {
      let isPush = this.router.isPush
      // 移除动态挂载的组件
      /* MountPage.removeAll() */
      // 记忆滚动条的高度
      let run = () => {
        /*     try {
         if (this.router.app.$el) {
         // 目的是为了去掉第一次进入的时候的过渡效果
         this.router.app.$el.querySelector(this.parentSelector).classList.add(this.enterClassName)
         let key = from.path
         if (isPush) {
         this.router.app.$el.querySelector(this.parentSelector).classList.remove(this.reverseClassName)
         // 定位到当前激活的页面
         let childView = this.router.app.$el.querySelector(this.childViewSelector)
         if (!childView) {
         return
         }
         let childViews = childView.querySelectorAll(this.mainSelector)
         for (let item of childViews) {
         let top = item.offsetHeight || item.clientHeight
         if (top > 0) {
         this.scrollTops[key] = item.scrollTop
         }
         }
         } else {
         this.router.app.$el.querySelector(this.parentSelector).classList.add(this.reverseClassName)
         }
         }
         } catch (e) {
         console.info(e)
         } */
        next()
      }
      // 判断相应的界面是否需要权限进入
      if (to.meta.requireAuth && isPush) {
        // 已经具有权限
        if (this.store.getters.hasAuth) {
          run()
        } else {
          next('/login')
          this.store.dispatch('getUserToken', {
            type: 'getUserToken',
            forceLogin: true,
            to
          })
        }
      } else {
        run()
      }
    })
    this.router.afterEach((to, from, next) => {
      // 设置标题，设置微信分享的链接和分享图
      if (to.meta.title) {
        Util.setTitle(to.meta.title)
      }
      if (WeixinService.isWeixin()) {
        let link = window.location.href
        // 在微信分享的时候分享默认的地址
        if (to.meta.wxShareDefaultUrl || to.meta.requireAuth) {
          link = link.split('#')[0]
        }
        let share = {
          'imgUrl': img, // 分享图，默认当相对路径处理，所以使用绝对路径的的话，“http://”协议前缀必须在。
          'title': document.title, // 分享卡片标题
          'link': link, // 分享出去后的链接，这里可以将链接设置为另一个页面。
          'success': function () { // 分享成功后的回调函数
          },
          'cancel': function () {
          }
        }
        WeixinService.setShare(share)
      }
      let isPush = this.router.isPush
      let key = to.path
      let top = this.scrollTops[key]
      Vue.nextTick(() => {
        if (!isPush) {
          let childView = this.router.app.$el.querySelectorAll(this.childViewSelector)[1]
          // 再选中滚动元素
          if (childView) {
            let childViews = childView.querySelectorAll(this.mainSelector)
            for (let item of childViews) {
              if (item.clientHeight > 0 || item.offsetHeight > 0) {
                item.scrollTop = top
              }
            }
          }
        }
        // 设置push为false
        this.router.isPush = false
      })
    })
  }
}
export default {
  router (router, store) {
    const rc = new RouterConfig(router, store)
    rc.config()
  }
}

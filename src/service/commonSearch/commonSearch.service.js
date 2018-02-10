
/**
 * Created by gd on 2017/6/14/014.
 */
import Vue from 'vue'
import commonSearch from '@/components/commonSearch/commonSearch.component'

let bodyStopMove = function (scrollTop) {
  document.body.classList.add('stopMove')
  document.body.style.top = -scrollTop + 'px'
}
let bodyCanMove = function (scrollTop) {
  document.body.classList.remove('stopMove')
  document.body.scrollTop = scrollTop
}
// component构造函数
let SearchConstructor = Vue.extend(commonSearch)
let Search = (isMain, type) => {
  // 缓存滚动body滚动条位置
  let scrollTop = document.body.scrollTop
  // 禁止body滚动
  bodyStopMove(scrollTop)
  // 构造component实例
  let instance = new SearchConstructor({el: document.createElement('div')})
  // 监听历史记录改变时影藏modal
  let histroyListen = function () {
    instance.$emit('close')
  }
  window.addEventListener('hashchange', histroyListen)
  let deffer = new Promise((resolve, reject) => {
    // 向实例添加属性，类似props
    instance.isMain = isMain
    instance.type = type
    let remove = (event) => {
      if (!event) {
        document.body.removeChild(instance.$el)
        return
      }
      if (event.target.parentNode) {
        event.target.parentNode.removeChild(event.target)
      }
    }
    document.body.appendChild(instance.$el)
    Vue.nextTick(() => {
      instance.visible = true
      //  instance.$el.removeEventListener('webkitTransitionEnd', remove)
      //  instance.$el.removeEventListener('transitionend', remove)
    })
    // 响应实例中close事件
    instance.$on('close', (data) => {
      // 移除历史记录监听
      window.removeEventListener('hashchange', histroyListen)
      // modal关闭，恢复body滚动
      bodyCanMove(scrollTop)
      remove()
      //  instance.$el.addEventListener('webkitTransitionEnd', remove)
      //  instance.$el.addEventListener('transitionend', remove)
      instance.visible = false
      if (typeof data !== 'undefined') {
        resolve(data)
      } else {
        reject(null)
      }
    })
  })
  return deffer
}
export default Search


/**
 * Created by guooug on 2017/6/16.
 */
import Vue from 'Vue'
import store from '@/store/index'

class MountPage {

  constructor () {
    this.containerSelector = '._mount-container'
    this.close = 'close'
    this.mounts = []
  }

  add (component) {
    return new Promise((resolve, reject) => {
      let constructor = Vue.extend(component)
      let el = document.createElement('div')
      document.body.appendChild(el)
      let instance = new constructor({el: el, store})
      this.mounts.push(instance)
      instance.resolve = resolve
      instance.reject = reject
      instance.$on(this.close, (data) => {
        this._remove(instance)
        resolve(data)
      })
    })
  }

  _remove (instance) {
    let index = this.mounts.indexOf(instance)
    if (index !== -1) {
      this.mounts.splice(index, 1)
    }
  }

  destroy (instance, data) {
    try {
      instance.reject(data)
      let el = instance.$el
      instance.$destroy()
      setTimeout(() => {
        el.remove()
        //   document.querySelector(this.containerSelector).innerHTML = ''
      }, 600)
    } catch (e) {
      console.info(e)
    }
  }

  removeAll () {
    while (this.mounts.length > 0) {
      let mount = this.mounts.pop()
      this.destroy(mount, null)
    }
  }
}
export default new MountPage()


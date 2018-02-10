/**
 * Created by gd on 2017/7/7/007.
 */

import {Toast} from 'mint-ui'
class ToastService {
  constructor() {
    this.option = {
      message: '',
      position: 'bottom',
      'iconClass': '',
      'className': ''
    }
  }

  top(message) {
    this.option.position = 'top'
    this.option.iconClass = ''
    this.option.className = ''
    this.option.message
    Toast(this.option)
  }

  bottom(message) {
    this.option.position = 'bottom'
    this.option.iconClass = ''
    this.option.className = ''
    this.option.message = message
    Toast(this.option)
  }

  success(message) {
    this.option.position = 'middle'
    this.option.iconClass = 'toast-success-icon icon-zyt-draw'
    this.option.className = 'middle-toast'
    this.option.message = message
    Toast(this.option)
  }

  fail(message) {
    this.option.position = 'middle'
    this.option.iconClass = 'toast-success-icon icon-zyt-close-mark'
    this.option.className = 'middle-toast'
    this.option.message = message
    Toast(this.option)
  }
}

export default new ToastService()

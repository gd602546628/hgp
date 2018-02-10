/**
 * Created by gd on 2017/8/22/022.
 */

export default class ScrollFix {
  constructor(el) {
    this.el = el
    this.startY = 0
    this.startTopScroll = 0
    this.init()
  }

  init() {
    if (!this.el) {
      return
    }
    this.el.addEventListener('touchstart', (event) => {
      this.startY = event.touches[0].pageY
      this.startTopScroll = this.el.scrollTop
      if (this.startTopScroll <= 0) {
        this.el.scrollTop = 1
      }
      if (this.startTopScroll + this.el.offsetHeight >= this.el.scrollHeight) {
        this.el.scrollTop = this.el.scrollHeight - this.el.offsetHeight - 1
      }
    }, false)
  }
}

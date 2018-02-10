/**
 * Created by gd on 2017/8/2/002.
 */
import Vue from 'vue'
import drawAlert from './drawAlert.component.vue'
let DrawAlertConstructor = Vue.extend(drawAlert)
let instance = new DrawAlertConstructor({el: document.createElement('div')})
document.body.appendChild(instance.$el)
class DrawAlert {
  showWin (drawResult, drawInfo) {
    instance.status = 0
    instance.show = true
    instance.drawResult = drawResult
    instance.drawInfo = drawInfo
  }

  showNoWin (noWinText, drawInfo) {
    instance.noWinText = noWinText
    instance.status = 1
    instance.show = true
    instance.drawInfo = drawInfo
  }

  showNoNum (noNumText, drawInfo) {
    instance.noNumText = noNumText
    instance.status = 2
    instance.show = true
    instance.drawInfo = drawInfo
  }

  showAlert (msg, drawInfo) {
    instance.status = 3
    instance.show = true
    instance.msg = msg
    instance.drawInfo = drawInfo
  }
}
export default new DrawAlert()

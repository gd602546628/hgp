/**
 * Created by guooug on 2017/8/7.
 */
class TimeService {
  constructor () {
    this.timeDifference = 0
    /* eslint-disable no-extend-native */
    Date.prototype.Format = function (fmt) { // author: meizz
      var o = {
        'M+': this.getMonth() + 1,                 // 月份
        'd+': this.getDate(),                    // 日
        'h+': this.getHours(),                   // 小时
        'm+': this.getMinutes(),                 // 分
        's+': this.getSeconds(),                 // 秒
        'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
        'S': this.getMilliseconds()             // 毫秒
      }
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
      }
      for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
        }
      }
      return fmt
    }
  }
  date (dateStr) {
    let reg = /-/g
    if (dateStr) {
      if (typeof dateStr === 'string') {
        dateStr = dateStr.replace(reg, '/')
      }
      return new Date(dateStr)
    }
    return new Date()
  }
  // 设置本地时间和服务器之间的时间差
  setTimeDifference (sysTime) {
    if (sysTime) {
      let time = this.date(sysTime).getTime() - new Date().getTime()
      this.timeDifference = time
    }
  }
  // 获取服务器时间
  sysTime () {
    return new Date().getTime() + this.timeDifference
  }
}
export default new TimeService()

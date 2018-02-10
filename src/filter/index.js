/**
 * Created by guooug on 2017/6/27.
 */
import Util from '@/service/common/utils/util.service'

let imgPrefix = function (value, prefix) {
  return Util.addImgPrefix(value, prefix)
}
let toFixed = function (value, length = 2) {
  try {
    return parseFloat(value).toFixed(length)
  } catch (e) {
    return value
  }
}

let dateFormat = function (value, format = 'yyyy-MM-dd hh:mm:ss') {
  let date = Util.date(value)
  if (date) {
    return date.Format(format)
  }
  return value
}

/* 折扣过滤器 */
let discountFilter = function (value) {
  if (typeof value !== 'number' || !value) {
    return
  }
  var Capital = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  var int = Math.round(value)
  if (value === 0 || value === 10) {
    return null
  }
  return Capital[int]
}

/* 评分过滤 */
let startFn = function (val) {
  try {
    val = parseFloat(val)
    val = val < 4.95 ? val + 0.05 : val
    let str = val.toString()
    if (str.length >= 3) {
      let newstr = str.substring(0, 3)
      return newstr
    } else {
      if (str.length === 1) {
        return str + '.0'
      } else {
        return str
      }
    }
  } catch (e) {
  }
  return val
}

export default (Vue, options) => {
  Vue.filter('imgPrefix', imgPrefix)
  Vue.filter('toFixed', toFixed)
  Vue.filter('dateFormat', dateFormat)
  Vue.filter('discountFilter', discountFilter)
  Vue.filter('startFn', startFn)
}

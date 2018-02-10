/**
 * Created by gd on 2017/6/13/013.
 */
import {Config} from '@/config/config'
import {MessageBox} from 'mint-ui'
import Native from '@/service/common/native/native.service'

class Util {
  // 常见的正则表达式
  /* eslint-disable no-useless-escape */
  roles = {
    verification: [/^\s*[\s\S]{6}\s*$/, '请输入6位验证码'],
    length6: [/^\s*[\s\S]{1,6}\s*$/, '请填写1-6个字'],
    length16: [/^\s*[\s\S]{1,16}\s*$/, '请填写1-16个字'],
    length30: [/^\s*[\s\S]{1,30}\s*$/, '请填写1-30个字'],
    length140: [/^\s*[\s\S]{1,140}\s*$/, '请填写1-140个字'],
    notEmpty: [/[^^\s*$]/, '不能为空'],
    digits: [/^\d+$/, '请填写数字'],
    letters: [/^[a-z]+$/i, '请填写字母'],
    date: [/^\d{4}-\d{2}-\d{2}$/, '请填写有效的日期，格式:yyyy-mm-dd'],
    time: [/^([01]\d|2[0-3])(:[0-5]\d){1,2}$/, '请填写有效的时间，00:00到23:59之间'],
    email: [/^[\w\+\-]+(\.[\w\+\-]+)*@[a-z\d\-]+(\.[a-z\d\-]+)*\.([a-z]{2,4})$/i, '请填写有效的邮箱'],
    url: [/^(https?|s?ftp):\/\/\S+$/i, '请填写有效的网址'],
    qq: [/^[1-9]\d{4,}$/, '请填写有效的QQ号'],
    IDcard: [/^\d{6}(19|2\d)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)?$/, '请填写正确的身份证号码'],
    tel: [/^(?:(?:0\d{2,3}[\- ]?[1-9]\d{6,7})|(?:[48]00[\- ]?[1-9]\d{6}))$/, '请填写有效的电话号码'],
    mobile: [/^1[3-9]\d{9}$/, '请填写有效的手机号'],
    zipcode: [/^\d{6}$/, '请检查邮政编码格式'],
    chinese: [/^[\u0391-\uFFE5]+$/, '请填写中文字符'],
    username: [/^\w{1,12}$/, '请填写3-12位数字、字母、下划线'],
    password: [/^[\S]{6,16}$/, '请填写6-16位字符，不能包含空格'],
    telOrMobile: [/(^(0[0-9]{2,3}(-)?)?[0-9]{7,8}$)|(^((\+?86)|(\(\+86\)))?(1[3|4|5|7|8]\d{9})$)/, '请输入正确的电话号码']
  }

  browser = {
    versions: (function () {
      let u = navigator.userAgent
      return { // 移动终端浏览器版本信息
        trident: u.indexOf('Trident') > -1, // IE内核
        presto: u.indexOf('Presto') > -1, // opera内核
        webKit: u.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核
        gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') === -1, // 火狐内核
        mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), // 是否为移动终端
        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
        android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, // android终端或者uc浏览器
        iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, // 是否为iPhone或者QQHD浏览器
        iPad: u.indexOf('iPad') > -1, // 是否iPad
        webApp: u.indexOf('Safari') === -1, // 是否web应该程序，没有头部与底部
        isQQBrowser: u.indexOf('QQ') !== -1, // 判断是不是qq浏览器
        isUCBrowser: u.indexOf('UCBrowser') !== -1, // 判断是不是UC 浏览器
        isWeixin: u.toLowerCase().indexOf('micromessenger') !== -1
      }
    })(),
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
  }

  // 系统时间和开始和结束时间的比较
  compareTime(start, end, sysTime) {
    start = this.strToDate(start)
    end = this.strToDate(end)
    sysTime = this.strToDate(sysTime)
    sysTime = sysTime || new Date().getTime()
    if (sysTime >= start && sysTime <= end) {
      return true
    }
    return false
  }

  strToDate(time) {
    try {
      let reg = /-/g
      time = time.replace(reg, '/')
      return new Date(time)
    } catch (e) {
      return time
    }
  }

  /**
   * 添加图片前缀
   * @param value
   * @returns {*}
   */
  addImgPrefix(value, prefix) {
    let httpReg = /^(http|\/\/:|data:)/
    let reg = /^(\/|\\)/
    if (value && typeof value === 'string') {
      if (httpReg.test(value)) {
        return value
      }
      value = value.replace(reg, '')
      let resourceReg = /^resource/
      if (resourceReg.test(value)) {
        return Config.imgUrl + value
      } else {
        return prefix || Config.imgPrefix + value
      }
    }
    return value
  }

  compareByString(a, b) {
    if (typeof a === typeof b) {
      return a === b
    } else {
      return '' + a === '' + b
    }
  }

  alert(option) {
    option = typeof option === 'string' ? {message: option} : option
    let defaults = {
      title: '',
      message: '',
      showCancelButton: false,
      closeOnClickModal: false
    }
    let options = Object.assign(defaults, option)
    return MessageBox(options)
  }

  confirm(option) {
    option = typeof option === 'string' ? {message: option} : option
    let defaults = {
      title: '',
      message: '',
      showCancelButton: true,
      closeOnClickModal: false,
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    }
    let options = Object.assign(defaults, option)
    return new Promise((resolve, reject) => {
      MessageBox(options).then(data => {
        if (data === 'confirm') {
          resolve(data)
        } else {
          reject(data)
        }
      }).catch(e => {
        reject()
      })
    })
  }

  compareVersion(v, v2) {
    try {
      var vs = v.split('.')
      var v2s = v2.split('.')
      for (let i = 0; i < vs.length && i < v2s.length; i++) {
        if (parseInt(vs[i]) > parseInt(v2s[i])) {
          return true
        } else if (parseInt(vs[i]) < parseInt(v2s[i])) {
          return false
        }
      }
      if (vs.length < v2s.length) {
        return false
      }
      return true
    } catch (e) {
      return false
    }
  };

  async getAppVersion() {
    let data = await Native.todoNative('common_native', 'getAppVersion', {})
    return data.appVersion
  }

  async isLowIosApp() {
    if (this.browser.versions.ios && Native.isApp()) {
      let appVersion = await this.getAppVersion()
      return !this.compareVersion(appVersion, Config.iosVersion)
    }
    return false
  }

  /**
   * 用rule正则表达式检验val,如果检验不通过就进行提示
   * @param val 值
   * @param rule 正则表达式
   * @param tip 提示信息
   * @returns {boolean}
   */
  check(val, rule, tip) {
    if (rule.test(val)) {
      return true
    }
    if (tip) {
      this.alert({
        message: tip
      })
    }
    return false
  }

  getUrlParam(name, url) {
    let regStr = `(^|&|/?)${name}=([^&]*)(&|$)`
    let reg = new RegExp(regStr)
    if (!url) {
      url = window.location.href
    }
    let r = url.substr(1).match(reg)
    if (r != null) return decodeURIComponent(decodeURIComponent(r[2])).split('#')[0]
    return null
  };

  fillArr(arr, len, item) {
    if (arr.length >= len) {
      return arr
    }
    let newArr = []
    let p = Math.ceil(arr.length / (len - arr.length))
    let P = Math.ceil((len - arr.length) / arr.length)
    let index = 0
    for (let i = 0; i < (len - arr.length) || index < arr.length;) {
      var temp = arr.slice(index, index = index + p)
      if (temp.length > 0) {
        newArr = newArr.concat(temp)
      }
      for (let j = 0; j < P && i < (len - arr.length); j++) {
        i++
        let temp = Object.assign({}, item)
        newArr.push(temp)
      }
    }
    return newArr
  }

  openUrl(url) {
    try {
      /* 判断是不是合法的href */
      var reg = /(^(https?|s?ftp?|sms?|smsto?|tel?|mailto):)|(^\/\/)\S+$/i
      if (!reg.test(url)) {
        url = '//' + url
      }
      window.location.href = url
    } catch (e) {
    }
  }

  date(dateStr) {
    let reg = /-/g
    if (dateStr) {
      if (typeof dateStr === 'string') {
        dateStr = dateStr.replace(reg, '/')
      }
      return new Date(dateStr)
    }
  }

  fileSize(files, maxSize = 5242880) { // 1048576= 1024 * 1024 * 5
    let flag = true
    let arr = [].concat(files)
    arr.forEach(file => {
      if (file.size > maxSize) {
        flag = false
        return false
      }
    })
    return flag
  }

  isBack(to, from) {
    let toTime = parseInt(to.query._time || 0)
    let fromTime = parseInt(from.query._time || 0)
    if (toTime <= fromTime) {
      return true
    }
    return false
  }

  setTitle(title) {
    document.title = title
    if (Native.isApp()) {
      Native.todoNative('convenient_life', 'setTitleText', {
        subTitle: title
      })
    }
  }
}

export default new Util()

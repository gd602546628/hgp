/**
 * Created by gd on 2017/6/13/013.
 */
class NativeService {
  isApp() {
    try {
      if (window['ZybJSInterface'] && typeof window['ZybJSInterface'].doNative === 'function') {
        return true
      } else if (window['webkit'] &&
        window['webkit'].messageHandlers &&
        window['webkit'].messageHandlers['ZybJSInterface'] &&
        typeof window['webkit'].messageHandlers['ZybJSInterface'].postMessage === 'function') {
        return true
      }
    } catch (e) {
    }
    return false
  }

  _doNative(params) {
    try {
      if (window['ZybJSInterface'] && typeof window['ZybJSInterface'].doNative === 'function') {
        window['ZybJSInterface'].doNative(params)
      } else if (window['webkit'] &&
        window['webkit'].messageHandlers &&
        window['webkit'].messageHandlers.ZybJSInterface &&
        typeof window['webkit'].messageHandlers.ZybJSInterface.postMessage === 'function') {
        window['webkit'].messageHandlers.ZybJSInterface.postMessage(params)
      }
    } catch (e) {
    }
  }

  _doResult(data) {
    var str = ''
    try {
      var reg = /(('|')\{)|(\\('|')\{)/g// 支付的时候json字符串有问题
      var reg2 = /(\}('|'))|(\}\\('|'))/g// 支付的时候json字符串有问题
      // ios 特殊处理
      if (typeof data === 'object') {
        str = JSON.stringify(data).replace(reg, '{').replace(reg2, '}')
      } else {
        str = data.replace(reg, '{').replace(reg2, '}')
      }
      return JSON.parse(str)
    } catch (e) {
      return data
    }
  }

  todoNative(className, methodName, params) {
    return new Promise((resolve, reject) => {
      let random = new Date().getTime() + '_' + Math.round(Math.random() * 1000)
      let doZYBNativeSuccessName = 'sc_' + random
      let doZYBNativeFailureName = 'fc_' + random
      let that = this
      window[doZYBNativeSuccessName] = (data) => {
        resolve(that._doResult(data))
        setTimeout(() => {
          delete window[doZYBNativeFailureName]
          delete window[doZYBNativeSuccessName]
        }, 100)
      }
      window[doZYBNativeFailureName] = (data) => {
        reject(that._doResult(data))
        setTimeout(() => {
          delete window[doZYBNativeSuccessName]
          delete window[doZYBNativeFailureName]
        }, 100)
      }
      let data = {
        className: className,
        methodName: methodName,
        success: doZYBNativeSuccessName,
        failed: doZYBNativeFailureName,
        params: params
      }
      this._doNative(JSON.stringify(data))
    })
  }
}
export default new NativeService()

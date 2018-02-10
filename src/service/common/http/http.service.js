/**
 * Created by gd on 2017/6/12/012.
 */
import axios from 'axios'
import {Indicator} from 'mint-ui'
import {Codes, Config} from '@/config/config'
import Store from '@/store/index'
import TimeService from '@/service/time/time.service'
import Qs from 'qs'

class Http {
  constructor() {
    this.defaults = {
      token: false,
      login: true,
      addUserId: true,
      showLoading: false,
      useSimpleQuest: false // 使用表单提交请求
      // showErrAlert: false
    }
  }

  async post(url, params, options) {
    let option = Object.assign({}, this.defaults, options)
    let headerOption = {}
    let data = {}
    let finalUrl = ''
    let publicUrl = Config.urlPrefix + url
    if (url.indexOf('http') >= 0) {
      finalUrl = url
    } else {
      finalUrl = publicUrl
    }
    // 主要是获取请求头参数，添加token
    let getHeaderOption = async () => {
      let result = {
        headers: {}
      }
      if (option.useSimpleQuest) {
        result.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
      }
      if (option.token) {
        let userInfo = await Store.dispatch({
          type: 'getUserToken',
          forceLogin: option.login
        })
        if (userInfo && userInfo.token) {
          if (option.addUserId) {
            params = Object.assign({}, {
              userId: parseInt(userInfo.userId)
            }, params)
          }
          result.headers['token'] = userInfo.token
          return result
        } else {
          throw new Error(`获取权限失败`)
        }
      }
      return result
    }
    /**
     * 调用接口获取数据
     * @returns {Promise.<*>}
     */
    let getDataByHttp = async () => {
      if (option.showLoading) {
        Indicator.open({
          spinnerType: 'fading-circle'
        })
      }
      let resultParams = null
      resultParams = option.useSimpleQuest ? Qs.stringify(params) : params
      let data = await axios.post(finalUrl, resultParams, headerOption).catch((e) => {
        // 注释掉alert
        /*     if (option.showErrAlert) {
         util.alert({message: '连接失败'})
         } */
        if (option.showLoading) {
          Indicator.close()
        }
        alert(e)
        throw new Error(`服务器挂了`)
      })
      if (option.showLoading) {
        Indicator.close()
      }
      data = data.data
      return data
    }
    /**
     * 如果权限过期，退出登录→获取权限→重新调用接口获取数据
     * @returns {Promise.<void>}
     */
    let checkAuth = async () => {
      /**
       * 跳转到登录界面获取用户信息，成功就调用数据
       * @returns {Promise.<void>}
       */
      let goToLogin = async () => {
        if (option.login) {
          headerOption = await getHeaderOption()
          // 重新从接口获取数据
          data = await getDataByHttp()
        }
      }
      let flag = data && (data.code === Codes.tokenTimeOut || data.code === Codes.unAuthority || data.code === Codes.unknownToken)
      if (flag) {
        if (headerOption.headers && headerOption.headers.token) {
          let token = headerOption.headers.token
          await Store.dispatch('logout')
          // token失效的时候进行提示，同一个token只提示一次
          let confirm = await Store.dispatch({
            type: 'tipDisableToken',
            token: token
          }).catch((e) => {
          })
          if (confirm === 'confirm') {
            await goToLogin()
          } else {
            throw new Error(`取消登录`)
          }
        }
      }
    }
    /* let alert = () => {
     if (data && Codes.success !== data.code) {
     if (option.showErrAlert) {
     util.alert({message: data.mesg || data.msg || data.message})
     throw new Error(`接口调用失败,接口地址:${Config.urlPrefix + url},
     /n接口入参:${params},响应数据${data}`)
     }
     }
     } */

    /**
     * 流程描述
     * 1 如果需要权限：获取token请求头，在参数中添加userId，如果用户取消登录则抛出异常 结束接口调用
     * 2 调用接口获取数据
     * 3 如果权限过期：退出登录，重复步骤 1,2
     * 4 对接口数据预处理
     * 5 返回接口数据
     */
    //   * 1 如果需要权限：获取token请求头，在参数中添加userId，如果用户取消登录则抛出异常 结束接口调用
    headerOption = await
      getHeaderOption()
    //    * 2 调用接口获取数据
    data = await
      getDataByHttp()
    //    * 3 如果权限过期：退出登录，重复步骤 1,2 然后到步骤4
    await checkAuth()
    //    * 4 对接口数据预处理
    // alert() 屏蔽弹框功能
    //    * 5 返回接口数据
    if (data.timestamp) {
      TimeService.setTimeDifference(data.timestamp)
    }
    return data
  }

  async postFile(url, params) {
    let formData = new FormData()
    for (let key in params) {
      formData.append(key, params[key])
    }
    let data = await axios({
      url: url,
      method: 'post',
      data: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
        /* 'Content-Type': 'multipart/form-data' */
      }
    })
    return data
  }
}

export default new Http()

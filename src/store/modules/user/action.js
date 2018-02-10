/**
 * Created by guooug on 2017/6/20.
 */
import Native from '@/service/common/native/native.service'
import LoginApi from '@/api/login/login.api'
import {Codes} from '@/config/config'
import * as types from './mutation-types'
import Router from '@/router'
import Util from '@/service/common/utils/util.service'
import UserApi from '@/api/user/user.api'

/**
 * 调取登录接口
 * @param commit
 * @param params
 * @param isSmsLogin 是否是短信验证码登录
 * @returns {Promise.<*>}
 */
let login = async function ({commit}, {params, isSmsLogin}) {
  let data = null
  if (isSmsLogin) {
    data = await LoginApi.smsLogin(params).catch((e) => {
    })
  } else {
    data = await LoginApi.login(params).catch((e) => {
      console.log('login', e)
    })
  }
  if (data && data.code === Codes.success) {
    let userInfo = data.data
    commit(types.SAVE_USER_INFO, {userInfo})
  } else {
    commit(types.SAVE_USER_INFO, {})
  }
  return data
}

// 退出登录
let logout = async function ({commit, state}) {
  if (Native.isApp()) {
    await Native.todoNative('account_info', 'logout', {}).catch((e) => {
      console.log('logout', e)
    })
    commit(types.SAVE_USER_INFO, '')
  } else {
    let token = ''
    if (state.userInfo && state.userInfo.token) {
      token = state.userInfo.token
    }
    await LoginApi.logout({
      token: token
    }).catch((e) => {
      console.log('logout', e)
    })
    commit(types.SAVE_USER_INFO, '')
  }
}

/**
 * 登录信息过期的时候进行首次提示，同一个token，只会提示一次
 * @param commit
 * @param state
 * @param token
 * @returns {Promise.<*>}  'confirm' 成功确认，
 */
let tipDisableToken = async function ({commit, state}, {token}) {
  try {
    if (_tipDisableTokenPromise) {
      return _tipDisableTokenPromise
    }
    if (token === state.disableToken) {
      // 'confirm' 是为了和showConfirm框保持一致
      return Promise.resolve('confirm')
    }
    let finallyFun = (data) => {
      commit(types.CHANGE_DISABLE_TOKEN, token)
      _tipDisableTokenPromise = null
      return data
    }
    _tipDisableTokenPromise = Util.confirm({
      message: '登录信息已失效，请重新登录'
    }).then(finallyFun).catch(finallyFun)
    return _tipDisableTokenPromise
  } catch (e) {
  }
}

let _tipDisableTokenPromise = null

let _openLoginPromise = null

let _openLoginByH5 = async function (to) {
  let finallyFun = (data) => {
    _openLoginPromise = null
    return data
  }
  _openLoginPromise = new Promise((resolve, reject) => {
    Router.push({
      name: 'login',
      params: {
        resolve, reject, to
      }
    })
  }).then(finallyFun).catch(finallyFun)
  return _openLoginPromise
}

let _openLoginByApp = async function (forceLogin) {
  _openLoginPromise = new Promise((resolve, reject) => {
    Native.todoNative('account_info', 'getUserInfo', {
      forceLogin: forceLogin ? 1 : 0
    }).then((userInfo) => {
      // 兼容老的app
      userInfo['userId'] = userInfo.id || userInfo.userId
      userInfo['token'] = userInfo.accessToken || userInfo.token
      resolve(userInfo)
      _openLoginPromise = null
    }).catch((userInfo) => {
      reject(null)
      _openLoginPromise = null
    })
  })
  return _openLoginPromise
}

/**
 * 获取用户的token
 * @param commit
 * @param state
 * @param forceLogin forceLogin:true 如果没有用户信息，登录之后获取用户信息；为 false 直接返回state state.userInfo
 * @returns {Promise.<watch.userInfo|{handler}|userInfo|*>}
 */
let getUserToken = async function ({commit, state}, {forceLogin = false, to}) {
  // 如果缓存里有就直接返回
  if (state.userInfo) {
    return state.userInfo
  }
  // _openLoginPromise 打开登录框，等待用操作之后的结果；保证只会打开一个H5登录窗口，只会打开一个app的登录界面
  if (_openLoginPromise) {
    return _openLoginPromise
  }
  let userInfo = null
  if (Native.isApp()) { // 调用app的登录界面
    userInfo = await _openLoginByApp(forceLogin).catch((e) => {
      console.log('_openLoginByApp', e)
      commit(types.SAVE_USER_INFO, {})
      throw String('获取用户信息失败')
    })
  } else if (forceLogin) { // 调用H5的登录界面
    userInfo = await _openLoginByH5(to).catch((e) => {
      console.log('_openLoginByH5', e)
      commit(types.SAVE_USER_INFO, {})
      throw String('获取用户信息失败')
    })
  }
  if (userInfo && userInfo.token) {
    commit(types.SAVE_USER_INFO, {userInfo})
  } else {
    commit(types.SAVE_USER_INFO, {})
  }
  return userInfo
}

let getUserInfo = async function ({commit, state}, {address}) {
  if (address) {
    let data = await UserApi.getAccountInfo({}).catch(e => {
    })
    if (data.code === Codes.success && data.data.receiveAddressList) {
      commit(types.UPDATE_ADDRESS, data.data.receiveAddressList)
    }
  }
}

let modifyUserInfo = async function ({commit, state}, {nickName, headImg}) {
  let data = await UserApi.modifyUserInfo(arguments[1]).catch((e) => {
  })
  if (data.code === Codes.success) {
    let userInfo = Object.assign({}, state.userInfo, arguments[1])
    commit(types.SAVE_USER_INFO, {userInfo})
  }
}

let setDefaultAddress = async function ({commit, state}, {addressId}) {
  let data = await UserApi.setDefaultAddress({
    addressId: addressId
  }).catch(e => {
    throw String('设置成功')
  })
  if (data.code === Codes.success) {
    commit(types.SET_DEFAULT_ADDRESS, addressId)
    return '设置成功'
  }
  return '设置失败'
}

let delAddress = async function ({commit, state}, id) {
  let data = await UserApi.delAddress({
    id: id
  }).catch(e => {
    throw String('删除失败')
  })
  if (data.code === Codes.success) {
    commit(types.DEL_ADDRESS, id)
    return '删除成功'
  }
  return '删除失败'
}
let addAddress = async function ({commit, state, dispatch}, address) {
  let data = await UserApi.addAddress(address)
  if (data.code === Codes.success) {
    dispatch('getUserInfo', {
      address: true
    })
    return true
  }
  return false
}

export default {
  login,
  logout,
  getUserToken,
  tipDisableToken,
  getUserInfo,
  modifyUserInfo,
  setDefaultAddress,
  delAddress,
  addAddress
}

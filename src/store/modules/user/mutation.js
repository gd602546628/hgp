/**
 * Created by guooug on 2017/6/20.
 */
import * as types from './mutation-types'
import localStorageService from '@/service/common/localStorage/localStorage.service'

/**
 * 保存用户信息状态，并保存到localStorage中
 * @param state
 * @param userInfo
 */
let saveUserInfo = function (state, {userInfo}) {
  if (userInfo && !userInfo.addressList) {
    userInfo.addressList = []
  }
  state.userInfo = userInfo || null
  localStorageService.setStorage(types.userInfo, userInfo)
  // 将登录成功的用户名存入localstorage中，方便登录的时候直接获取已经登录过的用户名
  if (userInfo && userInfo.userName) {
    let filter = function (userName) {
      return userName !== userInfo.userName
    }
    let list = state.userNameList.filter(filter)
    while (list.length > 4) {
      list.pop()
    }
    list.unshift(userInfo.userName)
    state.userNameList = list
    localStorageService.setStorage(types.userNameList, list)
  }
}

let changeDisableToken = function (state, token) {
  state.disableToken = token
  localStorageService.setStorage(types.disableToken, token)
}
// 修改用户的地址列表
let updateAddress = function (state, AddressList) {
  state.userInfo['addressList'] = AddressList
  localStorageService.setStorage(types.userInfo, state.userInfo)
}

let setDefaultAddress = function (state, addressId) {
  let addressList = state.userInfo['addressList']
  addressList.forEach(address => {
    if (address.addressId === addressId) {
      address.isDefault = 1
    } else {
      address.isDefault = 0
    }
  })
  localStorageService.setStorage(types.userInfo, state.userInfo)
}

let delAddress = function (state, addressId) {
  state.userInfo['addressList'] = state.userInfo['addressList'].filter(address => {
    return address.addressId !== addressId
  })
  localStorageService.setStorage(types.userInfo, state.userInfo)
}

let changeCartState = function (state) {
  state.cartState += 1
}

let changeCollectDoor = function (state) {
  state.collectDoor += 1
}
let changeCollectPrd = function (state) {
  state.collectPrd += 1
}

// mutations
export default {
  [types.SAVE_USER_INFO]: saveUserInfo,
  [types.CHANGE_DISABLE_TOKEN]: changeDisableToken,
  [types.UPDATE_ADDRESS]: updateAddress,
  [types.SET_DEFAULT_ADDRESS]: setDefaultAddress,
  [types.DEL_ADDRESS]: delAddress,
  'changeCartState': changeCartState,
  'changeCollectDoor': changeCollectDoor,
  'changeCollectPrd': changeCollectPrd
}

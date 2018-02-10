/**
 * Created by guooug on 2017/6/20.
 */
import localStorageService from '@/service/common/localStorage/localStorage.service'
import * as types from './mutation-types'
import Native from '@/service/common/native/native.service'
export default {
  userInfo: Native.isApp() ? null : (localStorageService.getStorage(types.userInfo) || null), // 用户的id token等
  userNameList: localStorageService.getStorage(types.userNameList) || [],
  disableToken: localStorageService.getStorage(types.disableToken) || '',
  cartState: 1,
  collectDoor: 1,
  collectPrd: 1
}

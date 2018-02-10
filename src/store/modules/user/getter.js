/**
 * Created by guooug on 2017/6/20.
 */
export default {
  userInfo: state => state.userInfo,
  userNameList: state => state.userNameList,
  hasAuth: state => state.userInfo && state.userInfo.token,
  cartState: state => state.cartState,
  collectDoor: state => state.collectDoor,
  collectPrd: state => state.collectPrd
}

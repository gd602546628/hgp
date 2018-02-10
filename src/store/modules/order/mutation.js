/**
 * Created by guooug on 2017/6/20.
 */

/**
 * 保存用户信息状态，并保存到localStorage中
 * @param state
 * @param userInfo
 */
let setConfirmOrders = function (state, confirmOrders) {
  state.confirmOrders = confirmOrders
}
// mutations
export default {
  setConfirmOrders: setConfirmOrders
}

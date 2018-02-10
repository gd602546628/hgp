/**
 * Created by gd on 2017/6/12/012.
 */
export default {
  testAction ({commit}, data) {
    commit('mutationTest', '异步操作正在执行')
    setTimeout(() => {
      commit('mutationTest', '异步操作执行完毕，触发mutations，接收参数:' + data)
    }, 1000)
  }
}

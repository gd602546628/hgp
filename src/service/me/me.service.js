/**
 * Created by lqj on 2017/7/15
 */
import http from '@/service/common/http/http.service'
import { Codes } from '@/config/config'
class MeService {
  constructor () {
    this.userBaseInfoUrl = 'user/url/getUserBaseInfo' // 获取用户基本信息
    this.accountInfoUrl = 'order/url/getAccountInfo' // 统计订单状态数量以及到店消费状态数量
    this.userWinyuanUrl = 'user/url/getUserWinyuan' // 获取用户的赢元
    this.MyPrizeListUrl = 'draw/url/getMyPrizeList' // 获取我的奖品列表
    this.delUserParticipateRecordUrl = 'draw/url/delUserParticipateRecord' // 删除用户抽奖记录
    this.checkPrizeInfoUrl = 'draw/url/checkPrizeInfo' // 获取奖品信息
  }

  // 获取用户基本信息
  async getUserBaseInfo (params, option) {
    let data = await http.post(this.userBaseInfoUrl, params, {token: true})
    if (data.code === Codes.success) {
      let result = data.data
      return result
    }
  }
  // 统计订单状态数量以及到店消费状态数量
  async getAccountInfo (params, option) {
    let data = await http.post(this.accountInfoUrl, params, {token: true})
    if (data.code === Codes.success) {
      let result = data.data
      return result
    }
  }

  // 获取用户的赢元
  async getUserWinyuan (params, option) {
    let data = await http.post(this.userWinyuanUrl, params, {token: true})
    if (data.code === Codes.success) {
      let result = data.data
      return result
    }
  }

  // 获取我的奖品列表
  async getMyPrizeList (params, option) {
    let data = await http.post(this.MyPrizeListUrl, params, {token: true})
    if (data.code === Codes.success) {
      let result = data.data
      return result
    }
  }

  // 删除用户抽奖记录
  async delUserParticipateRecord (params, option) {
    let data = await http.post(this.delUserParticipateRecordUrl, params, {token: true})
    if (data.code === Codes.success) {
      let result = data.data
      return result
    }
  }

  // 获取奖品信息
  async getCheckPrizeInfo (params, option) {
    let data = await http.post(this.checkPrizeInfoUrl, params, {token: true})
    if (data.code === Codes.success) {
      let result = data.data
      return result
    }
  }
}
export default new MeService()

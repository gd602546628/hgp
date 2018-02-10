/**
 * Created by gd on 2017/7/31/031.
 */
import http from '@/service/common/http/http.service'
class Api {
  constructor() {
    this.checkDrawActivityDetailUrl = 'draw/checkDrawActivityDetail' // 获取抽奖活动详情
    this.findUserLotteryNumUrl = 'user/url/findUserLotteryNum' // 获取用户抽奖次数
    this.judgeUserIsCanDrawUrl = 'draw/url/judgeUserIsCanDraw' // 用户抽奖
    this.userAcceptPrizeUrl = 'draw/url/userAcceptPrize' // 用户领取奖品
    this.checkLogisticsInfoUrl = 'draw/url/checkLogisticsInfo' // 查看奖品物流信息
    this.receiptPrizefoUrl = 'draw/url/userConfirmReceiptPrize' // 用户确认收货
  }

  async getDrawDetail(params) {
    let data = await http.post(this.checkDrawActivityDetailUrl, params)
    return data
  }

  async getUserNum(params) {
    let data = await http.post(this.findUserLotteryNumUrl, params, {token: true})
    return data
  }

  async toDraw(params) {
    let data = await http.post(this.judgeUserIsCanDrawUrl, params, {token: true})
    return data
  }

  async userAcceptPrize(params) {
    let data = await http.post(this.userAcceptPrizeUrl, params, {token: true})
    return data
  }

  async getCheckLogisticsInfo(params) { // 查看奖品物流信息
    let data = await http.post(this.checkLogisticsInfoUrl, params, {token: true})
    return data
  }

  async userConfirmReceiptPrize(params) { // 用户确认收货
    let data = await http.post(this.receiptPrizefoUrl, params, {token: true})
    return data
  }
}
export default new Api()

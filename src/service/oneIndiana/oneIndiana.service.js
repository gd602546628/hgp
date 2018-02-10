/**
 * Created by lqj on 2017/8/8.
 */
import http from '@/service/common/http/http.service'
class ActivityService {
  constructor () {
    this.servantPrdListUrl = 'oyb/getServantPrdList' // 获取一元夺宝列表
    this.oybPrdDetailsUrl = 'oyb/oybPrdDetails' // 一元夺宝详情
    this.goToLatestPhaseUrl = 'oyb/goToLatestPhase' // 前往最新一期
    this.oybCarouselUrl = 'oyb/oybCarousel' // 夺宝导航轮播
    this.oybfPhaseListUrl = 'oyb/oybfPhaseList' // 往期揭晓列表
    this.robTreasureRecordUrl = 'oyb/getRobTreasureRecord' // 获取夺宝记录
    this.myPurchaseListUrl = 'oyb/getMyPurchaseList' // 获取我的夺宝记录列表
    this.calculRulesUrl = 'oyb/getCalculRules' // 计算规则
    this.phaseUserBuyTimesUrl = 'oyb/getPhaseUserBuyTimes'  // 获取当期购买人数
    this.oybfsavePayOrderUrl = 'oyb/oybfsavePayOrder' // 生成订单
  }

  async getServantPrdList (params, option) { // 获取一元夺宝列表
    let data = await http.post(this.servantPrdListUrl, params, option)
    if (data.data && data.data.prdList) {
      let result = {
        list: [],
        page: {
          pageNum: data.data.pageNum,
          totalPage: data.data.totalPage
        }
      }
      result.list = data.data.prdList
      return result
    } else {
      throw new Error('一元夺宝列表为空')
    }
  }

  async getOybPrdDetails (params) { // 一元夺宝详情
    let data = await http.post(this.oybPrdDetailsUrl, params, {showLoading: true, token: true})
    if (data.data) {
      return data.data
    } else {
      throw new Error('获取一元夺宝详情失败')
    }
  }

  async goToLatestPhase (params) { // 前往最新一期
    let data = await http.post(this.goToLatestPhaseUrl, params, {token: true})
    if (data.data) {
      return data.data
    } else {
      throw new Error('获取前往最新一期详情失败')
    }
  }

  async oybCarousel (params, option) { // 夺宝导航轮播
    let data = await http.post(this.oybCarouselUrl, params, option)
    if (data.data) {
      return data.data
    } else {
      throw new Error('获取夺宝导航轮播失败')
    }
  }

  async getOybfPhaseList (params, option) { // 获取往期揭晓列表
    let data = await http.post(this.oybfPhaseListUrl, params, option)
    if (data) {
      return data.data
    }
  }

  async getRobTreasureRecordList (params, option) { // 获取夺宝记录
    let data = await http.post(this.robTreasureRecordUrl, params, option)
    if (!data) { return }
    if (data.data) {
      return data.data
    } else {
      throw new Error(data.mesg)
    }
  }

  async getMyPurchaseList (params) { // 获取我的夺宝记录列表
    let data = await http.post(this.myPurchaseListUrl, params, {showLoading: true, token: true})
    if (!data) { return }
    console.log(data)
    if (data.data) {
      return data.data
    } else {
      throw new Error(data.mesg)
    }
  }

  async getCalculRules (params, option) { // 计算规则
    let data = await http.post(this.calculRulesUrl, params, option)
    if (!data) { return }
    if (data.data) {
      return data.data
    } else {
      throw new Error(data.mesg)
    }
  }

  async getPhaseUserBuyTimes (params, option) { // 获取当期购买人数
    let data = await http.post(this.phaseUserBuyTimesUrl, params, option)
    if (!data) { return }
    if (data) {
      return data
    } else {
      throw new Error(data.mesg)
    }
  }

  async oybfsavePayOrder (params, option) { // 生成订单
    let data = await http.post(this.oybfsavePayOrderUrl, params, option)
    if (!data) { return }
    if (data) {
      return data
    } else {
      throw new Error(data.mesg)
    }
  }

}
export default new ActivityService()

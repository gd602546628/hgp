/**
 * Created by lqj on 2017/6/23
 */

import http from '@/service/common/http/http.service'
import {Config} from '@/config/config'
import Utils from '@/service/common/utils/util.service'
class GoodServiceTypeService {
  constructor () {
    this.getServiceTypeUrl = 'door/getServiceTypeList' // 获取全部服务类型
    this.getServiceSearchListUrl = 'search/getServiceSearchList' // 好服务搜索
    this.getServiceDetailInfoUrl = 'door/viewServiceDetailInfo'  // 好服务详情
    this.getServiceAppointUrl = 'door/url/getServiceAppoint' // 获取好服务预约
    this.getVerificationCodeUrl = 'door/getVerificationCode' // 获取验证码
    this.verifyCodeUrl = 'door/verifyCode' // 验证验证码
    this.submitServiceApplyUrl = 'order/url/submitServiceApply' // 提交预约
    this.getServiceApplyList = 'order/url/getServiceApplyList' // 获取我的预约列表
    this.getServiceApplyInfo = 'order/url/getServiceApplyInfo' // 获取服务预约详情
    this.abrogateServieApply = 'order/url/abrogateServieApply' // 取消预约
    this.getServiceApplyDelList = 'order/url/getServiceApplyDelList' // 获取可删除列表
    this.delServiceApply = 'order/url/delServiceApply' // 删除预约
    this.uploadUrl = Config.mfPath + 'public/fileOperation/uploadFtp'
  }

  async getServiceType (params, option) {
    let data = await http.post(this.getServiceTypeUrl, params, option)
    let result = {
      list: []
    }
    result.list = data.data
    return result
  }

  async getServiceSearchList (params, option) {
    let data = await http.post(this.getServiceSearchListUrl, params, option)
    let result = {
      list: [],
      page: {
        pageNum: data.data.page.pageNum,
        totalPage: data.data.page.totalPage
      }
    }
    result.list = data.data.dataList
    return result
  }

  async getServiceDetailInfo (params, option) {
    let data = await http.post(this.getServiceDetailInfoUrl, params, option)
    let result = {
      list: []
    }
    result.list = data.data
    return result
  }

  async getServiceAppoint (params) {
    let data = await http.post(this.getServiceAppointUrl, params)
    return data
  }

  // 获取验证码
  async getVerificationCode (params) {
    let data = await http.post(this.getVerificationCodeUrl, params)
    return data
  }

  // 验证手机
  async verifyCode (params) {
    let data = await http.post(this.verifyCodeUrl, params)
    return data
  }

  // 提交预约
  async submitServiceApply (params) {
    let data = await http.post(this.submitServiceApplyUrl, params, {token: true, showLoading: true})
    return data
  }

  // 获取我的预约列表
  async getMyService (params) {
    let data = await http.post(this.getServiceApplyList, params, {token: true})
    let result = {
      list: data.data.myMerviceList ? data.data.myMerviceList : '',
      page: {
        totalPage: data.data.totalPage,
        pageNum: data.data.pageNum
      }
    }
    return result
  }

  // 获取预约详情
  async getMyServiceDetail (params) {
    let data = await http.post(this.getServiceApplyInfo, params, {token: true})
    return data.data
  }

  // 取消预约
  async cancelApply (params) {
    let data = await http.post(this.abrogateServieApply, params, {token: true})
    return data
  }

  // 获取可删除预约列表
  async getDelServiceList () {
    let data = await http.post(this.getServiceApplyDelList, {}, {token: true})
    let list = data.data
    // 为删除列表每项添加 checked属性，用来标识是否选中
    list.forEach(item => {
      item.checked = false
    })
    return list
  }

  // 删除预约
  async delService (params) {
    let data = await http.post(this.delServiceApply, params, {token: true, showLoading: true})
    return data
  }

  /**
   * 上传文件
   * @param params
   *  uploadFile ：file
   *  questionId
   *  domainAlias
   * @returns {Promise.<T>}
   */
  async postFile (params) {
    if (!Utils.fileSize(params.uploadFile)) {
      return '文件过大'
    }
    let data = await http.postFile(this.uploadUrl, params).catch(e => {
      console.info(e)
      throw String('上传失败')
    })
    return data
  }
}
export default new GoodServiceTypeService()

/**
 * Created by ljl on 2017/7/4.
 */
import http from '@/service/common/http/http.service'
import axios from 'axios'
import {Config} from '@/config/config'
import { commentAdaptor } from '../../service/comment/commentAdaptor'

class CommentList {
  constructor () {
    this.commentList = 'order/getCommentList' // 评论详情列表
    this.addComment = 'order/url/addComment'  // 评价
    this.modifyComment = 'order/url/editComment' // 修改评论
    this.appendComment = 'order/url/addAppendComment' // 追加评论
    this.replayComment = 'order/url/addCommentReply' // 回复评论
    this.orderInfo = 'order/url/getOrderInfo' // 订单详情
    // this.uploadphoto = Config.mfPath + 'public/fileOperation/uploadFtp'
    this.uploadphoto = Config.basePath + 'common/img/multipartUploadComm' // 上传图片(多图)
  }

  /**
   * 获取评论列表
   * @param params
   * @returns {Promise.<{list: Array, page: {pageNum, totalPage: *}}>}
   */
  async getCommentList (params) {
    let data = await http.post(this.commentList, params)
    let result = {
      list: [],
      page: {
        pageNum: data.data.pageNum,
        totalPage: data.data.totalPage
      }
    }
    data.data.commentListInfos.forEach(item => {
      result.list.push(commentAdaptor(item))
    })
    return result
  }

  /**
   *评价
   * @param params
   * @returns {Promise.<*>}
   */
  async getAddComment (params) {
    let data = await http.post(this.addComment, params, {token: true})
    return data
  }

  /**
   * 修改评论
   * @returns {Promise.<void>}
   */
  async getmodifyComment (params) {
    let data = await http.post(this.modifyComment, params, {token: true})
    return data
  }

  /**
   * 追加评论
   * @param params
   * @returns {Promise.<*>}
   */
  async getAppendComment (params) {
    let data = await http.post(this.appendComment, params, {token: true})
    return data
  }

  /**
   * 回复评价
   * @param params
   * @returns {Promise.<void>}
   */
  async getReplayComment (params) {
    let data = await http.post(this.replayComment, params, {token: true})
    return data
  }

  /**
   * 订单详情
   * @param params
   * @returns {Promise.<void>}
   */
  async getOrderInfo (params) {
    let data = await http.post(this.orderInfo, params, {token: true})
    return data
  }

  /**
   * 图片上传
   * @param params
   * @returns {Promise.<void>}
   */
  async postFile (params) {
    console.log(params)
    /*   let data = await http.postFile(this.uploadphoto, params, {token: true}).catch(e => {
         throw String('上传失败')
       }) */
    let data = await axios({
      url: this.uploadphoto,
      method: 'post',
      data: params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).catch(e => {
      throw new Error('上传失败')
    })
    return data
  }
}

export default new CommentList()

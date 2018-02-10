/**
 * Created by gd on 2017/6/16/016.
 */
import http from '@/service/common/http/http.service'
import {seckillItem} from './adaptor'
import TimeService from '@/service/time/time.service'
class Seckill {
  constructor () {
    this.systemTime = '/common/systemTime' // 系统时间
    this.activityDetail = 'activity/getActivityDetailList' // 活动详情列表
  }

  async getSystemTime () {
    let data = await http.post(this.systemTime, {})
    if (data.code === '000000') {
      data = data.data
    } else {
      data = new Date().getTime()
    }
    return data
  }

  // 获取当前场次
  async getCurrentSession () {
    let currentTime = TimeService.sysTime()
    // currentTime = new Date().getTime()
    let sH = new Date(currentTime).getHours()
    let sM = new Date(currentTime).getMinutes()
    let sS = new Date(currentTime).getSeconds()
    let sMorning = 28800
    let sNoon = 43200
    let sAfternoon = 57600
    let sMidnight = 72000
    let sLast = 86400
    let startTimeS = sH * 60 * 60 + sM * 60 + sS
    let play = {
      endTime: 28800, // 当前场次结束时间
      session: -1, // 当前场次
      difference: sMorning - startTimeS, // 时间差
      startTime: startTimeS // 当前时间
    }
    if (startTimeS > sMorning && startTimeS < sNoon) { // morining
      play.endTime = sNoon
      play.session = 0
      play.difference = play.endTime - startTimeS
    }
    if (startTimeS > sNoon && startTimeS < sAfternoon) { // afternoon
      play.endTime = sAfternoon
      play.session = 1
      play.difference = play.endTime - startTimeS
    }
    if (startTimeS > sAfternoon && startTimeS < sMidnight) { // afternoon
      play.endTime = sMidnight
      play.session = 2
      play.difference = play.endTime - startTimeS
    }
    if (startTimeS > sMidnight && startTimeS < sLast) { // midnight
      play.endTime = sLast
      play.session = 3
      play.difference = play.endTime - startTimeS
    }
    return play
  }

  // 获取活动详情列表
  async getSeckillList (params, option) {
    let data = await http.post(this.activityDetail, params, option)
    let result = {
      list: [],
      page: {
        pageNum: data.data.activityPrdList.pages.pageNum,
        totalPage: data.data.activityPrdList.pages.totalPage
      }
    }
    data.data.activityPrdList.prdActivityList.forEach(item => {
      result.list.push(seckillItem(item))
    })
    return result
  }
}
export default new Seckill()

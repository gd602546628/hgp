/**
 * Created by gd on 2017/6/12/012.
 */
let build = 0 // 0：生产环境，1：188测试环境，2:191 测试环境,3: test.jointem.com, 4: 189 测试环境
let iosVersion = '3.2.3'
let androidVersion = '3.2.0'
// 生产环境
let PrdConfig = {
  urlPrefix: 'http://m.jointem.com/front/public/',
  imgPrefix: 'http://m.jointem.com/',
  imgUrl: 'http://m.jointem.com/',
  mfPath: 'http://m.jointem.com/mf/',
  basePath: 'http://m.jointem.com/base/',
  projectBaseUrl: 'http://m.jointem.com/applstore/#/',
  baseUrl: 'http://m.jointem.com/',
  commentImgUrl: 'http://m.jointem.com/site/',
  wxAppId: 'wxd3f80d90e217d283',
  defaultDoorId: 2556, // 默认的店铺id,
  iosVersion: iosVersion,
  androidVersion: androidVersion,
  // TODO:生产环境跟换url
  wxJSApiInfoUrl: 'http://172.31.60.189/zc/pay/getWxJSApiInfo'
}
// 开发环境
let DevConfig = {
  urlPrefix: 'http://172.31.60.188/front/public/',
  imgPrefix: 'http://172.31.60.188/entsite/',
  imgUrl: 'http://172.31.60.188/',
  mfPath: 'http://172.31.60.188/mf/',
  basePath: 'http://172.31.60.188/base/',
  projectBaseUrl: 'http://172.31.60.188/entsite/applstore/#/',
  baseUrl: 'http://172.31.60.188',
  commentImgUrl: 'http://172.31.60.188/site/',
  wxAppId: 'wxd3f80d90e217d283',
  defaultDoorId: 250, // 默认的店铺id,
  iosVersion: iosVersion,
  androidVersion: androidVersion,
  wxJSApiInfoUrl: 'http://172.31.60.189/zc/pay/getWxJSApiInfo'
}
// 测试环境 191
let DevConfig191 = {
  urlPrefix: 'http://172.31.60.191/front/public/',
  imgPrefix: 'http://172.31.60.191/entsite/',
  imgUrl: 'http://172.31.60.191/',
  mfPath: 'http://172.31.60.191/mf/',
  basePath: 'http://172.31.60.191/base/',
  projectBaseUrl: 'http://172.31.60.191/entsite/applstore/#/',
  baseUrl: 'http://172.31.60.191/',
  wxAppId: 'wxd3f80d90e217d283',
  defaultDoorId: 250, // 默认的店铺id,
  iosVersion: iosVersion,
  androidVersion: androidVersion
}
// 测试环境
let test = {
  urlPrefix: 'http://test.jointem.com:6080/front/public/',
  imgPrefix: 'http://test.jointem.com:6080/entsite/',
  imgUrl: 'http://test.jointem.com:6080/',
  mfPath: 'http://m.jointem.com:6080/mf/',
  basePath: 'http://m.jointem.com:6080/base/',
  projectBaseUrl: 'http://m.jointem.com:6080/entsite/applstore/#/',
  baseUrl: 'http://m.jointem.com:6080',
  wxAppId: 'wxd3f80d90e217d283',
  defaultDoorId: 250, // 默认的店铺id,
  iosVersion: iosVersion,
  androidVersion: androidVersion
}

export const DownloadUrl = 'http://m.jointem.com/mobilJointem/zyb.html'

export const Config = (() => {
  if (build === 0) {
    return PrdConfig
  } else if (build === 1) {
    return DevConfig
  } else if (build === 2) {
    return DevConfig191
  } else {
    return test
  }
})()
export const Codes = {
  success: '000000',
  code01: '000001', // 用户注册过
  code02: '000002',

  code103: '100003', // 发送短信验证码的手机已经注册过
  code106: '100006',  // 注册的时候提示已经注册过
  notRegister: '400009',
  loginError: '400008',
  hasReceive: '000029', // 领取完毕
  couponNoNum: '000006', // 优惠券数量为0
  unAuthority: '400002',
  unknownToken: '400012', // 无效token
  tokenTimeOut: '400011' // token过期
}
import img from '@/assets/img/coupon/share.png' // 默认的分享图
export const defaultShare = {
  'title': '全城聚惠', // 分享卡片标题
  'desc': '【全城聚惠】汇聚全城最全、最优惠的优惠信息，登录即可领取使用！',
  'imgUrl': window.location.origin + window.location.pathname + img
}
export const defaultServantMainShare = {
  'title': '全城聚惠', // 分享卡片标题
  'desc': '【全城聚惠】汇聚全城最全、最优惠的优惠信息，登录即可领取使用！',
  'imgUrl': window.location.origin + window.location.pathname + img
}
export const Imgs = {
  ratio1_1: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpjNjNjYjUzZS1kNTlkLTdhNDctYThlNS1hMDc2NTYyMjZhOGQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RTEzQzhGRjczRTZDMTFFNkEyRkVEREIwODExMkRCMkYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RTEzQzhGRjYzRTZDMTFFNkEyRkVEREIwODExMkRCMkYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOmQ2MzllNWZlLTI2MjMtMDM0Mi1hOGZlLTBmMDVkOGI4NWUzZiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpjNjNjYjUzZS1kNTlkLTdhNDctYThlNS1hMDc2NTYyMjZhOGQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz64TO1nAAAAFUlEQVR42mL8//8/AwgwMUABQIABADAGAwGo78J/AAAAAElFTkSuQmCC`
}


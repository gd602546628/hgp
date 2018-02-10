/**
 * Created by gd on 2017/6/12/012.
 */
import http from '@/service/common/http/http.service'
let addCoupon = function (params, option) {
  let url = 'user/url/addCoupon'
  let deffer = new Promise((resolve, reject) => {
    http.post(url, params, option).then(data => {
      resolve(data)
    }).catch(err => {
      reject(err)
    })
  })
  return deffer
}
export default addCoupon

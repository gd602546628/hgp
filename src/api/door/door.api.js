/**
 * Created by guooug on 2017/7/4.
 */
import http from '@/service/common/http/http.service'
import {Codes} from '@/config/config'
class DoorApi {
  constructor () {
    this.doorInfoUrl = 'door/getDoorInfo'
  }
  // 获取店铺信息
  async getDoorInfo (doorId) {
    let data = await http.post(this.doorInfoUrl, {
      doorId: doorId
    }).catch((e) => {
      console.log('getDoorInfo', e)
    })
    if (data.code === Codes.success) {
      return data.data
    } else {
      return null
    }
  }
}
export default new DoorApi()

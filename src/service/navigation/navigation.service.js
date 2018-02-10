/**
 * Created by guooug on 2017/8/15.
 */
import Native from '@/service/common/native/native.service'
import Util from '@/service/common/utils/util.service'
class NavigationService {
  constructor () {
    this.className = 'common_native'
    this.methodName = 'toNavigationAty'
  }

  getNavigationUrl ({currentLat, currentLng, destinationLat, destinationLng, destinationName, region}) {
    if (currentLat && currentLng) {
      return `http://api.map.baidu.com/direction?origin=${currentLat},${currentLng}&destination=${destinationLat},${destinationLng}&mode=driving&region=${region}&output=html`
    } else {
      return `http://api.map.baidu.com/marker?location=${destinationLat},${destinationLng}&title=${destinationName}&output=html`
    }
  }

  /**
   * 导航
   * @param currentLat 用户位置 可以不传
   * @param currentLng
   * @param destinationLat 目的地位置
   * @param destinationLng
   * @param destinationName 目的地的名称，
   * @param region  目的地所在区域
   */
  navigation ({currentLat, currentLng, destinationLat, destinationLng, destinationName, region}) {
    if (Native.isApp()) {
      Native.todoNative(this.className, this.methodName, {
        'toNavigationAtyStr': {
          'longitude': destinationLng,
          'latitude': destinationLat,
          'address': region,
          'name': destinationName
        }
      })
    } else {
      let url = this.getNavigationUrl(arguments[0])
      Util.openUrl(url)
    }
  }
}
export default new NavigationService()

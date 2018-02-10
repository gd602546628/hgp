/**
 * Created by lqj on 2017/8/15
 */
class Distance {
  constructor () {
    this.distance = -1
  }

  /**
   * 返回两点之间的距离
   * @param startLatStr
   * @param endLatStr
   * @param startLngStr
   * @param endLngStr
   * @returns {number} 两点间离 km，如果想要米的话，结果*1000就可以了，如果返回-1则获取失败
   */
  distanceFn (startLatStr, endLatStr, startLngStr, endLngStr) {
    try {
      let lat1 = (Math.PI / 180) * parseFloat(startLatStr)
      let lat2 = (Math.PI / 180) * parseFloat(endLatStr)

      let lon1 = (Math.PI / 180) * parseFloat(startLngStr)
      let lon2 = (Math.PI / 180) * parseFloat(endLngStr)
      // 地球半径
      let R = 6371
      let d = Math.acos(Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1)) * R
      return d
    } catch (e) {
      return -1
    }
  }
}
export default new Distance()

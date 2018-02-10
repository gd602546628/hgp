/**
 * Created by gd on 2017/6/13/013.
 */
import native from '@/service/common/native/native.service'
import LocalStorageService from '@/service/common/localStorage/localStorage.service'
import {Indicator} from 'mint-ui'

class Location {
  constructor() {
    this.locationInfo = native.isApp() ? null : (LocalStorageService.getStorage('selectCity') || null)
    this.lastLocationInfo = this.locationInfo
    this.defaultCity = {
      province: '云南省',
      city: '玉溪市',
      country: null
    }
  }

  setLocationInfo(location) {
    this.locationInfo = location
    LocalStorageService.setStorage('selectCity', this.locationInfo)
  }

  _locationFromBaiDu({resolve, reject}) {
    if (window.navigator && window.navigator.geolocation) {
      let geolocation = new window.BMap.Geolocation()
      // let that = this
      geolocation.getCurrentPosition(function (r) {
        if (this.getStatus() !== window.BMAP_STATUS_SUCCESS) {
          if (reject) {
            reject('定位失败')
          }
        } else {
          console.info(2222, r)
          let result = {}
          result.city = r.address.city
          result.country = null
          result.county = r.address.district
          result.province = r.address.province
          result.street = r.address.street
          result.latitude = r.latitude
          result.longitude = r.longitude
          // that.setLocationInfo(result)
          if (resolve) {
            resolve(result)
          }
        }
      })
    } else {
      reject(null)
    }
  }

  _locationFromApp({resolve, reject}) {
    native.todoNative('common_native', 'getAppLocation', {realTime: '0'})
      .then(data => {
        let result = {}
        result.country = null
        result.county = data.county
        result.city = data.city
        result.longitude = data.longitude
        result.street = data.street
        result.latitude = data.latitude
        result.province = data.province
        // this.setLocationInfo(result)
        if (resolve) {
          resolve(result)
        }
      })
      .catch(() => {
        if (reject) {
          reject('调用原生定位失败')
        }
      })
  }

  _getLocationByH5(replace) {
    return new Promise((resolve, reject) => {
      this._locationFromBaiDu({resolve, reject})
    })
  }

  _getLocationByApp() {
    return new Promise((resolve, reject) => {
      this._locationFromApp({resolve, reject})
    })
  }

  async getLocation(replace) {
    let position = null
    if (native.isApp()) {
      position = await this._getLocationByApp().catch(e => {
        throw String('定位失败')
      })
    } else {
      position = await this._getLocationByH5().catch(e => {
        throw String('定位失败')
      })
    }
    if (position) {
      this.lastLocationInfo = position
    }
    if (position && replace) {
      this.setLocationInfo(position)
    }
    return position
  }

  async getOldLocation() {
    if (this.locationInfo) {
      return this.locationInfo
    }
    let openLoading = () => {
      Indicator.open({
        text: '正在定位...',
        spinnerType: 'fading-circle'
      })
    }
    let closeLoading = () => {
      Indicator.close()
      let indicator = document.getElementsByClassName('mint-indicator')
      if (indicator.length) {
        for (let i = 0; i < indicator.length; i++) {
          if (indicator[i].remove) {
            indicator[i].remove()
          }
        }
      }
    }
    openLoading()
    this.locationInfo = await this.getLocation(true).catch(e => {
      this.setLocationInfo(this.defaultCity)
      closeLoading()
      return this.defaultCity
    })
    closeLoading()
    this.setLocationInfo(this.locationInfo)
    return this.locationInfo
  }

  getLastLocationInfo() {
    return this.lastLocationInfo
  }
}

export default new Location()

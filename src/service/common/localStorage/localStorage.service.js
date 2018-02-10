/**
 * Created by gd on 2017/6/13/013.
 */
class LocalStorageUtil {
  storage = {}

  setStorage(key, value) {
    let data = this.storage
    if (localStorage) {
      data = localStorage
    }
    if (typeof value === 'string') {
      data[key] = value
    } else {
      data[key] = JSON.stringify(value)
    }
  }

  getStorage(key) {
    try {
      let data = this.storage
      if (localStorage) {
        data = localStorage
      }
      return JSON.parse(data[key])
    } catch (e) {
      return null
    }
  }

  setMemory(key, value) {
    let data = this.storage
    if (typeof value === 'string') {
      data[key] = value
    } else {
      data[key] = JSON.stringify(value)
    }
  }

  getMemory(key) {
    try {
      let data = this.storage
      return JSON.parse(data[key])
    } catch (e) {
      return null
    }
  }

  removeMemory(key) {
    delete this.storage[key]
  }

  remove(key) {
    let data = this.storage
    if (localStorage) {
      data = localStorage
    }
    delete data[key]
  }
}

export default new LocalStorageUtil()

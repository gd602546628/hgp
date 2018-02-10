/**
 * Created by gd on 2017/7/17/017.
 */
class Deffer {
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this._resolve = resolve
      this._reject = reject
    })
  }

  resolve() {
    this._resolve.call(this.promise, ...arguments)
  }

  reject() {
    this._reject.call(this.promise, ...arguments)
  }
}
export default Deffer

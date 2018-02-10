<template>
  <button :disabled="disabledBtn" @click="click">{{getText}}</button>
</template>
<script>

  import localStorage from '@/service/common/localStorage/localStorage.service'
  export default{
    props: {
      clickCallback: {
        type: Function
      },
      storageKey: {
        type: String,
        default: ''
      },
      text: {
        type: String,
        default: ''
      },
      second: {
        default: 60
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    data(){
      return {
        time: this.getCountTime()
      }
    },
    computed: {
      getText(){
        if (this.time <= 0) {
          return this.text
        }
        return `${this.time}s`
      },
      disabledBtn(){
        return this.time > 0 || this.disabled
      }
    },
    methods: {
      getCountTime () {
        if (this.storageKey) {
          let historyTime = localStorage.getStorage(this.storageKey) || 0
          let time = new Date().getTime() - historyTime
          time = parseInt(time / 1000)
          return time >= 0 && time <= this.second ? this.second - time : 0
        }
        return 0
      },
      setCountdown(value){
        if (this.storageKey) {
          localStorage.setStorage(this.storageKey, value || new Date().getTime())
        }
        this.time = this.getCountTime()
      },
      countdown(){
        let intervalHandler = setInterval(() => {
          if (this.time <= 0 && intervalHandler) {
            clearInterval(intervalHandler)
          }
          this.time = this.time - 1
        }, 1000)
      },
      click(){
        if (this.time > 0) {
          return
        }
        this.time = this.second
        this.setCountdown()
        this.countdown()
        this.$emit('click')
      }
    },
    mounted(){
      if (this.time > 0) {
        this.countdown()
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
</style>

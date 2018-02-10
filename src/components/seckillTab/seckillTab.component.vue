<template>
  <div class="seckill-tab">
    <div class="tab-item" :class="{active:selectSession==0}" @click="tabClick(0)">
      <p>08:00</p>
      <p v-if="currentSession==0">{{secondFormat(countDownObj.morning)}}</p>
      <p v-if="currentSession<0">即将开抢</p>
      <p v-if="currentSession>0">已开抢</p>
    </div>
    <div class="tab-item" :class="{active:selectSession==1}" @click="tabClick(1)">
      <p>12:00</p>
      <p v-if="currentSession==1">{{secondFormat(countDownObj.noon)}}</p>
      <p v-if="currentSession<1">即将开抢</p>
      <p v-if="currentSession>1">已开抢</p>
    </div>
    <div class="tab-item" :class="{active:selectSession==2}" @click="tabClick(2)">
      <p>16:00</p>
      <p v-if="currentSession==2">{{secondFormat(countDownObj.afternoon)}}</p>
      <p v-if="currentSession<2">即将开抢</p>
      <p v-if="currentSession>2">已开抢</p>
    </div>
    <div class="tab-item" :class="{active:selectSession==3}" @click="tabClick(3)">
      <p>20:00</p>
      <p v-if="currentSession==3">{{secondFormat(countDownObj.midnight)}}</p>
      <p v-if="currentSession<3">即将开抢</p>
      <p v-if="currentSession>3">已开抢</p>
    </div>
  </div>
</template>
<script>
  import seckillService from '@/service/seckill/seckill.service'
  export default{
    created(){
      this.countDown()
    },
    data(){
      return {
        currentSession: 0, // 当前场次
        selectSession: 0, // 选中场次
        countDownObj: {
          morning: null,
          noon: null,
          afternoon: null,
          midnight: null
        }
      }
    },
    methods: {
      tabClick(session){
        this.selectSession = session
        this.$emit('getSession', {
          selectSession: this.selectSession,
          currentSession: this.currentSession
        })
      },
      secondFormat(curTime){
        let H = Math.floor(curTime / 60 / 60)
        let lM = Math.floor((curTime - H * 60 * 60) / 60)
        let lS = Math.floor(curTime % 60)
        H = H < 10 ? '0' + H : H
        lM = lM < 10 ? '0' + lM : lM
        lS = lS < 10 ? '0' + lS : lS
        let result = `${H}:${lM}:${lS}`
        return result
      },
      async countDown() { // 场次倒计时
        let play = await seckillService.getCurrentSession()
        this.currentSession = play.session
        this.tabClick(play.session === -1 ? 0 : play.session)
        let sessionMap = ['morning', 'noon', 'afternoon', 'midnight']
        let timmer = null
        timmer = setInterval(() => {
          if (play.difference === 0) {
            clearInterval(timmer)
            this.countDown()
          } else {
            play.difference--
            this.countDownObj[sessionMap[play.session]] = play.difference
          }
        }, 1000)
        return timmer
      }
    }
  }
</script>
<style lang='scss' rel='stylesheet/scss' scoped type="text/scss">
  .seckill-tab {
    display: flex;
    background: #0164a6;
    .tab-item {
      color: #90aece;
      padding: 6px 0;
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 15px;
      &.active {
        color: #ffffff;
        background: #0d7ac2;
      }
    }
  }
</style>

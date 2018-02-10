<template>
  <div class="wrap" :style="{backgroundImage:'url('+currentData.img+')'}">
    <div class="timerS" v-if="timerS">{{timerS}}s</div>
  </div>
</template>
<script>
  import voteService from '@/service/vote/vote.service'
  import img458 from '@/assets/img/vote/转盘A.jpg'
  import img459 from '@/assets/img/vote/转盘B.jpg'
  import img465 from '@/assets/img/vote/转盘C.jpg'
  export default{
    data(){
      return {
        timerS: 0,
        timer: null,
        data: [
          {
            returnUrl: 'http://m.jointem.com/applstore/#/1885/drawActivity/slotMachines/458',
            img: img458
          },
          {
            returnUrl: 'http://m.jointem.com/applstore/#/1885/drawActivity/roundabout/459',
            img: img459
          },
          {
            returnUrl: 'http://m.jointem.com/applstore/#/1885/drawActivity/slotMachines/465',
            img: img465
          }
        ],
        currentData: {}
      }
    },
    async created(){
      let data = this.currentData = this.data[Math.floor(Math.random() * this.data.length)]
      this.timerS = 2
      this.timer = setInterval(() => {
        this.timerS--
        if (this.timerS <= 0) {
          clearInterval(this.timer)
          window.location.replace(data.returnUrl)
        }
      }, 1000)
    },
    methods: {
      async getVoteInfo(){
        let data = voteService.getVoteInfo({
          voteId: this.$route.params.voteId
        })
        return data
      }
    },
    deactivated(){
      clearInterval(this.timer)
      this.timerS = 0
      console.log('clear')
    },
    destroyed(){
      clearInterval(this.timer)
      this.timerS = 0
      console.log('clear')
    }
  }
</script>
<style lang='scss' rel='stylesheet/scss' scoped>
  .wrap {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    // background: url("../../assets/img/vote/success.jpg");
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    .timerS {
      position: absolute;
      top: 10px;
      left: 10px;
      width: 70px;
      height: 30px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      color: #ffffff;
    }
  }
</style>

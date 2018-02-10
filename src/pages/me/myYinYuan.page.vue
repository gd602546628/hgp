<template>
  <zyt-page>
    <div slot="main">
      <div class="myWinYuan" :style="heightFn">
        <div class="myWinYuan-title">
          <div class="item-image">
            <img src="../../assets/img/me/yingyuan.png">
            <p>
              <span>{{mySnatchWinYuan}}</span>
              <span> 赢元 </span>
            </p>
          </div>
        </div>
        <div class="myWinYuan-content">
          <p>赢元后期可用于商品购买、活动参与等等用途，若有疑问请联系客服人员。</p>
          <p class="myWinYuan-content-info">
            <span>联系电话 : </span>
            <span>400-159-1615</span>
          </p>
        </div>
      </div>
    </div>
  </zyt-page>
</template>

<script>
  import meService from '../../service/me/me.service'
  export default {
    name: 'myYinYuan',
    data () {
      return {
        mySnatchWinYuan: null
      }
    },
    computed: {
      heightFn(){
        return {'height': window.screen.height + 'px'}
      }
    },
    created(){
      this.init()
    },
    methods: {
      init(){
        this.getUserWinyuan()
      },
      async getUserWinyuan(){ // 我的赢元
        let data = await meService.getUserWinyuan({}).catch(() => {
          throw new Error('获取我的赢元失败')
        })
        if (data == null) {
          this.mySnatchWinYuan = 0
        } else {
          this.mySnatchWinYuan = data
        }
        console.log(data, this.mySnatchWinYuan)
      }
    },
    components: {}
  }
</script>

<style lang='scss' rel='stylesheet/scss' scoped type="text/scss">
  .myWinYuan {
    background-color: #f0f2f5;
    .myWinYuan-title{
      .item-image{
        background-color: white;
        border-bottom: solid 1px #dddddd;
        img{
          width: 100%;
          vertical-align: middle;
        }
        p{
          text-align: center;
          margin-bottom: 20px;
          span:first-child {
            font-size: 24px;
            font-weight: bold;
            color: #ff3c3c;
          }
          span:last-child {
            font-size: 16px;
            color: #ff3c3c;
          }
        }
      }
    }
    .myWinYuan-content{
      padding: 16px;
      background-color: white;
      p{
        font-size: 12px;
      }
      .myWinYuan-content-info{
        span:first-child {
          font-size: 12px;
          color: #2d2d2d;
        }
        span:last-child {
          color: #666666;
          font-size: 16px;
          font-weight: bold;
          vertical-align: middle;
          margin-left: 5px;
        }
      }
    }
  }
</style>

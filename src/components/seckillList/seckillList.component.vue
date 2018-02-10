<template>
  <div class="seckill-list">
    <ul class="seckill-list-ul">
      <li v-for="item in seckillList" class="seckill-list-li" @click.prevent="goToPrdInfo(item)">
        <div class="prdImg" :style="{backgroundImage:'url('+imgPreFix+item.prdImg+')'}"></div>
        <div class="prdContent">
          <div class="name">{{item.name}}</div>
          <div class="bottom">
            <div class="price">
              <span class="price1">¥{{item.activityPrice}}</span>
              <span class="price2" v-if="item.activityPrice!==item.price">¥{{item.price}}</span>
            </div>
            <div class="button" v-if="item.session<=currentSession&&item.tempStock>0" @click.stop="goToPrdInfo(item)">马上抢</div>
            <div class="button" v-if="item.tempStock<=0" @click.stop="goToPrdInfo(item)">已抢光</div>
            <img v-if="item.session>currentSession" class="img" src="../../assets/img/jqqd1.png">
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
  import {Config} from '@/config/config'
  export default{
    data(){
      return {
        imgPreFix: Config.imgPrefix
      }
    },
    props: ['seckillList', 'currentSession'],
    methods: {
      goToPrdInfo(item){
        this.$router.push({name: 'productInfo', params: {doorId: item.doorId, prdId: item.prdId}})
      }
    }
  }
</script>
<style lang='scss' rel='stylesheet/scss' scoped type="text/scss">
  .seckill-list {
    .seckill-list-ul {
      .seckill-list-li {
        padding: 10px;
        display: flex;
        border-bottom: solid #efefef 1px;
        .prdImg {
          width: 100px;
          height: 100px;
          background-size: cover;
          background-position: center;
        }
        .prdContent {
          margin-left: 10px;
          flex: 1;
          display: flex;
          flex-direction: column;
          .name {
            flex: 1;
          }
          .bottom {
            display: flex;
            .img {
              width: 50px;
              height: 50px;
            }
            .button {
              border: none;
              background: #ff3c3c;
              border-radius: 2px;
              width: 80px;
              padding: 3px 0px;
              text-align: center;
              color: #fff;
              right: 10px;
            }
            .price {
              flex: 1;
              display: flex;
              align-items: center;
              .price1 {
                font-size: 18px;
                color: #0164a6;
                font-weight: bold;
              }
              .price2 {
                font-size: 12px;
                text-decoration: line-through;
                margin-left: 4px;
                color: #AAAAAA;
              }
            }
          }
        }
      }
    }
  }
</style>

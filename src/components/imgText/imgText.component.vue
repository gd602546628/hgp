<template>
  <div class="imgText">
    <ul>
      <li v-for="item in imgList" @click="goToSecond(item)" :style="widthFn(liWidth)">
        <img v-if="item.imgUrl" :src=isImgUrl?(imgPre+item.imgUrl):item.imgUrl :style="widthFn(imgWidth)">
        <img v-if="!item.imgUrl" src="../../assets/img/wutu.png" :style="widthFn(imgWidth)">
        <span>{{item.name}}</span>
      </li>
      <li v-if="hideAll" :style="widthFn(liWidth)">
        <img src="http://m.jointem.com/resource/serviceType/qb.png" :style="widthFn(imgWidth)">
        <span>全部</span>
      </li>
    </ul>
  </div>
</template>

<script>
  import {Config} from '@/config/config'
  export default{
    props: {
//      imgList: {},
//      每一项li的宽度（百分比）
      liWidth: {
        type: Number,
        default: 25
      },
//      图片的宽度（百分比）
      imgWidth: {
        type: Number,
        default: 50
      },
//      是否隐藏全部的图标（true为隐藏）
      hideAll: {
        type: Boolean,
        default: true
      },
//      是否需要imgURL拼接(默认为false不需要拼接)
      isImgUrl: {
        type: Boolean,
        default: false
      }

    },
    data(){
      return {
        imgPre: Config.imgUrl,
        imgList: [
          {
            imgUrl: 'http://m.jointem.com/resource/serviceType/qb.png',
            name: '领券中心',
            level: 999,
            id: 'lqzx1'
          },
          {
            imgUrl: 'http://m.jointem.com/resource/serviceType/qb.png',
            name: '吃喝玩乐',
            level: 999,
            id: 'chwl2'
          },
          {
            imgUrl: 'http://m.jointem.com/resource/serviceType/qb.png',
            name: '精选商品',
            level: 999,
            id: 'jxsp3'
          },
          {
            imgUrl: 'http://m.jointem.com/resource/serviceType/qb.png',
            name: '分类服务',
            level: 999,
            id: 'flfw4'
          }
        ]
      }
    },
    methods: {
      /**
       * widthFn(width):宽度属性
       * 参数：width：需要设置的宽度
       */
      widthFn(width){
        return {'width': width + '%'}
      },

      goToSecond(item){
//        if (item.level === 999) {
//          if (item.id === "lqzx1") {
//            this.navCtrl.push(GoodServicePage)
//          } else if (item.id == "chwl2") {
//            this.navCtrl.push(GoodServicePage)
//          } else if (item.id == "jxsp3") {
//            this.navCtrl.push(GoodServicePage)
//          } else if (item.id == "flfw4") {
//            this.navCtrl.push(GoodServicePage)
//          }
//        } else {
//          alert( "跳转好生活二级页面了" )
//          this.navCtrl.push(GoodServicePage,{
//           typeId:item.id
//           })
//        }
      }
    }
  }
</script>

<style lang='scss' rel='stylesheet/scss' scoped type="text/scss">
  .imgText {
    background: white;
    ul {
      display: flex;
      align-content: center;
      flex-wrap: wrap;
      padding: 0px 10px 10px 10px;
      width: 100%;
      li {
        list-style: none;
        text-align: center;
        margin-top: 10px;
        img {
          text-align: center;
          vertical-align: middle;
        }
        span {
          font-size: 12px;
          padding: 0 6px;
          display: block;
          margin-top: 4px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }
    }
  }
</style>

<template>
  <div>
    <div class="cgyitem pref-item" v-for="item in LocalServiceData" @click.prevent="goServiceDetailsInfo(item)">
      <img class="img-box" v-if="item.serviceTitleImgUrl" :src="item.serviceTitleImgUrl | imgPrefix">
      <img class="img-box" v-if="!item.serviceTitleImgUrl" src="../../assets/img/serviceCgy/mr.png">
      <div class="item-right pref-right" v-if="item.serviceTitle">
        <pre class="parse-html pref-H" v-html="item.serviceTitle"></pre>
        <span class="distance" v-if="item.distance">{{distance(item)}}</span>
        <p>{{ item.serviceDistrict + item.serviceDetailAddress }}</p>
      </div>
      <div class="viptel-box">
      <span class="vipimg-box">
        <!--<i class="icon-zyt-diamond"></i>-->
        <img src="../../assets/img/serviceCgy/VIp.png" alt="">
      </span>
        <span class="telimg-box" @click.stop="">
          <a :href="'tel:' + item.serviceTel">
             <i class="icon-zyt-phone"></i>
          </a>
      </span>
      </div>
    </div>
  </div>
</template>

<script>
  export default{
    props: ['LocalServiceData'],
    data(){
      return {}
    },
    methods: {
      /**
       * 服务详情跳转
       */
      goServiceDetailsInfo(item){
        this.$router.push({name: 'serviceDetail', params: {id: item.id}})
      },
      distance(coupon){
        let distance = coupon.distance
        let str = ''
        if (typeof distance === 'number') {
          if (distance < 1000) {
            return Math.floor(distance) + 'm'
          } else {
            let a = Math.floor(distance % 1000)
            a = a > 100 ? a : 0
            let result = Math.floor(distance / 1000) + '.' + str.substring.call(a, 0, 1) + 'km'
            return result
          }
        } else {
          return null
        }
      }
    },
    created(){
    }
  }
</script>

<style lang='scss' rel='stylesheet/scss' scoped type="text/scss">
  @import "../../assets/css/variables-primary";

  .cgyitem {
    position: relative;
    .item-right {
      p {
        padding-top: map_get($ComSpacing, 'spac8');
        margin-right: 84px;
        color: map_get($ComColors, 'gray-a');
        font-size: 14px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .pref-H {
        margin-bottom: 6px !important;
      }
      .distance {
        background: #f5f5f9;
        color: #88888d;
        font-size: 12px;
        border-radius: 8px;
        padding: 4px;
      }
    }
    .viptel-box {
      position: absolute;
      right: 0px;
      bottom: map_get($ComSpacing, 'spac14');
      .vipimg-box {
        display: inline-block;
        border-right: map_get($ComSpacing, 'spac1') solid map_get($ComColors, 'gray-ef');
        width: 30px;
        height: 22px;
        img {
          width: 22px;
        }
        i {
          color: #FCA210;
          font-size: 22px;
        }
      }
      .telimg-box {
        display: inline-block;
        padding: 0px 10px;
        img {
          width: 26px;
        }
        a{
          text-decoration: none;
          i {
            color: map_get($ComColors, 'wathet-blue');
            font-size: 26px;
          }
        }
      }
    }

  }

  .cgyinlet-item {
    border-top: map_get($ComSpacing, 'spac1') solid map_get($ComColors, 'gray-ef');
    background: map_get($ComColors, white);
    .itemtitle {
      display: flex;
      align-content: center;
      justify-content: space-between;
      padding: 13px 0px;
      border-bottom: map_get($ComSpacing, 'spac1') solid map_get($ComColors, 'gray-ef');
      margin: 0px 14px;
      .itemtitle-div1 {
        font-size: 12px;
        position: relative;
        padding-left: map_get($ComSpacing, 'spac10');
        div {
          position: absolute;
          left: 0px;
          top: 0px;
          width: 3px;
          height: 16px;
          background: map_get($ComColors, 'wathet-blue');
        }
      }
      .itemtitle-div2 {
        font-size: 11px;
        img {
          width: 15px;
          height: 15px;
          margin-left: map_get($ComSpacing, 'spac4');
          vertical-align: bottom;
        }
      }
    }
    .cgyinlet-ul-box {
      ul {
        display: flex;
        align-content: center;
        flex-wrap: wrap;
        padding: 4px 8px 14px 8px;
        width: 100%;
        li {
          list-style: none;
          width: 25%;
          text-align: center;
          margin-top: map_get($ComSpacing, 'spac10');
          img {
            width: 35%;
            text-align: center;
            vertical-align: middle;
          }
          span {
            font-size: 11px;
            padding: 0 6px;
            display: block;
            margin-top: map_get($ComSpacing, 'spac2');
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
        }
      }

    }
  }

  .pref-item {
    display: flex;
    align-items: center;
    height: 102px;
    background: map_get($ComColors, white);
    border-bottom: solid 1px map_get($ComColors, 'gray-ef');
    .img-box {
      display: inline-block;
      border-radius: 5px;
      width: 84px;
      height: 84px;
      line-height: 0px;
      margin: 0px 9px;
    }
    .pref-right {
      flex-grow: 1;
      width: calc(100% - 102px);
      .pref-H {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-weight: 600;
        margin: 0 0 2px 0;
      }
      .pref-distance-box {
        padding: 2px 0px 2px 0px;
        position: relative;
        .pref-adds {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          padding-right: 105px;
          font-size: 13px;
          color: map_get($ComColors, 'gray-a');
        }
        .pref-distance {
          position: absolute;
          right: 10px;
          top: 1px;
          display: inline-block;
          height: map_get($ComHeight, 'height20');
          line-height: map_get($ComHeight, 'height20');
          padding: 0px 8px !important;
          border-radius: 10px;
          background-color: map_get($ComColors, 'gray-ef');
          color: map_get($ComColors, 'gray-8d');
        }
      }
      .pref-maxDisc-box {
        font-size: 13px;
        strong {
          color: map_get($ComColors, red);
          padding: 0px 2px;
          font-weight: 500;
        }
      }
    }
  }
</style>

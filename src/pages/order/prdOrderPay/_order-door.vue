/**
* Created by guooug on 2017/6/16.
*/
<template lang="html">
  <div>
    <!--<p class="door-name"><i class="icon icon-zyt-store2"></i>{{order.doorInfo.name}}</p>-->
    <div class="space-between orderDetail-code">
      <p class="code">订单号：{{order.orderDetail.code}}</p>
      <p class="status">{{getOrderStatus(order)}}</p>
    </div>
    <div class="row" v-for="prd in order.prdInfos" @click="goToPrdInfo(order.orderDetail.doorId,prd.prdId)">
      <div class="col img-container">
        <img-component :img-src="prd.prdImg"></img-component>
      </div>
      <div class="col info-container">
        <p class="title">{{prd.prdName}}</p>
        <p class="smaller">{{prd.fpName}} {{prd.fpValue}} {{prd.spName}}{{prd.spValue}}</p>
        <div class="space-between smaller">
          <p>X{{prd.num}}</p>
          <div v-if="prd.num>1">
            <!-- ￥{{prd.unitPrice}} * {{prd.num}} =-->
            <price-component :price="(prd.totalPrice-prd.discountPrice)" class="price-container"></price-component>
          </div>
          <price-component v-else :price="(prd.totalPrice-prd.discountPrice)" class="price-container"></price-component>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import ImgComponent from '@/components/common/img/img.component'
  import PriceComponent from '@/components/common/price/price.component'
  //  这是一个过渡界面，所有的参数都由前一个界面提供，如果获取不到数据（用户刷新，则退回到上一个界面）
  export default {
    props: {
      order: {
        type: Object
      }
    },
    computed: {},
    methods: {
      getOrderStatus(order){
        if (order.orderDetail.status) {
          return '已支付'
        } else {
          return '等待付款'
        }
      },
      goToPrdInfo(doorId, prdId){
        this.$router.push({
          name: 'productInfo',
          params: {
            doorId: doorId,
            prdId: prdId
          }
        })
      }
    },
    components: {
      'img-component': ImgComponent,
      'price-component': PriceComponent
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" type="text/scss" scoped>
  @import "../../../assets/css/variables-primary";

  .row {
    background-color: map_get($ComColors, gray-ef);
    padding: 5px 10px;
    border-bottom: 1px solid map_get($ComBorderColor, dd);
    &:last-child {
      border-bottom: 0px solid map_get($ComBorderColor, dd);
    }
    .img-container {
      width: 70px;
      max-width: 70px;
    }
    .info-container {
      padding-left: 10px;
      .title {
        font-size: 14px;
      }
      .smaller {
        font-size: small;
      }
      .space-between {
        padding-top: 5px;
      }
    }
    .price-container {
      font-size: 16px;
      color: map_get($ComColors, wathet-blue);
    }
  }

  .door-name {
    padding: 5px 10px;
    display: flex;
    align-items: center;
    font-size: 16px;
    border-bottom: 1px solid map_get($ComBorderColor, dd);
    .icon {
      font-size: 24px;
      margin-right: 10px;
    }
  }

  .user-coupon {
    padding: 10px;
    .icon {
      margin-left: 10px;
    }
    .tip {
      color: map_get($ComColors, wathet-blue);
    }
  }

  .orderDetail-code {
    font-size: 12px;
    padding: 10px 10px;
    .status {
      color: map_get($ComColors, wathet-blue);
    }
  }
</style>

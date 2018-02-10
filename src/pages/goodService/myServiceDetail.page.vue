<template>
  <zyt-page>
    <div class="my-service-detail" slot="main" v-show="show">
      <div class="content">
        <div class="document" v-for="(item,index) in document" :class="{'double':index%2==0}">
          <div class="title">{{index + 1}}、{{item.title}}</div>
          <!--文本-->
          <div class="text same" v-if="item.addType==1">{{noDataShow(item.answer)}}</div>

          <!--文本域-->
          <div class="text-area same" v-if="item.addType==2">{{noDataShow(item.answer)}}</div>

          <!--数字-->
          <div class="number same" v-if="item.addType==3">{{noDataShow(item.answer)}}</div>

          <!--日期-->
          <div class="date same" v-if="item.addType==4">{{noDataShow(item.answer)}}</div>

          <!--单选-->
          <div class="check same" v-if="item.addType==5">{{noDataShow(item.answer)}}</div>

          <!--多选-->
          <div class="radio same" v-if="item.addType==6">
            <span v-for=" answer in item.answer">{{noDataShow(answer)}}</span>
          </div>

          <!--说明-->
          <div class="info same" v-if="item.addType==8">{{noDataShow(item.title)}}</div>

          <!--地址-->
          <div class="address same" v-if="item.addType==9">{{noDataShow(item.answer)}}</div>

          <!--附件-->
          <div class="file same" v-if="item.addType==10">
            <p v-if="item.answer">{{item.answer[1]}}</p>
            <p v-if="item.answer===''||item.answer===null">用户未上传</p>
            <div class="down-load" v-if="item.answer">
              <p @click="download(item.answer)">下载</p>
            </div>
          </div>
        </div>
        <div class="reply">
          <div class="top">
            <p class="title">商家回复</p>
            <p class="color-red" v-if="orderInfo.applyStatus==0">待审核</p>
            <p class="color-yellow" v-if="orderInfo.applyStatus==1">已拒绝</p>
          </div>
          <p class="reply-info" v-if="orderInfo.reply">{{orderInfo.reply}}</p>
          <div class="no-reply" v-if="!orderInfo.reply">暂无商家回复信息!</div>
        </div>
      </div>
      <div class="foot-btn" v-if="orderInfo.applyStatus==0||orderInfo.applyStatus==2">
        <p v-if="orderInfo.applyStatus==0" @click="cancelApply()">取消预约</p>
        <p v-if="orderInfo.applyStatus==2" @click="payApply()">支付完成预约</p>
      </div>
    </div>
  </zyt-page>
</template>
<script>
  import goodService from '@/service/goodService/goodService.service'
  import Util from '@/service/common/utils/util.service'
  import OrderService from '@/service/order/order.service'
  export default{
    name: 'myServiceDetail',
    data(){
      return {
        show: false,
        orderInfo: {},
        document: []
      }
    },
    created(){
      this.init()
    },
    methods: {
      async init(){
        let data = await goodService.getMyServiceDetail({id: this.$route.params.id})
        this.show = true
        this.document = data.document
        this.orderInfo = data.serviceOrderInfo
      },
      download(answer){
        window.location.href = answer[0]
      },
      noDataShow(item){ // 无数据时的显示
        if (item){
          return item
        } else {
          return '用户未填写'
        }
      },
      async cancelApply(){
        console.log(this.orderInfo)
        await Util.confirm('您确定要取消预约吗?')
        await goodService.cancelApply({serviceOrderId: parseInt(this.orderInfo.id)})
        await Util.alert('取消预约成功')
        this.$router.go(-1)
      },
      payApply(){
        OrderService.goToServersPayPage(this.orderInfo.id, this.orderInfo, this.$router)
      }
    }
  }
</script>
<style lang='scss' rel='stylesheet/scss' scoped type="text/scss">
  @import '../../assets/css/variables-primary.scss';

  .my-service-detail {
    background-color: #F0F2F5;

    .content {
      margin-bottom: 35px;

      .document {
        padding: 16px;
        font-size: 16px;
        border-bottom: 1px solid #dddddd;

        &.double {
          background-color: #ffffff
        }

        .same {
          padding-left: 25px;
          margin-top: 10px;
        }

        .radio {

          span {
            margin-right: 10px;
          }

        }
        .file {

          .down-load {
            display: flex;
            justify-content: flex-end;

            p {
              width: 90px;
              height: 30px;
              color: #ff3c3c;
              background-color: white;
              border: 1px solid #ff3c3c;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 6px;
            }

          }
        }
      }

      .reply {
        margin-top: 10px;
        background: #ffffff;
        padding: 16px;

        .color-yellow {
          color: #ffc001
        }

        .color-red {
          color: #ff3c3c
        }

        .top {
          display: flex;
          font-size: 16px;

          .title {
            flex: 1;
          }

        }
        .reply-info {
          margin-top: 10px;
          font-size: 16px;
        }

        .no-reply {
          font-size: 14px;
          margin-top: 20px;
          text-align: center;
        }

      }
    }

    .foot-btn {
      position: fixed;
      bottom: 0;
      width: 100%;
      height: 49px;
      line-height: 49px;
      background-color: map_get($ComColors, wathet-blue);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 400;
    }

  }
</style>

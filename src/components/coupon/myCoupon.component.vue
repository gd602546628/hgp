<template>
  <div>
    <div class="couponDiv" v-if="coupon" v-for="(coupon, index) in couponList" :class="{edit:edit}">
      <span class="checkbox mint-checkbox coupon-check-box" @click.stop="couponCheck(coupon)">
                <input type="checkbox" class="mint-checkbox-input"
                       v-model="coupon.checked"
                       :checked="coupon.checked"
                >
                <span class="mint-checkbox-core"></span>
              </span>
      <mt-cell-swipe v-if="coupon"
                     :key="coupon.couponId"
                     class="coupon-swipe"
                     :right="rightDel(coupon)"
      >
        <div class="coupon-wrap"
             @touchstart="longPressStart($event)"
             @touchmove="longPressMove($event)"
             @touchend="longPressEnd($event)"
        >
          <div class="coupon-item" :class="{isOffLine:coupon.couponType==1}" @click.prevent="goDetail(coupon)">
            <div class="topic-img" :style="{backgroundImage:'url('+topicImg(coupon)+')'}"></div>
            <div class="item-content">
              <div class="item-content-door">
                <div class="name" v-html="coupon.doorName"></div>
              </div>
              <p class="price1">
                <span v-if="coupon.category==0"> 满{{coupon.money}}元可用</span>
                <span v-if="coupon.category==1">无门槛使用</span>
              </p>
              <div class="mail-type">有限期至：<span>{{dateReplace(coupon.endTime)}}</span></div>
            </div>
            <div class="item-button"
                 :class="{btnDisable:tabNum!==0}"
                 v-if="coupon.couponType==0"
                 @click.stop="goDoor(coupon)">
              <div class="button-wrap">
                <p class="number"><span>¥</span>{{coupon.discountMoney}}</p>
                <p>去使用</p>
              </div>
            </div>
            <div class="item-button"
                 :class="{btnDisable:tabNum!==0}"
                 v-if="coupon.couponType==1"
                 @click.stop="goCouponDetail(coupon)">
              <div class="button-wrap">
                <p class="number"><span>¥</span>{{coupon.discountMoney}}</p>
                <p>查看券码</p>
              </div>
            </div>
          </div>
        </div>
      </mt-cell-swipe>
    </div>
    <mt-popup v-model="edit" position="bottom" :closeOnClickModal="false" :modal="false" class="pop-btn-wrap">
      <div class="btn-cancel" @click="editCancel">取消</div>
      <div class="btn-delete" @click="editDelete">删除</div>
    </mt-popup>
  </div>

</template>
<script>
  import {Config} from '@/config/config'
  import couponService from '@/service/coupon/coupon.service'
  import Util from '@/service/common/utils/util.service'
  import {MessageBox} from 'mint-ui'
  export default{
    props: ['couponList', 'tabNum'],
    data(){
      return {
        longPressTimeOut: null,
        longPressFlag: false,
        edit: false
      }
    },
    created(){
    },
    computed: {},
    methods: {
      topicImg(coupon){ // 图片添加前缀
        if (!coupon.topicImg) {
          return null
        }
        if (coupon.topicImg.indexOf('http') >= 0) {
          return coupon.topicImg
        } else {
          return Config.imgPrefix + coupon.topicImg
        }
      },
      goDoor(item){ // 跳转店铺首页
        if (parseInt(this.tabNum) !== 0) {
          return
        }
        this.$router.push({
          name: 'indexDoor',
          params: {
            index: 0,
            doorId: item.doorId
          }
        })
      },
      goDetail(item){ // 跳转优惠券详情
        this.$router.push({
          name: 'wxCouponCenterDesc',
          params: {
            couponId: item.couponId || item.id,
            userCouponId: item.userCouponId,
            num: 0
          }
        })
      },
      async  goCouponDetail(item){ // 跳转券码页
        if (parseInt(this.tabNum) !== 0) {
          return
        }
        // let data = await couponService.getUserCouponId({couponId: item.couponId})
        this.$router.push({
          name: 'wxCouponCenterDetail',
          params: {
            userCouponId: item.userCouponId,
            couponId: item.couponId
          }
        })
      },
      rightDel(item){
        return [
          {
            content: '删除',
            style: {
              background: 'red',
              color: '#fff',
              display: 'flex',
              'align-items': 'center',
              '-webkit-align-items': 'center',
              'justify-content': 'center',
              '-webkit-justify-content': 'center',
              width: '80px'
            },
            handler: () => {
              Util.confirm('确定删除吗？', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                showCancelButton: true
              }).then(() => {
                this.delBtn(item)
              }).catch(() => {
              })
            }
          }]
      },
      delBtn(item){
        let removeCouponList = []
        let ids = []
        removeCouponList.push(item)
        ids.push(item.userCouponId)
        let idss = ids.join()
        couponService.deleteCoupon({
          userCouponId: idss
        }).then(data => {
          this.couponList = this.couponList.filter((prd) => {
            return removeCouponList.indexOf(prd) === -1
          })
          if (this.couponList.length < 1) {
            this.noData = true
          }
        })
      },
      dateReplace(val){ // 将-时间替换为/时间
        if (val) {
          var dataTime = val.replace(/-/g, '/')
          val = dataTime.substring(0, 10)
          try {
            return new Date(val).replace()
          } catch (e) {
            return val
          }
        }
      },
      couponCheck(coupon){
        coupon.checked = !coupon.checked
      },
      longPressStart(e){
        if (this.edit) {
          e.stopPropagation()
          return
        }
        this.longPressTimeOut = setTimeout(() => {
          this.longPressFlag = true
          this.edit = true
        }, 700)
      },
      longPressMove(e){
        if (this.edit) {
          e.stopPropagation()
          return
        }
        clearTimeout(this.longPressTimeOut)
      },
      longPressEnd(e){
        if (this.edit) {
          e.stopPropagation()
          return
        }
        if (this.longPressTimeOut) {
          clearTimeout(this.longPressTimeOut)
        }
      },
      editCancel(){
        this.edit = false
      },
      async delCouponByIds(idArr){
        let ids = idArr.join(',')
        await couponService.deleteCoupon({userCouponId: ids})
        this.couponList = this.couponList.filter((item) => {
          return idArr.indexOf(item.userCouponId) === -1
        })
        return
      },
      editDelete(){
        let result = []
        this.couponList.forEach(item => {
          if (item.checked) {
            result.push(item.userCouponId)
          }
        })
        if (result.length === 0) {
          MessageBox.alert('请先选择要删除的数据')
        } else {
          MessageBox.confirm('确定删除吗').then(() => {
            this.delCouponByIds(result).then(() => {
              this.edit = false
            })
          })
        }
      }
    },
    deactivated(){
      this.editCancel()
    }
  }
</script>
<style lang='scss' rel='stylesheet/scss' type="text/scss">
  .couponDiv {
    position: relative;
    transition: all 0.3s ease;
    &.edit {
      transform: translateX(20px);
    }
    .coupon-check-box {
      position: absolute;
      top: 50%;
      margin-top: -10px;
      left: -20px;
      z-index: 100;
    }
    .coupon-swipe {
      background: none !important;
      .mint-cell-right {
        padding: 4px 0px;
      }
      .mint-cell-wrapper {
        margin: 0;
        padding: 0;
        background: none;
        border: none;
      }
      .mint-cell-title {
        display: none;
      }
      .mint-cell-value {
        width: 100%;
      }
      .coupon-wrap {
        width: 100%;
        height: 100px;
        background-image: url("../../assets/img/coupon/q_bg.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
        margin: 4px 0px 4px 0px;
        .coupon-item {
          display: flex;
          align-items: center;
          padding: 8px 8px;
          box-sizing: border-box;
          position: relative;
          .topic-img {
            width: 66px;
            height: 66px;
            text-align: center;
            overflow: hidden;
            background-size: 100% 100%;
            background-position: center;
            background-repeat: no-repeat;
            border-radius: 5px;
            margin-left: 2px;
          }
          .item-content {
            flex: 1;
            margin-left: 10px;
            margin-right: 15px;
            position: relative;
            overflow: hidden;
            .price1 {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              margin-bottom: 0;
              padding: 0;
              margin-top: 4px;
              width: 90%;
              color: white;
              font-size: 14px;
              margin: 1px 0px 4px 0px;
              span {
                font-size: 14px;
              }
            }
            .item-content-door {
              margin-bottom: 4px;
              padding: 0;
              display: flex;
              .name {
                color: white;
                height: 20px;
                line-height: 20px;
                font-size: 15px;
                font-weight: bold;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                flex: 1;
              }
              .distance {
                margin: 0 10px 0 10px;
                height: 20px;
                line-height: 20px;
                padding: 0px 8px;
                border-radius: 10px;
                background-color: #efefef;
                color: #88888d;
                font-size: 14px;
              }
            }
            .content-sc {
              margin-right: 80px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              font-size: 12px;
            }
            .mail-type {
              font-size: 12px;
              color: white;
              display: inline-block;
              width: 100%;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
          .item-button {
            width: 29%;
            position: relative;
            right: 0px;
            height: 85px;
            z-index: 2;
            color: #f8311e;
            .button-wrap {
              height: 100%;
              position: relative;
              padding-top: 20px;
              z-index: 1;
              p {
                text-align: center;
                font-size: 14px;
              }
              .number {
                text-align: center;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-size: 20px;
                font-weight: bold;
                position: relative;
                z-index: 1;
                margin-bottom: 5px;
                span {
                  font-size: 14px;
                  font-weight: bold;
                  margin-right: 2px;
                }
              }
              .receive {
                background-color: #fbec4f !important;
              }
              i {
                font-style: normal;
                text-align: center;
                display: inline-block;
                position: absolute;
                left: 50%;
                margin-left: -35px;
                height: 24px;
                width: 70px;
                font-size: 12px;
                border-radius: 20px;
                border-width: 2.5px !important;
                background-color: #ffffff;
                color: #64b3f8;
                border: solid 2px #4a9ef3;
                &.isOffLine {
                  background-color: #ffffff;
                  color: #b9995a;
                  border: solid 2px #a38140;
                }
                &.offLineDone {
                  background-color: #a38140;
                  border: solid 2px #a38140;
                  color: #b9995a;
                }
                &.lineDone {
                  background-color: #4a9ef3;
                  border: solid 2px #4a9ef3;
                  color: #8bc7fc;
                }
              }
              .water-wrap {
                position: absolute;
                top: -10px;
                left: -10px;
                height: 50px;
                width: 50px;
                overflow: hidden;
                .has-receive, .receive-done {
                  color: #ffffff;
                  position: absolute;
                  top: -4px;
                  left: -4px;
                  font-size: 40px;
                  z-index: 0;
                  opacity: 0.3;
                }
              }

            }
          }
          .btnDisable {
            color: #fd9d7c;
          }
        }
      }
    }
  }

  .couponList-no-data {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 43%;
    left: 50%;
    z-index: 1;
    margin-left: -55px;
    img {
      height: 25px;
      width: 25px;
    }
    p {
      color: #4c3a51;
      font-size: 16px;
      font-weight: bold;
      float: left;
      margin-left: 5px;
    }
  }

  .pop-btn-wrap {
    z-index: 2017 !important;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    background: #0164a6;
    color: #ffffff;
    font-size: 16px;
    .btn-cancel {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #ffa902;
      height: 100%;
    }
    .btn-delete {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
    }
  }
</style>

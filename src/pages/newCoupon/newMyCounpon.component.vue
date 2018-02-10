<template>
  <div>
    <div v-for="(coupon,index) in couponList" @click="goDetail(coupon)" class="new-my-coupon" :class="{edit:edit}">
        <span class="checkbox mint-checkbox coupon-check-box" @click.stop="couponCheck(coupon)">
                <input type="checkbox" class="mint-checkbox-input"
                       v-model="coupon.checked"
                       :checked="coupon.checked"
                >
                <span class="mint-checkbox-core"></span>
              </span>
      <mt-cell-swipe v-if="coupon"
                     :key="coupon.id"
                     class="coupon-swipe"
                     :right="rightDel(index)"
      >
        <div class="coupon-wrap"
             @touchstart="longPressStart($event)"
             @touchmove="longPressMove($event)"
             @touchend="longPressEnd($event)"
        >
          <div class="coupon-item" :class="{isOffLine:coupon.couponType==1,isUsed:!canClick}">
            <div class="topic-img" :style="{backgroundImage:'url('+topicImg(coupon)+')'}"></div>
            <div class="item-content">
              <div class="item-content-door">
                <div class="name" v-html="coupon.doorName"></div>
                <div class="distance" v-if="coupon.distance">{{distance(coupon)}}</div>
              </div>
              <p class="price1" :class="{isOffLine:coupon.couponType==1}">
                <!--<span>{{coupon.discountMoney}}</span>-->
                <i v-if="coupon.category==0" :class="{isOffLine:coupon.couponType==1}"> 满{{coupon.money}}元可用</i>
                <i v-if="coupon.category==1" :class="{isOffLine:coupon.couponType==1}">无门槛使用</i>
              </p>
              <pre class="content-sc">有效期至：{{coupon.endTime.split(' ')[0]}}</pre>
            </div>
            <div class="item-button" @click.stop="goUse(coupon)">
              <div class="button-wrap">
                <p class="number"><span>¥</span>{{coupon.discountMoney}}</p>
                <i :class="{isOffLine:coupon.couponType==1}" v-if="coupon.couponType===1&&canClick"
                >查看券码</i>
                <i :class="{isOffLine:coupon.couponType==1}" v-if="coupon.couponType===0&&canClick"
                >去使用</i>
                <i :class="{isOffLine:coupon.couponType==1}" v-if="!canClick"
                >已失效</i>
              </div>
            </div>
          </div>
        </div>
      </mt-cell-swipe>
    </div>
    <mt-popup v-model="edit" position="bottom"
              :closeOnClickModal="false"
              :modal="false"
              class="pop-btn-wrap"
              :class="{notNative:!isNative}"
    >
      <div class="btn-cancel" @click="editCancel()">取消</div>
      <div class="btn-delete" @click="editDelete">删除</div>
    </mt-popup>
  </div>
</template>
<script>
  /* eslint-disable*/
  import {Config, Codes} from '@/config/config'
  import couponService from '@/service/coupon/coupon.service'
  import {mapGetters} from 'vuex'
  import {MessageBox} from 'mint-ui'
  import Util from '@/service/common/utils/util.service'
  import native from '@/service/common/native/native.service'
  export default{
    props: ['couponList', 'isDistance', 'canClick'],
    data(){
      return {
        edit: false,
        checkList: []
      }
    },
    computed: {
      ...mapGetters(['userInfo']),
      isNative(){
        return native.isApp()
      }
    },
    methods: {
      rightDel(index){
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
                this.deleteCoupon(index)
              }).catch(() => {
              })
            }
          }]
      },
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
      distance(coupon){
        if (this.isDistance) {
          return coupon.distance
        }
        let distance = coupon.distance
        let str = ''
        if (typeof distance === 'number') {
          if (distance < 1000) {
            return Math.floor(distance) + 'm'
          } else {
            let result = Math.floor(distance / 1000) + '.' + str.substring.call(Math.floor(distance % 1000), 0, 1) + 'km'
            return result
          }
        } else {
          return null
        }
      },
      goDetail(item){
        if (this.longPressFlag) return
        this.$router.push({
          name: 'wxCouponCenterDesc',
          params: {
            couponId: item.couponId,
            userCouponId: item.userCouponId,
            num: 0
          }
        })
      },
      goUse(item){
        if (this.longPressFlag) return
        if (!this.canClick) return
        if (item.couponType === 0) { //线上
          this.$router.push({
            name: 'indexDoor',
            params: {
              index: 0,
              doorId: item.doorId
            }
          })
        } else { //线下
          this.$router.push(
            {
              name: 'wxCouponCenterDetail',
              params: {
                couponId: item.couponId,
                userCouponId: item.userCouponId
              }
            })
        }
      },
      deleteCoupon(index){
        couponService.deleteCoupon({
          userCouponId: this.couponList[index].userCouponId
        }).then(data => {
          this.couponList.splice(index, 1)
        })
      },
      couponCheck(coupon){
        coupon.checked = !coupon.checked
      },
      longPressStart(e){
        if (this.edit) {
          e.stopPropagation()
          return
        }
        this.longPressFlag = false
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
        if (!this.longPressFlag) {
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
    },
    activated(){
      this.editCancel()
    }
  }
</script>
<style lang='scss' rel='stylesheet/scss' type="text/scss">
  .new-my-coupon {
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
    &.notNative {
      bottom: 50px;
    }
    .btn-cancel {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      background: #ffa902;
    }
    .btn-delete {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
    }
  }

  .coupon-swipe {
    background: none !important;
    .mint-cell-title {
      display: none;
    }
    .mint-cell-wrapper {
      margin: 0;
      padding: 0;
      background: none;
      border: none;
    }
    .mint-cell-value {
      width: 100%;
    }
    .coupon-wrap {
      width: 100%;
      .coupon-item {
        display: flex;
        padding: 8px 8px;
        background-repeat: no-repeat;
        background-size: 100% 90px;
        box-sizing: border-box;
        margin: 0px 8px 5px 8px;
        position: relative;
        background-image: url("../../assets/img/coupon/quan01.png");
        /* &.isUsed {
           background-image: url('../../assets/img/coupon/a1.png') !important;
         }*/
        &.isOffLine {
          background-image: url("../../assets/img/coupon/quan04.png");
        }
        .topic-img {
          width: 66px;
          height: 66px;
          text-align: center;
          overflow: hidden;
          background-size: 100% 100%;
          background-position: center;
          background-repeat: no-repeat;
          border-radius: 5px;
          margin-top: 4px;
          margin-left: 2px;
        }
        .item-content {
          flex: 1;
          margin-left: 10px;
          position: relative;
          padding-top: 5px;
          overflow: hidden;
          .price1, .price2 {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-bottom: 0;
            padding: 0;
            margin-top: 16px;
            width: 90%;
            color: #64b3f8;
            font-size: 12px;
            &.isOffLine {
              color: #b9995a;
            }
            span {
              font-size: 22px;
              font-weight: 600;
            }
          }
          .item-content-door {
            margin-bottom: 0;
            padding: 0;
            display: flex;
            width:90%;
            .name {
              color: #343434;
              font-size: 13px;
              font-weight: bold;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              flex: 1;
              height: 15px;
              display: block;
              justify-content: flex-start;
              align-items: center;
              width:100%;
              padding:1px;
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
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 12px;
            color: #343434;
            margin-top: 8px;
          }
          .mail-type {
            position: absolute;
            right: 10px;
            top: 58px;
            display: inline-block;
            font-size: 12px;
            color: #64b3f8;
            &.isOffLine {
              color: #b9995a;
            }
          }
        }
        .item-button {
          width: 22%;
          position: relative;
          height: 75px;
          z-index: 2;
          .button-wrap {
            height: 100%;
            position: relative;
            padding-top: 10px;
            .number {
              text-align: center;
              padding-bottom: 8px;
              color: #ffffff;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              font-size: 20px;
              span {
                font-size: 14px;
              }
            }
            .receive {
              background-color: #fbec4f !important;
            }
            i {
              display: flex;
              align-items: center;
              justify-content: center;
              font-style: normal;
              text-align: center;
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
              // border: solid 2px #4a9ef3;
              &.isOffLine {
                background-color: #ffffff;
                color: #b9995a;
                // border: solid 2px #a38140;
              }
              &.offLineDone {
                background-color: #a38140;
                //  border: solid 2px #a38140;
                color: #b9995a;
              }
              &.lineDone {
                background-color: #4a9ef3;
                //  border: solid 2px #4a9ef3;
                color: #8bc7fc;
              }
            }
          }
        }
      }
    }
  }

  .mint-cell-swipe-buttongroup {
    padding-bottom: 5px;
  }
</style>

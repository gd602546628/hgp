<template>
  <div>
    <div class="flex-box">
      <ul class="flex-ul">
        <li class="flex-li"
            v-for="(item,index) in titleData"
            @click="chose(item,index)"
            :class='{active:index==num}'>
          {{item.title}}
        </li>
      </ul>
    </div>
    <div>
      <!--全部-->
      <div v-if="num==0">
        <div v-for="item in doorDateLists">
          <!--标题和状态部分-->
          <div class="all-list-title">
            <div class="all-list-left">
              <img src="../../assets/img/bai_bg.png"/>
              <span class="door-name">{{item.doorname}}</span>
            </div>
            <span class="order-state">{{orderStates[item.orderstate]}}</span>
          </div>
          <!--店铺名称图片-->
          <div class="all-list-conent">
            <img src="../../assets/img/test.png"/>
            <div class="all-list-font">
              <p class="all-list-details">{{item.title}}</p>
              <span class="all-list-norms">{{item.fcname}}：<span>{{item.fcValue}}</span></span>
              <div>
                <span class="all-list-num">x{{item.prdNum}}</span>
                <p class="all-list-price"><span>￥</span>{{trunc(item.price)}}<span>.{{point(float(item.price))}}</span>
                </p>
              </div>
            </div>
          </div>
          <!--统计商品-->
          <div class="all-list-statis">
            <span class="all-list-total-list">共{{item.prdNum}}件商品 实付款：</span>
            <p class="all-list-total-price">
              <span>￥</span>{{trunc(item.price)}}<span>.{{point(float(item.price))}}</span></p>
          </div>
          <div class="all-list-statis" v-if="item.state==4">
            <span class="all-list-cancel-order">取消订单</span>
            <span class="all-list-pay">去支付</span>
          </div>
          <!--提醒发货-->
          <div class="all-list-remind" v-if="item.state==0">
            <span>提醒发货</span>
          </div>
          <!--删除订单-->
          <div class="all-list-delete" v-if="item.state==2">
            <span>删除订单</span>
          </div>
          <div class="all-list-statis" v-if="item.state==3">
            <span class="all-list-cancel-order">物流查询</span>
            <span class="all-list-pay">确认收货</span>
          </div>
          <div class="all-list-statis" v-if="item.state==1">
            <span class="all-list-cancel-order">追加评价</span>
            <span class="all-list-pay">修改评价</span>
          </div>
          <!--评价-->
          <div class="all-list-remind" v-if="item.state==5">
            <span>评价</span>
          </div>
        </div>
      </div>

      <!--待付款-->
      <div v-else-if="num==1">
        <div v-for="item in obligationDateLists">
          <!--标题和状态部分-->
          <div class="all-list-title">
            <div class="all-list-left">
              <img src="../../assets/img/bai_bg.png"/>
              <span class="door-name">{{item.doorname}}</span>
            </div>
            <span class="order-state">{{orderStates[item.orderstate]}}</span>
          </div>
          <!--店铺名称图片-->
          <div class="all-list-conent">
            <img src="../../assets/img/test.png"/>
            <div class="all-list-font">
              <p class="all-list-details">{{item.title}}</p>
              <span class="all-list-norms">{{item.fcname}}：<span>{{item.fcValue}}</span></span>
              <div>
                <span class="all-list-num">x{{item.prdNum}}</span>
                <p class="all-list-price"><span>￥</span>{{trunc(item.price)}}<span>.{{point(float(item.price))}}</span>
                </p>
              </div>
            </div>
          </div>
          <!--统计商品-->
          <div class="all-list-statis">
            <span class="all-list-total-list">共{{item.prdNum}}件商品 实付款：</span>
            <p class="all-list-total-price">
              <span>￥</span>{{trunc(item.price)}}<span>.{{point(float(item.price))}}</span></p>
          </div>
          <div class="all-list-statis" v-if="item.state ==0">
            <span class="all-list-cancel-order">取消订单</span>
            <span class="all-list-pay">去支付</span>
          </div>
        </div>
      </div>

      <!--待发货-->
      <div v-else-if="num==2">
        <div v-for="item in orderDateLists">
          <!--标题和状态部分-->
          <div class="all-list-title">
            <div class="all-list-left">
              <img src="../../assets/img/bai_bg.png"/>
              <span class="door-name">{{item.doorname}}</span>
            </div>
            <span class="order-state">{{orderStates[item.orderstate]}}</span>
          </div>
          <!--店铺名称图片-->
          <div class="all-list-conent">
            <img src="../../assets/img/test.png"/>
            <div class="all-list-font">
              <p class="all-list-details">{{item.title}}</p>
              <span class="all-list-norms">{{item.fcname}}：<span>{{item.fcValue}}</span></span>
              <div>
                <span class="all-list-num">x{{item.prdNum}}</span>
                <p class="all-list-price"><span>￥</span>{{trunc(item.price)}}<span>.{{point(float(item.price))}}</span>
                </p>
              </div>
            </div>
          </div>
          <!--统计商品-->
          <div class="all-list-statis">
            <span class="all-list-total-list">共{{item.prdNum}}件商品 实付款：</span>
            <p class="all-list-total-price">
              <span>￥</span>{{trunc(item.price)}}<span>.{{point(float(item.price))}}</span></p>
          </div>
          <!--提醒发货-->
          <div class="all-list-remind" v-if="item.state!=2">
            <span>提醒发货</span>
          </div>
        </div>
      </div>

      <!--待收货-->
      <div v-else-if="num==3">
        <div v-for="item in waitDatas">
          <!--标题和状态部分-->
          <div class="all-list-title">
            <div class="all-list-left">
              <img src="../../assets/img/bai_bg.png"/>
              <span class="door-name">{{item.doorname}}</span>
            </div>
            <span class="order-state">{{orderStates[item.orderstate]}}</span>
          </div>
          <!--店铺名称图片-->
          <div class="all-list-conent">
            <img src="../../assets/img/test.png"/>
            <div class="all-list-font">
              <p class="all-list-details">{{item.title}}</p>
              <span class="all-list-norms">{{item.fcname}}：<span>{{item.fcValue}}</span></span>
              <div>
                <span class="all-list-num">x{{item.prdNum}}</span>
                <p class="all-list-price"><span>￥</span>{{trunc(item.price)}}<span>.{{point(float(item.price))}}</span>
                </p>
              </div>
            </div>
          </div>
          <!--统计商品-->
          <div class="all-list-statis">
            <span class="all-list-total-list">共{{item.prdNum}}件商品 实付款：</span>
            <p class="all-list-total-price">
              <span>￥</span>{{trunc(item.price)}}<span>.{{point(float(item.price))}}</span></p>
          </div>
          <div class="all-list-statis" v-if="item.state!=3">
            <span class="all-list-cancel-order">物流查询</span>
            <span class="all-list-pay">确认收货</span>
          </div>
        </div>
      </div>

      <!--已完成-->
      <div v-else-if="num==4">
        <div v-for="item in finishDateLists">
          <!--标题和状态部分-->
          <div class="all-list-title">
            <div class="all-list-left">
              <img src="../../assets/img/bai_bg.png"/>
              <span class="door-name">{{item.doorname}}</span>
            </div>
            <span class="order-state">{{orderStates[item.orderstate]}}</span>
          </div>
          <!--店铺名称图片-->
          <div class="all-list-conent">
            <img src="../../assets/img/test.png"/>
            <div class="all-list-font">
              <p class="all-list-details">{{item.title}}</p>
              <span class="all-list-norms">{{item.fcname}}：<span>{{item.fcValue}}</span></span>
              <div>
                <span class="all-list-num">x{{item.prdNum}}</span>
                <p class="all-list-price"><span>￥</span>{{trunc(item.price)}}<span>.{{point(float(item.price))}}</span>
                </p>
              </div>
            </div>
          </div>
          <!--统计商品-->
          <div class="all-list-statis">
            <span class="all-list-total-list">共{{item.prdNum}}件商品 实付款：</span>
            <p class="all-list-total-price">
              <span>￥</span>{{trunc(item.price)}}<span>.{{point(float(item.price))}}</span></p>
          </div>
          <div class="all-list-statis" v-if="item.state!=1 && item.state!=3 && item.state!=2 && item.state!=0">
            <span class="all-list-cancel-order">追加评价</span>
            <span class="all-list-pay">修改评价</span>
          </div>
          <!--评价-->
          <div class="all-list-remind" v-if="item.state!=4">
            <span>评价</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: '/orderList',
    data() {
      return {
        num: 0,
        showList: false,
        titleData: [{'title': '全部'}, {'title': '待付款'}, {'title': '待发货'}, {'title': '待收货'}, {'title': '已完成'}],
        listDate: [{'num': 1}, {'num': 2}, {'num': 3}, {'num': 4}, {'num': 5}],
        doorDateLists: [
          {
            'doorname': '大兄弟旗舰店',
            'state': '0',
            'orderstate': '1',
            'title': '大兄弟牌饮料，贼好喝，还是原来的味道，还是原来的情怀，激情满满500ml装',
            'fcname': '规格',
            'fcValue': '统一规格',
            'prdNum': '1',
            'price': '70.00'
          },
          {
            'doorname': 'Nike旗舰店',
            'state': '1',
            'orderstate': '3',
            'title': 'Nike Air系列超轻运动鞋，就是要just do it',
            'fcname': '规格',
            'fcValue': '统一规格',
            'prdNum': '2',
            'price': '765.456'
          },
          {
            'doorname': '大兄弟旗舰店',
            'state': '3',
            'orderstate': '2',
            'title': '大兄弟牌饮料，贼好喝，还是原来的味道，还是原来的情怀，激情满满500ml装',
            'fcname': '规格',
            'fcValue': '统一规格',
            'prdNum': '1',
            'price': '70.00'
          },
          {
            'doorname': 'Nike旗舰店',
            'state': '2',
            'orderstate': '4',
            'title': 'Nike Air系列超轻运动鞋，就是要just do it',
            'fcname': '规格',
            'fcValue': '统一规格',
            'prdNum': '2',
            'price': '765.456'
          }
        ],
        obligationDateLists: [
          {
            'doorname': '大兄弟旗舰店',
            'state': '0',
            'orderstate': '0',
            'title': '大兄弟牌饮料，贼好喝，还是原来的味道，还是原来的情怀，激情满满500ml装',
            'fcname': '规格',
            'fcValue': '统一规格',
            'prdNum': '1',
            'price': '70.00'
          },
          {
            'doorname': 'Nike旗舰店',
            'state': '0',
            'orderstate': '0',
            'title': 'Nike Air系列超轻运动鞋，就是要just do it',
            'fcname': '规格',
            'fcValue': '统一规格',
            'prdNum': '2',
            'price': '765.456'
          }
        ],
        orderDateLists: [
          {
            'doorname': '大兄弟旗舰店',
            'state': '1',
            'orderstate': '1',
            'title': '大兄弟牌饮料，贼好喝，还是原来的味道，还是原来的情怀，激情满满500ml装',
            'fcname': '规格',
            'fcValue': '统一规格',
            'prdNum': '1',
            'price': '70.00'
          },
          {
            'doorname': 'Nike旗舰店',
            'state': '1',
            'orderstate': '1',
            'title': 'Nike Air系列超轻运动鞋，就是要just do it',
            'fcname': '规格',
            'fcValue': '统一规格',
            'prdNum': '2',
            'price': '765.456'
          }
        ],
        waitDatas: [
          {
            'doorname': '大兄弟旗舰店',
            'state': '2',
            'orderstate': '2',
            'title': '大兄弟牌饮料，贼好喝，还是原来的味道，还是原来的情怀，激情满满500ml装',
            'fcname': '规格',
            'fcValue': '统一规格',
            'prdNum': '1',
            'price': '70.00'
          },
          {
            'doorname': 'Nike旗舰店',
            'state': '2',
            'orderstate': '2',
            'title': 'Nike Air系列超轻运动鞋，就是要just do it',
            'fcname': '规格',
            'fcValue': '统一规格',
            'prdNum': '2',
            'price': '765.456'
          }
        ],
        finishDateLists: [
          {
            'doorname': '大兄弟旗舰店',
            'state': '4',
            'orderstate': '3',
            'title': '大兄弟牌饮料，贼好喝，还是原来的味道，还是原来的情怀，激情满满500ml装',
            'fcname': '规格',
            'fcValue': '统一规格',
            'prdNum': '1',
            'price': '70.00'
          },
          {
            'doorname': 'Nike旗舰店',
            'state': '2',
            'orderstate': '3',
            'title': 'Nike Air系列超轻运动鞋，就是要just do it',
            'fcname': '规格',
            'fcValue': '统一规格',
            'prdNum': '2',
            'price': '765.456'
          }
        ],
        orderStates: {'0': '等待付款', '1': '等待发货', '2': '待收货', '3': '已完成', '4': '已失效'}
      }
    },
    methods: {
      chose(item, index) {
        this.num = index
      },
      show(){
        this.showList = true
      },
      hide(){
        this.showList = false
      },
      // 整数部分过滤
      trunc (val) {
        let value
        if (val) {
          value = val
        } else {
          value = '0'
        }
        return parseInt(value)
      },
      // 小数部分过滤，保留两位
      float (val) {
        let value
        if (val) {
          value = val
        } else {
          value = '0.00'
        }
        return parseFloat(value).toFixed(2)
      },
      // 小数部分过滤，取整数部分
      point (val) {
        let value
        if (val) {
          value = val.toString().split('.')
        }
        return value[1]
      }
    }
  }
</script>
<style rel="stylesheet/scss" scoped lang="scss">
  .flex-box {
    display: flex;
    width: 100%;
    justify-content: space-around;
    align-items: center;
    border-bottom: 1px solid #f5f5f9;
    .flex-ul {
      height: 100%;
      white-space: nowrap;
      font-size: 14px;
      margin-left: -10px;
      .flex-li {
        height: 40px;
        color: #000;
        line-height: 40px;
        list-style: none;
        display: inline-block;
        margin-left: 20px;
        &.active {
          border-bottom: 3px solid #0164a6;
          color: #0164a6;
        }
      }
    }
  }

  .all-list-title {
    width: 100%;
    display: flex;
    justify-content: space-between;
    height: 30px;
    align-content: center;
    .all-list-left {
      margin-left: 10px;
      display: flex;
      align-content: center;
      img {
        height: 24px;
        width: 24px;
        margin-top: 3px;
      }
      .door-name {
        text-align: center;
        line-height: 30px;
        font-size: 13px;
        margin-left: 5px;
      }
    }
    .order-state {
      margin-right: 10px;
      line-height: 30px;
      font-size: 12px;
      color: #0164a6;
    }
  }

  .all-list-conent {
    background-color: #f5f5f9;
    display: flex;
    justify-content: flex-start;
    padding: 2%;
    img {
      height: 100%;
      width: 70px;
      margin-right: 10px;
    }
    .all-list-font {
      display: flex;
      justify-content: space-around;
      flex-direction: column;
      align-content: space-around;
      width: 100%;
      .all-list-details {
        font-size: 14px;
        text-overflow: ellipsis;
        overflow: hidden;
        -webkit-line-clamp: 2;
        display: -webkit-box;
        word-break: break-all;
        -webkit-box-orient: vertical;
      }
      .all-list-norms {
        font-size: 12px;
        color: #9e9e9e;
      }
      div {
        display: flex;
        justify-content: space-between;
        .all-list-num {
          color: #2d2d2d;
          font-size: 13px;
        }
        .all-list-price {
          margin-right: 5px;
          color: #0164a6;
          font-size: 16px;
          span {
            font-size: 12px;
          }
        }
      }
    }
  }

  .all-list-statis {
    border-bottom: 1px solid #f5f5f9;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 2%;
    .all-list-total-list {
      font-size: 12px;
      margin-left: 5px;
    }
    .all-list-total-price {
      font-size: 16px;
      span {
        font-size: 12px;
      }
    }

    .all-list-cancel-order {
      height: 24px;
      width: 60px;
      border: 1px solid #9e9e9e;
      margin-top: 3px;
      text-align: center;
      border-radius: 3px;
      font-size: 12px;
      display: flex;
      margin-right: 5px;
      justify-content: center;
      align-items: center;
    }
    .all-list-pay {
      height: 24px;
      width: 60px;
      margin-top: 3px;
      color: #0164a6;
      font-size: 12px;
      border: 1px solid #0164a6;
      text-align: center;
      border-radius: 3px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .all-list-remind {
    border-bottom: 1px solid #f5f5f9;
    font-size: 13px;
    display: flex;
    justify-content: flex-end;
    padding: 2%;
    span {
      height: 24px;
      width: 66px;
      border: 1px solid #9e9e9e;
      border-radius: 3px;
      margin-top: 3px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .all-list-delete {
    border-bottom: 1px solid #f5f5f9;
    font-size: 13px;
    display: flex;
    justify-content: flex-end;
    padding: 2%;
    span {
      height: 24px;
      width: 66px;
      border: 1px solid #ff3c3c;
      border-radius: 3px;
      color: #ff3c3c;
      margin-top: 3px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
</style>

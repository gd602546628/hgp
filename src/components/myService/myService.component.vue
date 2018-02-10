<template>
  <div class="my-service">
    <div class="list-item" v-for="item in data" @click="goDetail(item)">
      <div class="item-avatar" :style="{backgroundImage:'url('+topicImg(item)+')'}"></div>
      <div class="item-name">{{item.serviceName}}</div>
      <div class="item-status">
        <p class="color-red" v-if="item.applyStatus==3">预约成功</p>
        <p class="color-red" v-if="item.applyStatus==0">待审核</p>
        <p class="color-red" v-if="item.applyStatus==2">待预定</p>
        <p class="color-yellow" v-if="item.applyStatus==4">已办理</p>
        <p class="color-yellow" v-if="item.applyStatus==1">已拒绝</p>
      </div>
    </div>
  </div>
</template>
<script>
  import {Config} from '@/config/config'
  export default{
    props: {
      'data': {
        type: Array,
        required: true
      }
    },
    methods: {
      topicImg(item){ // 图片添加前缀
        return Config.imgPrefix + item.titleImage
      },
      goDetail(item){
        this.$router.push({name: 'myServiceDetail', params: {id: item.id}})
      }
    }
  }
</script>
<style lang='scss' rel='stylesheet/scss' scoped>
  .my-service {
    .list-item {
      display: flex;
      align-items: center;
      justify-content: center;
      border-bottom: 1px solid #dddddd;
      height: 100px;
      padding: 10px;
      box-sizing: border-box;
      .item-avatar {
        width: 80px;
        height: 80px;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
      }
      .item-name {
        flex: 1;
        display: flex;
        height: 100%;
        align-items: flex-start;
        padding-top: 10px;
        box-sizing: border-box;
        font-size: 16px;
        color: #2d2d2d;
        margin-left: 10px;
      }
      .item-status {
        .color-yellow {
          color: #ffc001
        }
        .color-red {
          color: #ff3c3c
        }
      }
    }
  }
</style>

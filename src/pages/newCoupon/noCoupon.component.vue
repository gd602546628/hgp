<template>
  <div class="no-coupon">
    <div class="top">
      <i class="icon-zyt-no-coupon"></i>
      <p>您还没领到优惠券</p>
    </div>
    <div class="button" @click="goMain()">去看看哪些优惠</div>
  </div>
</template>
<script>
  export default {
    methods: {
      goMain(){
        this.$router.push({
          name: 'couponCenter'
        })
      }
    }
  }
</script>
<style lang='scss' rel='stylesheet/scss' scoped>
  .no-coupon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    position: fixed;
    top: 50%;
    left: 50%;
    margin-top: -96px;
    margin-left: -90px;
    .top {
      color: #9b9b9b;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      border: none;
      background: none;
      p {
        font-size: 16px;
      }
      i {
        font-size: 70px;
        margin-bottom: 10px;
        color: #e4e4e4;
      }
    }
    .button {
      width: 180px;
      height: 44px;
      color: #0164a6;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #0164a6;
      border-radius: 8px;
      margin-top: 40px;
    }
  }
</style>

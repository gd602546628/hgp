<template>
  <div class="login-footer">
    <div class="login-footer-box">
      <img src="../../assets/img/me/hao_gp.png">
      <div>
        <p>好公仆&#12288;好优惠</p>
        <p>点击下载领取更多优惠</p>
      </div>
    </div>
      <a class="now-download" href="http://m.jointem.com/mobilJointem/zyb.html">立即下载</a>
  </div>
</template>
<script>

</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .login-footer {
    background-color: #dce0e7;
    display: -webkit-flex;
    -webkit-justify-content: space-between;
    -webkit-align-items: center;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 10px;
    width:100%;
    .login-footer-box{
      display: flex;
      display: -webkit-flex;
      -webkit-justify-content: flex-start;
      -webkit-align-items: center;
      justify-content: flex-start;
      align-items: center;
      width:70%;
      img{
        height: 42px;
        width: 42px;
        display: block;
      }
      div{
        display: -webkit-flex;
        display: flex;
        -webkit-flex-direction: column;
        -webkit-justify-content: flex-start;
        flex-direction: column;
        justify-content: flex-start;
        margin-left: 10px;
        width: 100%;
        height:100%;
      }
    }
      .now-download{
        border: 1px solid #066cc2;
        padding: 5px 7px;
        color: #066cc2;
        border-radius: 4px;
        text-decoration: none;
      }
  }
</style>

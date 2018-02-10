<template lang="html">
  <zyt-page>
    <div slot="main">
    <textarea placeholder="商品满足你的期待吗？说说它的优点和美中不足的地方吧" v-model="commentDetails"
              class="comment-comment-text-box"></textarea>
      <div class="comment-submite-box" @click="submit()">
        <div>回复评价</div>
      </div>
    </div>
  </zyt-page>
</template>
<script>
  import star from '@/components/score/star.component'
  import getAmendComment from '@/api/comment/commentList.api'
  import Util from '@/service/common/utils/util.service'
  export default{
    name: 'replayComment',
    data () {
      return {
        commentDetails: '', // 用户评价内容
        replayData: ''
      }
    },
    components: {
      'zyt-star': star
    },
    methods: {
      submit(){ // 提交评价
        let replayParams = { // todo 回复的参数
          commentId: this.$route.params.commentId,  // 评论id
          replyContent: this.commentDetails // 回复内容
        }
        if (replayParams.replyContent === '') {
          Util.alert({
            message: '请输入评价内容！'
          })
        } else {
          getAmendComment.getReplayComment(replayParams).then(async data => {
            if (data.code === '000000') {
              await Util.alert({
                message: '回复评价成功！'
              })
              this.$router.back()
            }
          })
        }
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .comment-comment-text-box {
    width: 100%;
    height: 200px;
    padding: 10px;
    font-size: 13px;
    resize: none;
    border: 0;
    border-bottom: 1px solid #ddd;
  }

  .comment-submite-box {
    div {
      width: 92%;
      margin: 4%;
      padding: 10px;
      background-color: #066cc2;
      color: #fff;
      border-radius: 5px;
      display: -webkit-flex;
      -webkit-justify-content: center;
      -webkit-align-items: center;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .replay-comment-button {
    width: 100%;
    background-color: #066cc2;
    color: #ffffff;
  }
</style>

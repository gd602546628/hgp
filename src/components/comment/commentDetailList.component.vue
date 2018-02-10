/**
* Created by ljl on 2017/7/4.
*/
<template>
  <div v-if="hasComment">
    <div class="comment-top-box">
      <div class="comment-top-left-box">
        <div></div>
        <span>商品评价</span>
      </div>
      <div class="comment-top-look-more" @click="goLookMore()" v-if="commentListData.length!=0">查看更多</div>
    </div>
    <div class="comment-list-box" v-for="item in commentListData">
      <div class="comment-list-top-box">
        <p>{{item.userName}}</p>
        <zyt-star :bgSize="20" :star="parseInt(item.star)" :isStar="false"></zyt-star>
      </div>
      <div class="comment-list-conent">{{item.content}}</div>
    <div class="comment-more-list-norm">
      <span class="comment-more-time">{{commentTime(item.createTime)}}</span>
      <div v-if="item.fpName && item.fpValue">
        <span>{{item.fpName}}</span>:
        <span>{{item.fpValue}}</span>
      </div>
      <div v-if="item.spName && item.spValue" class="second-specification-box">
        <span>{{item.spName}}</span>:
        <span>{{item.spValue}}</span>
      </div>
    </div>
    </div>
  </div>
</template>
<script>
  import star from '@/components/score/star.component'
  export default {
    props: {
      commentListData: {
        type: Array || Object
      }
    },
    computed: {
      hasComment(){
        return this.commentListData.length > 0
      }
    },
    components: {
      'zyt-star': star
    },
    methods: {
      /* getCommentList(){
       let params = {
       doorId: this.$route.params.doorId,
       prdId: this.$route.params.prdId
       }
       getCommentList.getCommentList(params).then(data => {
       this.commentListData = data.list
       this.$emit('hasComment', this.hasComment)
       })
       }, */
      commentTime(time){
        let comment = new Date(time.replace(/-/g, '/')).getTime()
        let commentTime = `${new Date(comment).getFullYear()}-${new Date(comment).getMonth() + 1}-${new Date(comment).getDate()}`
        return commentTime
      },
      goLookMore(){ /* 跳转评论详情页 */
        this.$router.push({
          name: 'commentList',
          params: {prdId: this.$route.params.prdId, doorId: this.$route.params.doorId}
        })
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .comment-top-box {
    display: -webkit-flex;
    -webkit-justify-content: space-between;
    -webkit-align-items: center;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f4f4f4;

  .comment-top-left-box {
    display: -webkit-flex;
    -webkit-justify-content: flex-start;
    -webkit-align-items: center;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 10px 5px 10px 0;

  div {
    height: 21px;
    width: 5px;
    background-color: #0164a6;
  }

  span {
    margin-left: 5px;
    font-size: 16px;
  }

  }
  .comment-top-look-more {
    margin-right: 10px;
    color: #066cc2;
  }

  }

  .comment-list-box {
    display: -webkit-flex;
    -webkit-flex-direction: column;
    display: flex;
    flex-direction: column;
    margin: 10px;
    border-bottom: 1px solid #f4f4f4;

  .comment-list-top-box {
    display: -webkit-flex;
    -webkit-justify-content: space-between;
    -webkit-align-items: center;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;

  p {
    font-size: 14px;
  }

  }
  .comment-list-conent {
    margin-bottom: 10px;
    font-size: 12px;
  }
    .comment-more-list-norm {
      display: -webkit-flex;
      -webkit-justify-content: flex-start;
      justify-content: flex-start;
      -webkit-align-items: center;
      align-items: center;
      font-size: 12px;
      color: #9e9e9e;
      .comment-more-time {
        margin-right: 5px;
      }
      .second-specification-box{
      margin-left: 10px;
      }
    }
  }
</style>

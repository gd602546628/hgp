/**
 * Created by ljl on 2017/7/4.
 */
export function commentAdaptor (item){
  let result = {
    userName: item.userName, // 用户名称
    star: item.star, // 用户评分
    content: item.content, // 评价内容
    appendContent: item.appendContent, // 追加评论内容
    replyList: item.replyList, // 回复内容
    createTime: item.createTime, // 评价时间
    fpName: item.fpName, // 第一分类名称
    fpValue: item.fpValue, // 第一分类对应的值
    spName: item.spName, // 第二分类名称
    spValue: item.spValue, // 第二分类的值
    commentId: item.commentId, // 评论id
    commentImg: item.commentImg, // 评论图片
    arrCommentImg: item.arrCommentImg // 评价图片数组
  }
  return result
}

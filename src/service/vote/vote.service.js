/**
 * Created by gd on 2017/11/1/001.
 */
import {Config} from '../../config/config'
import http from '@/service/common/http/http.service'
class Vote {
  constructor() {
    this.getVoteInfoUrl = Config.mfPath + 'voteFront/getVoteByVoteId'
    this.submitVoteUrl = Config.mfPath + 'voteFront/submitVote'
  }

  async getVoteInfo(params) {
    let data = await http.post(this.getVoteInfoUrl, params, {useSimpleQuest: true})
    data.data.options.forEach(item => {
      item.checked = false
    })
    return data.data
  }

  async submitVote(params) {
    let data = await http.post(this.submitVoteUrl, params, {useSimpleQuest: true})
    // let data = await http.post(' http://172.31.61.56:9090/mf/voteFront/submitVote ', params, {useSimpleQuest: true})
    return data
  }
}
export default new Vote()

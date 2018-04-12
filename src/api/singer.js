import jsonp from 'common/js/jsonp'
import {commonParams, opations} from './config'

// import axios from 'axios'
export function getSingerList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    notice: 0,
    platform: 'yqq',
    needNewCode: 0
  })
  return jsonp(url, data, opations)
}

export function getSingerDetail(singerId, num, begin) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
  const data = Object.assign({}, commonParams, {
    singermid: singerId,
    num: num,
    begin: begin,
    uin: 0,
    format: 'json',
    notice: 0,
    platform: 'h5page',
    needNewCode: 1,
    order: 'listen',
    from: 'h5',
    _: 1522481816638
  })
  return jsonp(url, data, opations)
}

import {commonParams, opations} from './config'
import jsonp from 'common/js/jsonp'
import fetch from './fetch'

export function getTopList() {
    // const url = '/api/getTopList'
    // const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'
    const params = Object.assign({}, commonParams, {
        platform: 'h5',
        needNewCode: 1,
        _: 1523180836473,
        format: 'json'
    })
    return fetch({
        url: '/getTopList',
        method: 'GET',
        params
    })
}

export function getMusicList(topid) {
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'
    const data = Object.assign({}, commonParams, {
        // format: 'json',
        platform: 'h5',
        needNewCode: 1,
        tpl: 3,
        page: 'detail',
        type: 'top',
        topid: topid,
        _: 1523276915604
    })
    return jsonp(url, data, opations)
}

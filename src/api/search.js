import {commonParams, opations} from './config'
import jsonp from 'common/js/jsonp'
import fetch from './fetch'

export function getHotKey() {
    const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'
    const data = Object.assign({}, commonParams, {
        platform: 'h5',
        needNewCode: 1,
        _: 1523351503615
    })
    return jsonp(url, data, opations)
}

export function search(query, page, zhida, perpageNum) {
    const params = Object.assign({}, commonParams, {
        p: page,
        w: query,
        catZhida: zhida ? 1 : 0,
        perpage: perpageNum,
        n: perpageNum,
        platform: 'h5',
        needNewCode: 1,
        zhidaqu: 1,
        t: 0,
        flag: 1,
        ie: 'utf-8',
        sem: 1,
        aggr: 0,
        remoteplace: 'txt.mqq.all',
        _: 1523354126756,
        format: 'json'
    })
    return fetch({
        url: '/search',
        method: 'GET',
        params
    })
}

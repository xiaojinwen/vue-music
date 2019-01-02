import jsonp from 'common/js/jsonp'
import {commonParams, opations} from './config'
import fetch from './fetch'

export function getRecommend() {
    const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

    const data = Object.assign({}, commonParams, {
        platform: 'h5',
        uin: 0,
        needNewCode: 1
    })
    return jsonp(url, data, opations)
}

export function getDiscList() {
    const params = Object.assign({}, commonParams, {
        platform: 'yqq',
        hostUin: 0,
        needNewCode: 0,
        sortId: 5,
        sin: 0,
        ein: 29,
        jsonpCallback: 'getPlaylist',
        categoryId: 10000000,
        rnd: Math.random(),
        format: 'json'
    })
    return fetch({
        url: '/getDiscList',
        method: 'GET',
        params
    })
}

export function getSongList(disstid) {
    const params = Object.assign({}, commonParams, {
        disstid,
        type: 1,
        json: 1,
        utf8: 1,
        onlysong: 0,
        hostUin: 0,
        needNewCode: 0,
        platform: 'yqq',
        jsonpCallback: 'songList'
    })
    return fetch({
        url: '/getSongList',
        method: 'GET',
        params
    })
}

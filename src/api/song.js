import {commonParams} from './config'
import fetch from './fetch'

export function getMusic(strMediaMid, musicQuality) {
    const params = Object.assign({}, commonParams, {
        songmid: strMediaMid,
        uin: 0,
        hostUin: 0,
        format: 'json',
        notice: 0,
        platform: 'yqq',
        needNewCode: 0,
        cid: 205361747,
        guid: 5150825362,
        // filename: `C400${strMediaMid}.m4a`
        filename: musicQuality === 1 ? `M500${strMediaMid}.mp3` : `C400${strMediaMid}.m4a`
        // filename: filename
        // callback: 'MusicJsonCallback683807489577027',
        // jsonpCallback: 'MusicJsonCallback683807489577027'
    })
    return fetch({
        url: '/getMusic',
        method: 'GET',
        params
    })
}

export function getLyric(mid) {
    const params = Object.assign({}, commonParams, {
        songmid: mid,
        pcachetime: +new Date(),
        platform: 'yqq',
        hostUin: 0,
        needNewCode: 0,
        format: 'json'
        // jsonpCallback: 'MusicJsonCallback_lrc'
    })
    return fetch({
        url: '/lyric',
        method: 'GET',
        params
    })
}

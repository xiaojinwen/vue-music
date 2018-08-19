import {commonParams} from './config'
import axios from 'axios'

export function getMusic(strMediaMid, musicQuality) {
    console.log(musicQuality)
    const url = '/api/getMusic'
    const data = Object.assign({}, commonParams, {
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
    return axios.get(url, {
        params: data
    }).then((res) => {
        return Promise.resolve(res.data)
    }).catch((err) => {
        return Promise.reject(err.code)
    })
}

export function getLyric(mid) {
    const url = '/api/lyric'
    const data = Object.assign({}, commonParams, {
        songmid: mid,
        pcachetime: +new Date(),
        platform: 'yqq',
        hostUin: 0,
        needNewCode: 0,
        format: 'json'
        // jsonpCallback: 'MusicJsonCallback_lrc'
    })
    return axios.get(url, {
        params: data
    }).then((res) => {
        return Promise.resolve(res.data)
    }).catch((err) => {
        return Promise.reject(err.code)
    })
}

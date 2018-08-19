import {getLyric} from 'api/song'
import {ERR_OK} from 'api/config'
import {Base64} from 'js-base64'

export default class Song {
    constructor({id, mid, singer, name, album, duration, image, url, url2}) {
        this.id = id
        this.mid = mid
        this.singer = singer
        this.name = name
        this.album = album
        this.duration = duration
        this.image = image
        this.url = url
        this.url2 = url2
    }

    getLyric() {
        if (this.lyric) {
            return Promise.resolve(this.lyric)
        }
        return new Promise((resolve, reject) => {
            getLyric(this.mid).then((res) => {
                if (res.retcode === ERR_OK) {
                    this.lyric = Base64.decode(res.lyric)
                    // console.log(this.lyric)
                    resolve(this.lyric)
                } else {
                    let str = 'no lyric'
                    reject(str)
                }
            })
        })
    }
}

export function createSong(musicData, musicDetail, musicDetail2) {
    if (!musicDetail) {
        return new Song({
            id: musicData.songid,
            mid: musicData.songmid,
            singer: filterSinger(musicData.singer),
            name: musicData.songname,
            album: musicData.albumname,
            duration: musicData.interval,
            image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
            url: '',
            url2: ''
        })
    }
    return new Song({
        id: musicData.songid,
        mid: musicData.songmid,
        singer: filterSinger(musicData.singer),
        name: musicData.songname,
        album: musicData.albumname,
        duration: musicData.interval,
        image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
        url: `http://dl.stream.qqmusic.qq.com/${musicDetail.filename}?vkey=${musicDetail.vkey}&guid=5150825362&uin=0&fromtag=1`,
        url2: `http://dl.stream.qqmusic.qq.com/${musicDetail2.filename}?vkey=${musicDetail2.vkey}&guid=5150825362&uin=0&fromtag=1`
    })
}

export function updateUrl(ObjSong, musicDetail) {
    ObjSong.url = `http://dl.stream.qqmusic.qq.com/${musicDetail.filename}?vkey=${musicDetail.vkey}&guid=5150825362&uin=0&fromtag=66`
}
export function updateUrl2(ObjSong, musicDetail) {
    ObjSong.url2 = `http://dl.stream.qqmusic.qq.com/${musicDetail.filename}?vkey=${musicDetail.vkey}&guid=5150825362&uin=0&fromtag=1`
}

function filterSinger(singer) {
    let ret = []
    if (!singer) {
        return ''
    }
    singer.forEach((s) => {
        ret.push(s.name)
    })
    return ret.join('/')
}

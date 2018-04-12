import {getLyric} from 'api/song'
import {ERR_OK} from 'api/config'
import {Base64} from 'js-base64'

export default class Song {
  constructor({id, mid, singer, name, album, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
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
// 'http://dl.stream.qqmusic.qq.com/C400001Qu4I30eVFYb.m4a?vkey=00FF784496BB81E850A7A3E9694B03E3A013C4ED2E0B6E1ABB1D7330C6F668DC04D86403AA4883C406DDDF9D1ECAB510B633A5095FB4FE5A&guid=6416692684&uin=0&fromtag=66'
// items":[{"subcode":0,"songmid":"001Qu4I30eVFYb","filename":"C400001Qu4I30eVFYb.m4a","vkey":"00FF784496BB81E850A7A3E9694B03E3A013C4ED2E0B6E1ABB1D7330C6F668DC04D86403AA4883C406DDDF9D1ECAB510B633A5095FB4FE5A"
export function createSong(musicData, musicDetail) {
  if (!musicDetail) {
    return new Song({
      id: musicData.songid,
      mid: musicData.songmid,
      singer: filterSinger(musicData.singer),
      name: musicData.songname,
      album: musicData.albumname,
      duration: musicData.interval,
      image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
      url: ''
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
    url: `http://dl.stream.qqmusic.qq.com/${musicDetail.filename}?vkey=${musicDetail.vkey}&guid=6416692684&uin=0&fromtag=66`
  })
}

export function updateUrl(ObjSong, musicDetail) {
  ObjSong.url = `http://dl.stream.qqmusic.qq.com/${musicDetail.filename}?vkey=${musicDetail.vkey}&guid=6416692684&uin=0&fromtag=66`
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

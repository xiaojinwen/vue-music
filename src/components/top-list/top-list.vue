<template>
  <transition name="slide">
    <music-list :rank="rank" :songs="songs" :title="title" :bgImage="bgImage"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import MusicList from 'components/music-list/music-list'
  import {mapGetters} from 'vuex'
  import {getMusicList} from 'api/rank'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'
  import {getMusic} from 'api/song'

  export default {
    components: {MusicList},
    name: 'top-list',
    data() {
      return {
        songs: [],
        rank: true
      }
    },
    computed: {
      title() {
        return this.topList.topTitle
      },
      bgImage() {
        if (this.songs.length) {
          return this.songs[0].image
        }
        return ''
      },
      ...mapGetters([
        'topList'
      ])
    },
    created() {
      this._getMusicList()
    },
    methods: {
      _getMusicList() {
        if (!this.topList.id) {
          this.$router.push('/rank')
        }
        getMusicList(this.topList.id).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSongs(res.songlist)
          }
        })
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach((item) => {
          const musicData = item.data
          // console.log(musicData)
          if (musicData.songid && musicData.albumid) {
            getMusic(musicData.strMediaMid).then((res) => {
              if (res.code === ERR_OK) {
                // console.log(res.data.items[0])
                // console.log(res)
                ret.push(createSong(musicData, res.data.items[0]))
              }
            })
          }
        })
        return ret
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition all 0.3s

  .slide-enter, .slide-leave-to
    /*left 100%*/
    transform translate3d(100%, 0, 0)
</style>

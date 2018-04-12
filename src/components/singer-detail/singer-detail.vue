<template>
  <transition name="slide">
    <music-list @getSingerMore="getSingerMore" :songs="songs" :title="title" :bg-image="bgImage"
                :loadingMore="loadingMore"></music-list>
    <!--<div class="singer-detail"></div>-->
  </transition>
</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'
  import {getSingerDetail} from 'api/singer'
  import {getMusic} from 'api/song'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'
  import MusicList from 'components/music-list/music-list'

  const NUM = 20
  export default {
    components: {MusicList},
    name: 'singer-detail',
    data() {
      return {
        songs: [],
        hasMore: true,
        loaded: true,
        begin: 0
      }
    },
    computed: {
      title() {
        return this.singer.name
      },
      bgImage() {
        return this.singer.avatar
      },
      loadingMore() {
        if (!this.songs.length) {
          return false
        } else {
          return this.hasMore
        }
      },
      ...mapGetters([
        'singer'
      ])
    },
    created() {
      this._getDetail()
      // console.log(this.singer)
    },
    methods: {
      getSingerMore() {
        if (!this.hasMore) {
          return
        }
        if (!this.loaded) {
          return
        }
        this.loaded = false
        this.begin += NUM
        // console.log('加载更多')
        getSingerDetail(this.singer.id, NUM, this.begin).then((res) => {
          if (res.code === ERR_OK) {
            let temp = this._normalizeSongs(res.data.list)
            setTimeout(() => {
              this.songs = this.songs.concat(temp)
              // console.log(temp)
              // console.log(this.songs)
              this._checkMore(res.data)
              this.loaded = true
            }, 600)
          }
        })
      },
      _checkMore(data) {
        // let song = data.song
        if (!data.list.length || (NUM + this.begin) >= data.total) {
          this.hasMore = false
        } else {
          this.hasMore = true
        }
      },
      _getDetail() {
        if (!this.singer.id) {
          this.$router.push('/singer')
          return
        }
        this.hasMore = true
        this.begin = 0
        getSingerDetail(this.singer.id, NUM, this.begin).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSongs(res.data.list)
            // console.log(this.songs)
            this._checkMore(res.data)
          }
        })
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach((item) => {
          // musicData=item.musicData
          let {musicData} = item
          if (musicData.songid && musicData.albummid) {
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
  @import "~common/stylus/variable"
  /*  .singer-detail
      position fixed
      z-index 100
      top 0
      left 0
      right 0
      bottom 0
      background $color-background*/

  .slide-enter-active, .slide-leave-active
    transition all 0.3s

  .slide-enter, .slide-leave-to
    /*left 100%*/
    transform translate3d(100%, 0, 0)
</style>

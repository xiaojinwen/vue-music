<template>
  <transition name="slide">
    <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import MusicList from 'components/music-list/music-list'
  import {mapGetters} from 'vuex'
  import {getSongList} from 'api/recommend'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'

  export default {
    components: {MusicList},
    name: 'disc',
    data() {
      return {
        songs: []
      }
    },
    computed: {
      title() {
        return this.disc.dissname
      },
      bgImage() {
        return this.disc.imgurl
      },
      ...mapGetters([
        'disc'
      ])
    },
    created() {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        this._getSongList()
      }, 300)
      // console.log(this.disc)
    },
    methods: {
      _getSongList() {
        if (!this.disc.dissid) {
          this.$router.push('/recommend')
        }
        getSongList(this.disc.dissid).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSongs(res.cdlist[0].songlist)
          }
        })
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach((musicData) => {
          if (musicData.songid && musicData.albumid) {
            ret.push(createSong(musicData, null))
          }
        })
        return ret
      }
    },
    watch: {
      disc() {
        this._getSongList()
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

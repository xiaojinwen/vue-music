<template>
  <scroll class="suggest"
          :data="result"
          :pullup="pullup"
          @scrollToEnd="searchMore" ref="suggest">
    <ul class="suggest-list">
      <li @click.stop.prevent="selectItem(item)" class="suggest-item" v-for="(item,index) in result" :key="index">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import {search} from 'api/search'
  import {ERR_OK} from 'api/config'
  import {createSong, updateUrl} from 'common/js/song'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import Singer from 'common/js/singer'
  import {mapMutations, mapActions} from 'vuex'
  import {getMusic} from 'api/song'

  const TYPE_SINGER = 'TYPE_SINGER'
  const PERPAGE_NUM = 20

  export default {
    components: {
      Loading,
      Scroll
    },
    name: 'suggest',
    props: {
      query: {
        type: String,
        default: ''
      },
      showSinger: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        page: 1,
        result: [],
        pullup: true,
        hasMore: true
      }
    },
    methods: {
      search() {
        this.hasMore = true
        this.page = 1
        this.$refs.suggest.scrollTo(0, 0)
        search(this.query, this.page, this.showSinger, PERPAGE_NUM).then((res) => {
          if (res.code === ERR_OK) {
            // console.log(res)
            this.result = this._getResult(res.data)
            this._checkMore(res.data)
          }
        })
      },
      searchMore() {
        if (!this.hasMore) {
          return
        }
        this.hasMore = false
        // console.log('加载更多')
        this.page++
        search(this.query, this.page, this.showSinger, PERPAGE_NUM).then((res) => {
          if (res.code === ERR_OK) {
            // console.log(res)
            this.result = this.result.concat(this._getResult(res.data))
            this._checkMore(res.data)
          }
        })
      },
      getIconCls(item) {
        if (item.type === TYPE_SINGER) {
          return 'icon-mine'
        } else {
          return 'icon-music'
        }
      },
      getDisplayName(item) {
        // console.log(item)
        if (item.type === TYPE_SINGER) {
          return item.singername
        } else {
          return `${item.name}-${(item.singer)}`
        }
      },
      selectItem(item) {
        if (item.type === TYPE_SINGER) {
          const singer = new Singer({
            id: item.singermid,
            name: item.sigername
          })
          this.$router.push({
            path: `/search/${singer.id}`
          })
          this.setSinger(singer)
        } else {
          getMusic(item.mid).then((res) => {
            if (res.code === ERR_OK) {
              // console.log(res.data.items[0])
              updateUrl(item, res.data.items[0])
              // console.log(res)
              this.innerSong(item)
            }
          })
          // console.log(item)
        }
      },
      _checkMore(data) {
        let song = data.song
        if (!song.list.length || (song.curnum + song.curpage * PERPAGE_NUM) >= song.totalnum) {
          this.hasMore = false
        } else {
          this.hasMore = true
        }
      },
      _getResult(data) {
        let ret = []
        if (this.page === 1) {
          if (data.zhida && data.zhida.singerid) {
            ret.push({...data.zhida, ...{type: TYPE_SINGER}})
          }
        }
        if (data.song) {
          // console.log(data.song.list)
          ret = ret.concat(this._normalizeSongs(data.song.list))
        }
        return ret
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach((musicData) => {
          if (musicData.songid && musicData.albumid) {
            // console.log(musicData.songmid)
            // getMusic(musicData.songmid).then((res) => {
            //   if (res.code === ERR_OK) {
            //     // console.log(res.data.items[0])
            //     console.log(res)
            //     ret.push(createSong(musicData, res.data.items[0]))
            //   }
            // })
            // console.log(musicData)
            ret.push(createSong(musicData, null))
          }
        })
        return ret
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      ...mapActions([
        'innerSong'
      ])
    },
    watch: {
      query() {
        this.search()
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>

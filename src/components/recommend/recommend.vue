<template>
  <div class="recommend">
    <scroll ref="scroll" :data="discList" class="recommend-content">
      <div>
        <div v-if="this.recommends.length" class="slider-wrapper">
          <slider>
            <div v-for="(item,index) in recommends" :key="index">
              <a :href="item.linkUrl">
                <img class="needsclick" @load="loadImage" :src="item.picUrl"/>
              </a>
            </div>
          </slider>
        </div>
        <div class="recommrnd-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li @click="selectItem(item)" v-for="(item,index) in discList" :key="index" class="item">
              <div class="icon">
                <img width="60" height=60 v-lazy="item.imgurl">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>
<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import {getRecommend, getDiscList} from 'api/recommend'
  import {ERR_OK} from 'api/config'
  import Slider from 'base/slider/slider'
  import Loading from 'base/loading/loading'
  import {playlistMixin} from 'common/js/mixin'
  import {mapMutations} from 'vuex'

  export default {
    mixins: [playlistMixin],
    components: {
      Loading,
      Slider,
      Scroll
    },
    name: 'recommend',
    data() {
      return {
        recommends: [],
        discList: []
      }
    },
    created() {
      this._getRecommend()
      this._getDiscList()
      // setTimeout(() => {
      //
      // }, 2000)
    },
    methods: {
      handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.scroll.$el.style.bottom = bottom
        this.$refs.scroll.refresh()
      },
      selectItem(item) {
        this.$router.push({
          path: `/recommend/${item.dissid}`
        })
        this.setDisc(item)
      },
      _getRecommend() {
        getRecommend().then((res) => {
          if (res.code === ERR_OK) {
            // console.log(res.data.slider)
            this.recommends = res.data.slider
          }
        })
      },
      _getDiscList() {
        getDiscList().then((res) => {
          if (res.code === ERR_OK) {
            // console.log(res.data.list)
            this.discList = res.data.list
          }
        })
      },
      loadImage() {
        if (!this.checkLoaded) {
          this.$refs.scroll.refresh()
          this.checkLoaded = true
        }
      },
      ...mapMutations({
        setDisc: 'SET_DISC'
      })
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .recommend-content
    position absolute
    top 88px
    left 0
    bottom 0
    width 100%
    overflow hidden
    .recommrnd-list
      margin-top 12px
      .list-title
        color: $color-theme
        text-align center
        margin-bottom 12px
        font-size $font-size-medium-x
        line-height $font-size-medium-x
      .item
        display flex
        padding 10px 20px 10px 20px
        align-items center
        .icon
          flex 0 0 70px
        .text
          flex 1
          .name
            color $color-text
            font-size $font-size-medium
            margin 5px 0 12px 0
          .desc
            font-size $font-size-small
            color $color-text-l
    .loading-container
      position absolute
      width 100%
      top 50%
      transform translateY(-50%)
</style>

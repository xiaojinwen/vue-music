<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input ref="box" type="text"
           class="box" v-model="query" :placeholder="placeholder">
    <transition name="slide">
      <i @click="clear" v-show="query" class="icon-dismiss"></i>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'search-box',
    props: {
      placeholder: {
        type: String,
        default: '搜索歌曲,歌手'
      }
    },
    data() {
      return {
        query: ''
      }
    },
    methods: {
      clear() {
        this.query = ''
      },
      setQuery(query) {
        this.query = query
      }
    },
    created() {
      this.$watch('query', (newQuery) => {
        this.$emit('query', newQuery)
      })
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .search-box
    display flex
    align-items center
    box-sizing border-box
    width 100%
    padding 0 6px
    height 40px
    background $color-highlight-background
    border-radius 6px
    .icon-search
      font-size 24px
      color $color-text-ll
    .box
      flex 1
      margin 0 5px
      padding 5px 0 5px 4px
      line-height 18px
      background $color-highlight-background
      color $color-text-ll
      font-size $font-size-medium
      &::placeholder
        color $color-text-l
    .icon-dismiss
      font-size 16px
      color $color-text-ll

  .slide-enter-active, .slide-leave-active
    transition all 0.3s

  .slide-enter, .slide-leave-to
    /*left 100%*/
    transform translate3d(100%, 0, 0)
    opacity 0
  /*.islide-enter-active, .islide-leave-active
    transition width 3s

  .islide-enter, .islide-leave-to
    !*left 100%*!
    !*width  100px*!
    transform translate3d(16px, 0, 0)*/
</style>

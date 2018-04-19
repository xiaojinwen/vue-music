<template>
  <div class="search-list" v-show="searches.length">
    <transition-group name="list" tag="ul">
      <li @click="selectItem(item)" class="search-item" v-for="item in searches" :key="item">
        <span class="text">{{item}}</span>
        <span class="icon" @click.stop="deleteOne(item)" >
            <i class="icon-delete"></i>
          </span>
      </li>
    </transition-group>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'search-list',
    props: {
      searches: {
        type: Array,
        default() {
          return []
        }
      }
    },
    methods: {
      selectItem(item) {
        this.$emit('select', item)
      },
      deleteOne(item) {
        this.$emit('delete', item)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search-list
    .search-item
      display flex
      align-items center
      height 40px
      &.list-enter-active, &.list-leave-active
        transition: all 0.1s
      &.list-enter, &.list-leave-to
        height: 0
        opacity 0
      .text
        flex 1
        color $color-text-l
        font-size $font-size-medium
        no-wrap()
      .icon
        extend-click()
        .icon-delete
          font-size $font-size-small
          color $color-text-d
</style>
